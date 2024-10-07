require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger, leaveApplicationValidations } = require("../helpers/validation");
const { getDifferenceBetweenTwoDays } = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const requestIp = require('request-ip')
const { insertEmployeeActivityLog } = require("../helpers/activityLog");
const { insertNotifications } = require("../helpers/notifications");


// const applyLeave = async (req, res) => {

//     try 
//     {
//         const {leave_type_id, start_date, end_date, reason, user_id, status} = req.body;   
//         const {error} = leaveApplicationValidations.validate(req.body)
//         if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

//         var response = ''
//         var applicant_id = 0
//         if(user_id != null)
//         {

//             applicant_id =  user_id ;
//         }
//         else
//         {
//             applicant_id =  req.user.user_id
//         }

//         const createdBy = req.user.user_id;


//         const totalDays = await getDifferenceBetweenTwoDays(start_date, end_date)
//         const totalHours = (totalDays * 8);
//         var storePath = ''

//         if(req.files != null)
//         {
//             const image = req.files.image
//             const imageName = Date.now()+image.name
//             const uploadPath =  process.cwd() +'/public/leave_application/' + imageName;
//             storePath = '/leave_application/' + imageName;

//             image.mv(uploadPath, async(err, response) => {
//                 if(err) res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
//             })
//         }

//         const insertQuery = `INSERT INTO leave_applications(leave_type_id, start_date, end_date, total_hours, total_days, applicant_id, reason, supporting_documents, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

//         const queryResult = await db.query(insertQuery, [leave_type_id, start_date, end_date, totalHours, totalDays, applicant_id, reason, storePath, status, createdBy])

//         if(queryResult.affectedRows > process.env.VALUE_ZERO)
//         {
//             response = "Leave apply successfully"
//             res.status(StatusCodes.OK).json({status: true, message: response})

//              //notifications
//             const notificationData = [{
//                 userId: req.user.user_id, 
//                 roleId: req.user.user_type,
//                 title: "Leave Application",
//                 message: req.body.reason
//             }]
//             const notificationsSave = await insertNotifications(notificationData)
//         }
//         else
//         {
//             response = "Error! Leave not applied"
//             res.status(StatusCodes.FORBIDDEN).json({status: false, message: response})
//         }
//     } 
//     catch (error) 
//     {                                                                                                          
//         response = error
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: response})    
//     }

//     const logData = [{
//         userId: req.user.user_id, 
//         roleId: req.user.user_type,
//         timestamp: moment().unix(),
//         action: 'applyLeave method of leaveApplicationController ', 
//         ipAddress: requestIp.getClientIp(req), 
//         userAgent: req.useragent.source,
//         logResult: "response"
//     }]
//     const userActivityLog = await insertEmployeeActivityLog(logData)
// }

const applyLeave = async (req, res) => {
    try {
        const { leave_type_id, start_date, end_date, reason, user_id } = req.body;
        const { error } = leaveApplicationValidations.validate(req.body);

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });
        }
        var response = ''
        var applicant_id = 0;

        if (user_id != null) {
            applicant_id = user_id;
        } else {
            applicant_id = req.user.user_id;
        }

        const createdBy = req.user.user_id;

        const totalDays = await getDifferenceBetweenTwoDays(start_date, end_date);
        if (totalDays >= 0) {
            // const totalHours = totalDays * 8;
            let totalHours;
            if(totalDays == 0){
                totalHours = 8;
            }else{
                totalHours = totalDays * 8
            }
            
            var storePath = '';

            if (req.files != null) {
                const image = req.files.image;
                const imageName = Date.now() + image.name;
                const uploadPath = process.cwd() + '/public/leave_application/' + imageName;
                storePath = '/leave_application/' + imageName;

                image.mv(uploadPath, async (err, response) => {
                    if (err) {
                        return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: err.message });
                    }
                });
            }

            const insertQuery = `INSERT INTO leave_applications SET leave_type_id = '${leave_type_id}', start_date = '${start_date}', end_date = '${end_date}', total_hours = ${totalHours}, total_days = ${totalDays}, applicant_id = '${applicant_id}', reason = '${reason}', supporting_documents = '${storePath}', created_by = '${createdBy}'`;
         
            const queryResult = await db.query(insertQuery, [leave_type_id, start_date, end_date, totalHours, totalDays, applicant_id, reason, storePath, createdBy])

            if (queryResult.affectedRows > process.env.VALUE_ZERO) {
                response = "Leave apply successfully";
                res.status(StatusCodes.OK).json({ status: true, message: response });

                // Notifications
                const notificationData = [{
                    userId: req.user.user_id,
                    roleId: req.user.user_type,
                    title: "Leave Application",
                    message: req.body.reason,
                }];

                const notificationsSave = await insertNotifications(notificationData)
            } else {
                response = "Error! Leave not applied";
                res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: " Start date cannot be after the end date." })
        }
    } catch (error) {
        response = error;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    // Log user activity
    const logData = [{
        userId: req.user.user_id,
        roleId: req.user.user_type,
        timestamp: moment().unix(),
        action: 'applyLeave method of leaveApplicationController',
        ipAddress: requestIp.getClientIp(req),
        userAgent: req.useragent.source,
        logResult: "response",
    }];

    const userActivityLog = await insertEmployeeActivityLog(logData)
};

