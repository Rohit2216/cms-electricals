require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger, userCreateValidations} = require("../helpers/validation");
const {roleById} = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const {insertEmployeeActivityLog} = require("../helpers/activityLog");
const requestIp = require('request-ip')
const bcrypt = require('bcrypt');


const createUsers = async(req, res) => {
    
    try 
    {
        var response = '';
        var logRoleId = 0
        var logUserId = 0

        const {name, email, password, mobile, joining_date, status, role_id, address, graduation, post_graduation, doctorate, skills, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, family_info, team_id } = req.body

        const {error} = userCreateValidations.validate({name: name, email: email, password: password, joining_date: joining_date, role_id: role_id, mobile: mobile,})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        const createdBy = req.user.user_id
        var storePath = '';
        var graduationStorePath = '';
        var postGraduationStorePath = '';
        var doctorateStorePath = '';
        response = "Trying to create user";
        
        if(req.files != null)
        {
            const image = req.files.image
            const graduation = req.files.graduation
            const post_graduation = req.files.post_graduation
            const doctorate = req.files.doctorate
            const imageName = Date.now()+ image.name
            const graduationImageName = Date.now()+graduation.name
            const postGraduationImageName = Date.now()+post_graduation.name
            const doctorateImageName = Date.now()+doctorate.name
            // return res.send({data: doctorateImageName  })
            
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            const graduationUploadPath =  process.cwd() +'/public/user_images/' + graduationImageName;
            const postGraduationUploadPath =  process.cwd() +'/public/user_images/' + postGraduationImageName;
            const doctorateUploadPath =  process.cwd() +'/public/user_images/' + doctorateImageName;
            storePath = '/user_images/' + imageName;
            graduationStorePath = '/user_images/' + graduationImageName;
            postGraduationStorePath = '/user_images/' + postGraduationImageName;
            doctorateStorePath = '/user_images/' + doctorateImageName
            
            image.mv(uploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })

            graduation.mv(graduationUploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })
            post_graduation.mv(postGraduationUploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })
            doctorate.mv(doctorateUploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })
            response = "Error in upload user images"
        }
        const getRoleOnId = await roleById(role_id)
        const userType = getRoleOnId.role
        logRoleId = role_id
        

        const insertQuery = `INSERT INTO users(name, username, email, password, mobile, joining_date, image, status, role_id, user_type, created_by, address, graduation, post_graduation, doctorate, skills, team_id, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, family_info) VAlUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const queryResult = await db.query(insertQuery, [name, name, email, hashPassword, mobile, joining_date, storePath, status, role_id, role_id, createdBy, address, graduationStorePath, postGraduationStorePath, doctorateStorePath, skills, team_id, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, family_info])
       
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            logUserId = queryResult.insertId
            response = "User created successfully"
            res.status(StatusCodes.OK).json({status: true, message: response})
        }
        else
        {
            response = "Something went wrong, please try again later"
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: response})
        }

    } catch (error) 
    {
        response =  error.message
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: response})    
    }

    const logData = [{
        userId: logUserId, 
        roleId: logRoleId,
        timestamp: moment().unix(),
        action: 'createUsers method of userController ', 
        ipAddress: requestIp.getClientIp(req), 
        userAgent: req.useragent.source,
        logResult: response
    }]

    const userActivityLog = await insertEmployeeActivityLog(logData)
}


const updateUsers = async(req, res) => {
    
    try 
    {
        var response = '';
        var logRoleId = 0
        var logUserId = 0

        const {name, email, password, mobile, joining_date, status, role_id, address, graduation, post_graduation, doctorate, skills, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, family_info, team_id, employee_id } = req.body

        const {error} = userCreateValidations.validate({name: name, email: email, password: password, joining_date: joining_date, role_id: role_id, mobile: mobile,})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        const createdBy = req.user.user_id
        var storePath = '';
        var graduationStorePath = '';
        var postGraduationStorePath = '';
        var doctorateStorePath = '';
        response = "Trying to create user";
        
        if(req.files != null)
        {
            const image = req.files.image
            const graduation = req.files.graduation
            const post_graduation = req.files.post_graduation
            const doctorate = req.files.doctorate
            const imageName = Date.now()+ image.name
            const graduationImageName = Date.now()+graduation.name
            const postGraduationImageName = Date.now()+post_graduation.name
            const doctorateImageName = Date.now()+doctorate.name
            
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            const graduationUploadPath =  process.cwd() +'/public/user_images/' + graduationImageName;
            const postGraduationUploadPath =  process.cwd() +'/public/user_images/' + postGraduationImageName;
            const doctorateUploadPath =  process.cwd() +'/public/user_images/' + doctorateImageName;
            storePath = '/user_images/' + imageName;
            graduationStorePath = '/user_images/' + graduationImageName;
            postGraduationStorePath = '/user_images/' + postGraduationImageName;
            doctorateStorePath = '/user_images/' + doctorateImageName
            
            image.mv(uploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })

            graduation.mv(graduationUploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })
            post_graduation.mv(postGraduationUploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })
            doctorate.mv(doctorateUploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })
            response = "Error in upload user images"
        }
        const getRoleOnId = await roleById(role_id)
        const userType = getRoleOnId.role
        logRoleId = role_id
        const updatedAt = moment().format()
        

        const updateQuery = `UPDATE users SET name = ?, username = ?, email = ?, password = ?, mobile = ?, joining_date = ?, image = ?, status = ?, role_id = ?, user_type = ?, created_by = ?, address = ?, graduation = ?, post_graduation = ?, doctorate = ?, skills = ?, team_id = ?, employment_status = ?, pan = ?, aadhar = ?, epf_no = ?, esi_no = ?, bank_name = ?, ifsc_code = ?, account_number = ?, department = ?, family_info = ?, updated_at = ? WHERE id = ?`

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const queryResult = await db.query(updateQuery, [name, name, email, hashPassword, mobile, joining_date, storePath, status, role_id, role_id, createdBy, address, graduationStorePath, postGraduationStorePath, doctorateStorePath, skills, team_id, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, JSON.stringify(family_info), updatedAt, employee_id])
       
      
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            logUserId = employee_id
            response = "User updated successfully"
            res.status(StatusCodes.OK).json({status: true, message: response})
        }
        else
        {
            response = "Something went wrong, please try again later"
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: response})
        }

    } catch (error) 
    {
        response =  error.message
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: response})    
    }

    const logData = [{
        userId: logUserId, 
        roleId: logRoleId,
        timestamp: moment().unix(),
        action: 'updateUsers method of userController ', 
        ipAddress: requestIp.getClientIp(req), 
        userAgent: req.useragent.source,
        logResult: response
    }]
    
    const userActivityLog = await insertEmployeeActivityLog(logData)
}


const getAllManagerUsers = async (req, res) => {
   
    try 
    {
       const managerRoleId = process.env.MANAGER_ROLE_ID 
       const selectQuery = `SELECT * FROM users WHERE user_type = ?`
       const queryResult = await db.query(selectQuery, [managerRoleId])
        
        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully",  data: queryResult})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});
    }
}

const getEmployeeDocumentsById = async (req, res) =>{

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id})

        if(error)  return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const selectQuery = `SELECT graduation, post_graduation, doctorate, pan, aadhar FROM users WHERE id = ?`
        const queryResult = await db.query(selectQuery, [id])

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult[0]})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Documents not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

module.exports = {createUsers, updateUsers, getAllManagerUsers, getEmployeeDocumentsById}

