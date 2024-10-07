var moment = require('moment');
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();


const getAllModule = async (req, res) => {

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM modules`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '')
        {
            var selectQuery = `SELECT * FROM modules WHERE title LIKE '%${searchData}%' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }
        else
        {
            var selectQuery = `SELECT * FROM modules ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({status: false, message: err.message });
            
            if(result.length > process.env.VALUE_ZERO)
            {
                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

                res.status(200).json({status: true, message: "Module fetched successfully", data: result, pageDetails: pageDetails});
            }
            else
            {
                return res.status(200).json({status: false, message: "No data found"});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message });    
    }
}

module.exports = {getAllModule}