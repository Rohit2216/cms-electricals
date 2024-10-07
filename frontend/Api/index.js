const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const {con} = require('./db');
const Router = require("./routes");
var useragent = require('express-useragent');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000


const app = express()
app.use(express.json());
app.use(fileUpload())
app.use(cors())
app.use(express.static(path.resolve("./public")));
app.use(useragent.express())


con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});




app.get("/",function(request,response){
	response.send("welcome")
});

app.use("/api", Router);

app.listen(port, function () {
	console.log("Started application on port %d", port)
});
