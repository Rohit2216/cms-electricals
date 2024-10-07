require("dotenv").config();
const moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger } = require("../helpers/validation");
const { checkEmailDuplicacys } = require("../helpers/general");
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const fs = require('fs');
const csv = require('fast-csv');
const bcrypt = require('bcrypt');
const { generatePanelIdForUser, generateSuperAdminEmpId } = require('../helpers/panelHelper');
const { type } = require("os");

const importData = async (req, res) => {

    try {

        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
        }

        const fileName = req.files.data;
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + '/public/importData/' + imageName;
        storePath = '/importData/' + imageName;

        fileName.mv(uploadPath, async (err, response) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            let stream = fs.createReadStream(uploadPath);
            let csvDataColl = [];
            let isFirstRow = true;
            let blankFields = []; // to store row numbers with blank fields
            let rowNumber = 1;
            let hasExtraColumns = false;
            let allowOnlyLetterInNames = false;
            let nameRegexError = [];
            let statusValueCheck = false;
            let allowOnlyNumberInPhones = false;
            let phoneNumberError = [];
            let roleIdError = false;
            let roleIdErrorArray = [];
            let statusValueCheckError = [];
            let emailError = [];
            let emailExistError = false;

            let fileStream = csv
                .parse()
                .on("data", async function (data) {
                    // skip the header row
                    if (isFirstRow) {
                        isFirstRow = false;
                        return;
                    }
                    rowNumber++;

                    // Check if csv file has extra column/value then throw error
                    if (data.length != 20) {
                        hasExtraColumns = true;
                    }

                    // Check if name is blank and add default value
                    if (!data[0]) {
                        blankFields.push(rowNumber);
                    }

                    // Check if name contains only letters
                    const nameRegex = /^[a-zA-Z]+$/;
                    if (!nameRegex.test(data[0])) {
                        allowOnlyLetterInNames = true;
                        nameRegexError.push(rowNumber);
                    }

                    // check if password is empty then add default password value 
                    if (!data[3]) {
                        data[3] = "12345678";
                    }

                    // Validate phone number
                    phoneNumber = data[4];
                    if (!phoneNumber || !/^[0-9]{1,10}$/.test(phoneNumber)) {
                        allowOnlyNumberInPhones = true;
                        phoneNumberError.push(rowNumber);
                    }

                    // Check if status value is valid (0 or 1 )
                    if (data[18] != '0' && data[18] != '1') {
                        statusValueCheck = true;
                        statusValueCheckError.push(rowNumber);
                    }


                    // role_id validation 31
                    roleId = data[19];
                    if (!roleId || !/^[1-9][0-9]*$/.test(roleId)) {
                        roleIdError = true;
                        roleIdErrorArray.push(rowNumber)
                    }
                    csvDataColl.push(data);
                })
                .on("end", async function () {

                    if (hasExtraColumns) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "CSV file has extra columns" });
                    }


                    if (blankFields.length > 0) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Filed is blank in rows: ' + blankFields.join(", ") });
                    }

                    if (allowOnlyLetterInNames) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Name contains invalid characters at rows " + nameRegexError.join(", ") });
                    }

                    if (allowOnlyNumberInPhones) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid phone number at row ' + phoneNumberError.join(", ") });
                    }

                    if (roleIdError) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid role id at row ' + roleIdErrorArray.join(', ') });
                    }


                    if (statusValueCheck) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Status should be either 0 or 1 at rows " + statusValueCheckError.join(", ") });
                    }

                    //csvDataColl.shift();

                    // Hash the password before inserting it into the database
                    const hashedData = csvDataColl.map((row) => {
                        const [name, email, password, base_64_password, mobile, joining_date, address, skills, team_id, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, bank_documents, department, status, role_id
                        ] = row;

                        const salt = bcrypt.genSaltSync(10);
                        const hashedPassword = bcrypt.hashSync(password, salt);

                        return [name, email, password, base_64_password, mobile, joining_date, address, skills, team_id, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, bank_documents, department, status, role_id];
                    });

                    const insertQuery = `INSERT INTO users (name,email,password,base_64_password,mobile,joining_date,address,skills,team_id,employment_status,pan,aadhar,epf_no,esi_no,bank_name,ifsc_code,account_number,bank_documents,department,status,role_id) VALUES (?)`;
                    const queryResult = await db.query(insertQuery, hashedData);

                    if (queryResult.affectedRows > 0) {
                        fs.unlinkSync(uploadPath);
                        return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
                    } else {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No records were inserted" });
                    }
                });

            stream.pipe(fileStream);
        });
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

