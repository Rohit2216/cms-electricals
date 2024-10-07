require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger, leaveApplicationValidations} = require("../helpers/validation");
const {getDifferenceBetweenTwoDays} = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const requestIp = require('request-ip')
const {insertEmployeeActivityLog} = require("../helpers/activityLog");

const applyLeave = async (req, res) => {

    try 
    {
        const {leave_type_id, start_date, end_date, reason} = req.body;   
        const {error} = leaveApplicationValidations.validate(req.body)
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        var response = ''
        const createdBy = req.user.userId;
        const applicant_id =  createdBy 

        const totalDays = await getDifferenceBetweenTwoDays(start_date, end_date)
        const totalHours = (totalDays * 8);
        var storePath = ''

        if(req.files != null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/leave_application/' + imageName;
            storePath = '/leave_application/' + imageName;

            image.mv(uploadPath, async(err, response) => {
                if(err) res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })
        }

        const insertQuery = `INSERT INTO leave_applications(leave_type_id, start_date, end_date, total_hours, total_days, applicant_id, reason, supporting_documents, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const queryResult = await db.query(insertQuery, [leave_type_id, start_date, end_date, totalHours, totalDays, applicant_id, reason, storePath, createdBy])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            response = "Leave apply successfully"
            res.status(StatusCodes.OK).json({status: false, message: response})
        }
        else
        {
            response = "Error! Leave not applied"
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: response})
        }
    } 
    catch (error) 
    {
        response = error.message
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: response})    
    }

    const logData = [{
        userId: req.user.userId, 
        roleId: req.user.roleId,
        timestamp: moment().unix(),
        action: 'applyLeave method of leaveApplicationController ', 
        ipAddress: requestIp.getClientIp(req), 
        userAgent: req.useragent.source,
        logResult: response
    }]
    const userActivityLog = await insertEmployeeActivityLog(logData)
}

const getAllLeaveApplications = async (req, res) =>{

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1 ;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM leave_applications`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '')
        {
            var selectQuery = `SELECT leave_applications.*, leave_types.leave_type, users.name as applicant_name FROM leave_applications INNER JOIN leave_types ON leave_types.id=leave_applications.leave_type_id INNER JOIN users ON users.id=leave_applications.applicant_id  WHERE leave_applications.reason LIKE ? ORDER BY leave_applications.id DESC LIMIT ?, ?`
            var values = ['%${searchData}%', pageFirstResult, +pageSize];
        }
        else
        {
            var selectQuery = `SELECT leave_applications.*, leave_types.leave_type, users.name as applicant_name FROM leave_applications INNER JOIN leave_types ON leave_types.id=leave_applications.leave_type_id INNER JOIN users ON users.id=leave_applications.applicant_id ORDER BY leave_applications.id DESC LIMIT ?, ?`
            var values = [pageFirstResult, +pageSize];
        }
       
        const queryResults = await db.query(selectQuery, values)

        if(queryResults.length > process.env.VALUE_ZERO)
        {
            var pageDetails = [];
            pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResults, pageDetails: pageDetails})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}


const updateLeaveApplication = async (req, res) =>{

    try 
    {
        const {status, id} = req.body
        const {error} = checkPositiveInteger.validate({id})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const updateQuery = `UPDATE leave_applications SET status = ? WHERE id = ?`
        const queryResult = await db.query(updateQuery, [status, id])
        
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: false, message: "Leave application status changed to " + status + " successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Something went wrong, please try again later"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})     
    }
}


const getSingleLeaveApplication = async(req, res) =>{

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        
        const selectQuery = `SELECT leave_applications.*, leave_types.leave_type, users.name as applicant_name FROM leave_applications INNER JOIN leave_types ON leave_types.id=leave_applications.leave_type_id INNER JOIN users ON users.id=leave_applications.applicant_id WHERE leave_applications.id = ?;`
        const queryResults = await db.query(selectQuery, [id])

        if(queryResults.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: false, message: "Fetched successfully", data: queryResults[0]})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Something went wrong"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})
    }
}

const leaveApplicationSoftDelete = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const deleteQuery = `UPDATE leave_applications SET deleted = ? WHERE id = ?`
        const queryResult = await db.query(deleteQuery, [1, id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Leave application deleted successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Something went wrong, please try again later"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

module.exports = {applyLeave, getAllLeaveApplications, updateLeaveApplication, getSingleLeaveApplication, leaveApplicationSoftDelete}