// const applyLeave = async (req, res) => {

//     try 
//     {
//         const {leave_type_id, start_date, end_date, reason} = req.body;   
//         const {error} = leaveApplicationValidations.validate(req.body)
//         if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

//         var response = ''
//         const createdBy = req.user.userId;
//         const applicant_id =  createdBy 

//         const totalDays = await getDifferenceBetweenTwoDays(start_date, end_date)
//         const totalHours = (totalDays * 8);
//         var storePath = ''

//         if(req.files != null)
//         {
//             const image = req.files.image
//             const imageName = Date.now()+image.name
//             const uploadPath =  process.cwd() +'/public/leave_application/' + imageName;
//             storePath = '/leave_application/' + imageName;

//             image.mv(uploadPath, async(err, response) => {
//                 if(err) res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
//             })
//         }

//         const insertQuery = `INSERT INTO leave_applications(leave_type_id, start_date, end_date, total_hours, total_days, applicant_id, reason, supporting_documents, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

//         const queryResult = await db.query(insertQuery, [leave_type_id, start_date, end_date, totalHours, totalDays, applicant_id, reason, storePath, createdBy])

//         if(queryResult.affectedRows > process.env.VALUE_ZERO)
//         {
//             response = "Leave apply successfully"
//             res.status(StatusCodes.OK).json({status: false, message: response})
//         }
//         else
//         {
//             response = "Error! Leave not applied"
//             res.status(StatusCodes.FORBIDDEN).json({status: false, message: response})
//         }
//     } 
//     catch (error) 
//     {
//         response = error.message
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: response})    
//     }

//     const logData = [{
//         userId: req.user.userId, 
//         roleId: req.user.roleId,
//         timestamp: moment().unix(),
//         action: 'applyLeave method of leaveApplicationController ', 
//         ipAddress: requestIp.getClientIp(req), 
//         userAgent: req.useragent.source,
//         logResult: response
//     }]
//     const userActivityLog = await insertEmployeeActivityLog(logData)
// }



const getAllLeaveApplications = async (req, res) => {

    try {
        const id = req.params.id

        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM leave_applications`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total / pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_cond = "";
        if (searchData != null && searchData != '') {
            search_cond = ` WHERE leave_applications.reason LIKE '%${searchData}%' OR users.name LIKE '%${searchData}%'  OR leave_types.leave_type LIKE '%${searchData}%' OR leave_applications.status LIKE '%${searchData}%'`
        }
        var selectQuery = `SELECT leave_applications.*, leave_types.leave_type, users.name as applicant_name, users.image as user_image FROM leave_applications LEFT JOIN leave_types ON leave_types.id=leave_applications.leave_type_id LEFT JOIN users ON users.id=leave_applications.applicant_id ${search_cond} ORDER BY leave_applications.id DESC LIMIT ?, ?`;
        var values = [pageFirstResult, +pageSize];
        const queryResults = await db.query(selectQuery, values)


        if (queryResults.length > process.env.VALUE_ZERO) {
            var pageDetails = [];
            pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total })

            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults, pageDetails: pageDetails[0] })
        }
        else {
            return res.status(StatusCodes.OK).json({ status: false, message: "Data not found" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}


const updateLeaveApplication = async (req, res) => {

    try {
        const { status, id } = req.body
        const { error } = checkPositiveInteger.validate({ id })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const updateQuery = `UPDATE leave_applications SET status = ? WHERE id = ?`
        const queryResult = await db.query(updateQuery, [status, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Leave application status changed to " + status + " successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Something went wrong, please try again later" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}


const getSingleLeaveApplication = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const selectQuery = `SELECT leave_applications.*, leave_types.leave_type, users.name as applicant_name, users.image as user_image, users.mobile as phone, users.email FROM leave_applications INNER JOIN leave_types ON leave_types.id=leave_applications.leave_type_id INNER JOIN users ON users.id=leave_applications.applicant_id WHERE leave_applications.id = ?;`
        const queryResults = await db.query(selectQuery, [id])

        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Fetched successfully", data: queryResults[0] })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Something went wrong" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

const leaveApplicationSoftDelete = async (req, res) => {

    try {
        const id = req.params.id
        const { error } = checkPositiveInteger.validate({ id })
        if (error) return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message })

        const deleteQuery = `UPDATE leave_applications SET deleted = ? WHERE id = ?`
        const queryResult = await db.query(deleteQuery, [1, id])

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({ status: true, message: "Leave application deleted successfully" })
        }
        else {
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: "Something went wrong, please try again later" })
        }
    }
    catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

module.exports = { applyLeave, getAllLeaveApplications, updateLeaveApplication, getSingleLeaveApplication, leaveApplicationSoftDelete }