/**
 * function to import user data
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const importUserData = async (req, res) => {

    try {
        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
        }    
        let insertedRecord = 0;   
        const created_by = req.params.id;
        const fileName = req.files.data;
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + '/public/importData/' + imageName;
        storePath = '/importData/' + imageName;

        fileName.mv(uploadPath, async (err, response) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            let stream = fs.createReadStream(uploadPath);
            let password = '12345678';
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const base64String = Buffer.from(password).toString('base64');
            let csvDataColl = [];
            let isFirstRow = true;
            let blankFields = []; // to store row numbers with blank fields
            let rowNumber = 1;
            let hasExtraColumns = false;
            let allowOnlyLetterInNames = false;
            let nameRegexError = [];
            let statusValueCheck = false;
            let allowOnlyNumberInPhones = false;
            let phoneNumberError = [];
            let roleIdError = false;
            let roleIdErrorArray = [];
            let statusValueCheckError = [];
          

            let fileStream = csv
                .parse()
                .on("data", async function (data) {                
                
                    // skip the header row
                    if (isFirstRow) {
                        isFirstRow = false;
                        return;
                    }
                    rowNumber++;

                    // Check if csv file has extra column/value then throw error
                    if (data.length != 11) {
                        hasExtraColumns = true;
                    }

                    // Check if name is blank and add default value
                    if (!data[0]) {
                        blankFields.push(rowNumber);
                    }

                    // Check if name contains only letters
                    const nameRegex = /^[a-zA-Z]+$/;
                    if (!nameRegex.test(data[0])) {
                        allowOnlyLetterInNames = true;
                        nameRegexError.push(rowNumber);
                    }

                    // Validate phone number
                    phoneNumber = data[3];
                    if (!phoneNumber || !/^[0-9]{1,10}$/.test(phoneNumber)) {
                        allowOnlyNumberInPhones = true;
                        phoneNumberError.push(rowNumber);
                    }

                    // role_id validation 
                    roleId = data[8];
                    if (!roleId || !/^[1-9][0-9]*$/.test(roleId)) {
                        roleIdError = true;
                        roleIdErrorArray.push(rowNumber)
                    }
                    csvDataColl.push(data);
                })
                .on("end", async function () {

                    if (hasExtraColumns) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "CSV file has extra columns" });
                    }


                    if (blankFields.length > 0) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Filed is blank in rows: ' + blankFields.join(", ") });
                    }

                    if (allowOnlyLetterInNames) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Name contains invalid characters at rows " + nameRegexError.join(", ") });
                    }

                    if (allowOnlyNumberInPhones) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid phone number at row ' + phoneNumberError.join(", ") });
                    }

                    if (roleIdError) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Invalid role id at row ' + roleIdErrorArray.join(', ') });
                    }


                    if (statusValueCheck) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Status should be either 0 or 1 at rows " + statusValueCheckError.join(", ") });
                    }
                  
                    // csvDataColl.shift();
                    var csvLength = csvDataColl.length;
                    for (let index = 0; index < csvLength; index++) {

                        const panel_id =  await generatePanelIdForUser(req.user.user_type, req.user.user_id );         
                        var employee_id = "";
                        if(req.user.user_type=="1"){
                            employee_id =  await generateSuperAdminEmpId();
                        }

                        const row = csvDataColl[index];                        
                        const insertQuery = `INSERT INTO users (name, username, email, password, base_64_password, mobile, joining_date, address, pan,  aadhar, role_id, user_type, created_by, panel_id,employee_id ) VALUES ("${row[0]}", "${row[1]}", "${row[2]}", "${hashedPassword}", "${base64String}", "${row[3]}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD')}", "${row[5]}",  ${row[6]},  "${row[7]}", "${row[8]}","${row[8]}","${created_by}","${panel_id}","${employee_id}")`;
                        const queryResult = await db.query(insertQuery);                       
                        var insertId = queryResult.insertId;
                        
                        const salaryInsert = `INSERT INTO salaries (user_id, user_type, date_of_hire, salary, salary_term, created_by) VALUES("${insertId}", "${row[8]}", "${moment(row[4], 'DD-MM-YYYY').format('YYYY-MM-DD')}", "${row[9]}", "${row[10]}", "${created_by}")`;
                        await db.query(salaryInsert);
                        insertedRecord++; 
                    }  
                    
                    if (insertedRecord > 0) {
                        fs.unlinkSync(uploadPath);
                        return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
                    } else {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No records were inserted" });
                    }
                                       
                });                
                stream.pipe(fileStream);         
        });      
        
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


/**
 * function to import bank details data
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const importBankDetailData = async (req, res) => {

    try {
        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
        }    
        let insertedRecord = 0;   
        const created_by = req.params.id;
        const fileName = req.files.data;
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + '/public/importData/' + imageName;
        storePath = '/importData/' + imageName;

        fileName.mv(uploadPath, async (err, response) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            let stream = fs.createReadStream(uploadPath);
            let csvDataColl = [];
            let isFirstRow = true;
            let blankFields = []; // to store row numbers with blank fields
            let rowNumber = 1;
            let hasExtraColumns = false;
            let allowOnlyLetterInNames = false;
            let nameRegexError = [];
            let statusValueCheck = false;
            let statusValueCheckError = [];
          

            let fileStream = csv
                .parse()
                .on("data", async function (data) {                
                    
                    // skip the header row
                    if (isFirstRow) {
                        isFirstRow = false;
                        return;
                    }
                    rowNumber++;

                    // Check if csv file has extra column/value then throw error
                    if (data.length != 4) {
                        hasExtraColumns = true;
                    }

                    // Check if name is blank and add default value
                    if (!data[1]) {
                        blankFields.push(rowNumber);
                    }

                    // Check if name contains only letters
                    const nameRegex = /^[a-zA-Z]+$/;
                    if (!data[1]) {
                        allowOnlyLetterInNames = true;
                        nameRegexError.push(rowNumber);
                    }
                    
                    csvDataColl.push(data);
                })
                .on("end", async function () {

                    if (hasExtraColumns) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "CSV file has extra columns" });
                    }


                    if (blankFields.length > 0) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Filed is blank in rows: ' + blankFields.join(", ") });
                    }

                    if (allowOnlyLetterInNames) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Name contains invalid characters at rows " + nameRegexError.join(", ") });
                    }


                    if (statusValueCheck) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Status should be either 0 or 1 at rows " + statusValueCheckError.join(", ") });
                    }
                    // csvDataColl.shift();
                    var csvLength = csvDataColl.length;
                    for (let index = 0; index < csvLength; index++) {

                        const panel_id =  await generatePanelIdForUser(req.user.user_type, req.user.user_id );         
                        var employee_id = "";
                        if(req.user.user_type=="1"){
                            employee_id =  await generateSuperAdminEmpId();
                        }

                        const row = csvDataColl[index];                    
                    
                        const salaryInsert = `INSERT INTO banks (bank_name, website, logo) VALUES("${row[1]}", "${row[2]}", "${row[3]}")`;
                        await db.query(salaryInsert);
                        insertedRecord++; 
                    }  
                    
                    if (insertedRecord > 0) {
                        fs.unlinkSync(uploadPath);
                        return res.status(StatusCodes.OK).json({ status: true, message: "File imported successfully" });
                    } else {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "No records were inserted" });
                    }
                                       
                });                
                stream.pipe(fileStream);         
        });      
        
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getSpecificColumnValueFromCsv = async (req, res) => {

    try {
        if (!req.files || !req.files.data) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: 'No file uploaded' });
        }

        let columns = req.body.columns;

        // Ensure that columns is an array
        if (!Array.isArray(columns)) {
            columns = columns;
        }
        // Check if columns is a string, and split it into an array if needed
        if (typeof columns === 'string') {
            columns = JSON.parse(columns.replace(/'/g, "\""));
        }

        const fileName = req.files.data;
        const imageName = Date.now() + fileName.name;
        const uploadPath = process.cwd() + '/public/importData/' + imageName;
        var storePath = '/importData/' + imageName;

        fileName.mv(uploadPath, async (err, response) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
            }

            const filePath = uploadPath;

            const columnValues = [];

            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true }))
                .on('data', (row) => {
                    // Loop through the specified columns and store their values in the result object
                    const rowData = {};
                    columns.forEach((column) => {
                        rowData[column] = row[column] || null; // Use null if the column doesn't exist in the row
                    });
                    columnValues.push(rowData);
                    
                })
                .on('end', () => {
                    // Now, you can use 'columnValues' to access the values of the specified columns
                    fs.unlinkSync(filePath);
                    return res.status(StatusCodes.OK).json({ status: true, columnValues });
                })
                .on('error', (error) => {
                    console.error('Error processing CSV file:', error.message);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
                });

        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


module.exports = { importData, importUserData, importBankDetailData, getSpecificColumnValueFromCsv};
