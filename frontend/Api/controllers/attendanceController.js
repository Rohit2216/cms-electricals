require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger} = require("../helpers/validation");
const {getDifferenceBetweenTime,getDayNameOnDate} = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const requestIp = require('request-ip')
const {insertEmployeeActivityLog} = require("../helpers/activityLog");


const clockIn = async (req, res) => {

    try 
    {   
        var response = '';
        const in_time = moment().format('YYYY-MM-DD H:m:s')
        res.send({date: in_time})
        const status = 'incomplete'
        const userId = req.user.userId
        const insertQuery = `INSERT INTO attendances(in_time, user_id, status) VALUES(?, ?, ?)`;
        const queryResult = await db.query(insertQuery, [in_time, userId, status])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            response = "clock in"
            res.status(StatusCodes.OK).json({status: false, message: response})
        }
        else
        {
            response = "Error in clock in!"
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
        action: 'clockIn method of attendanceController ', 
        ipAddress: requestIp.getClientIp(req), 
        userAgent: req.useragent.source,
        logResult: response
    }]
    const userActivityLog = await insertEmployeeActivityLog(logData)
}

const clockOut = async (req, res) => {

    try 
    {
        const out_time = moment().format('YYYY-MM-DD H:m:s')
        const userId = req.user.userId
        const today = moment().format('YYYY-MM-DD');
        const status = 'incomplete'
        var response = ''

        const getTodayMarkedBreak = `SELECT * FROM attendances WHERE user_id = ? AND DATE_FORMAT(in_time, '%Y-%m-%d') = ? AND status = ?`

        const queryResult = await db.query(getTodayMarkedBreak, [userId, today, status])
        const dbId = queryResult[0].id

        //update clock out time
        const updateQuery = `UPDATE attendances SET out_time = ? WHERE user_id = ? AND id = ?`
        const updateQueryResult = await db.query(updateQuery, [out_time, userId, dbId])

        if(updateQueryResult.affectedRows > process.env.VALUE_ZERO)
        {
            response = "Clock out"
            res.status(StatusCodes.OK).json({status: true, message: response})
        }
        else
        {
            response = "Error! Clock In not ended"
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
        action: 'clockOut method of attendanceController ', 
        ipAddress: requestIp.getClientIp(req), 
        userAgent: req.useragent.source,
        logResult: response
    }]
    const userActivityLog = await insertEmployeeActivityLog(logData)
}

const startBreak = async(req, res) => {

    try 
    {
        const {status, break_type} = req.body
        const in_time = moment().format('YYYY-MM-DD H:m:s')
        const userId = req.user.userId
        var response = '';

        const insertQuery = `INSERT INTO attendances(status, break_type, user_id, in_time) VALUES(?, ?, ?, ?)`
        const queryResult = await db.query(insertQuery, [status, break_type, userId, in_time])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            response = "Break marked"
            res.status(StatusCodes.OK).json({status: true, message: response})
        }
        else
        {
            response = "Error! Not marked break"
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: response})
        }
    } 
    catch (error) 
    {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: response})    
    }

    const logData = [{
        userId: req.user.userId, 
        roleId: req.user.roleId,
        timestamp: moment().unix(),
        action: 'startBreak method of attendanceController ', 
        ipAddress: requestIp.getClientIp(req), 
        userAgent: req.useragent.source,
        logResult: response
    }]
    const userActivityLog = await insertEmployeeActivityLog(logData)
}

const endBreak = async(req, res) => {

    try 
    {
        const {break_type} = req.body
        const out_time = moment().format('YYYY-MM-DD H:m:s')
        const userId = req.user.userId
        const today = moment().format('YYYY-MM-DD');
        var response = '';

        const getTodayMarkedBreak = `SELECT * FROM attendances WHERE user_id = ? AND DATE_FORMAT(in_time, '%Y-%m-%d') = ? AND break_type = ?`

        const queryResult = await db.query(getTodayMarkedBreak, [userId, today, break_type])
        const dbId = queryResult[0].id

        const updateQuery = `UPDATE attendances SET out_time = ? WHERE user_id = ? AND id = ?`
        const updateQueryResult = await db.query(updateQuery, [out_time, userId, dbId])

        if(updateQueryResult.affectedRows > process.env.VALUE_ZERO)
        {
            response = "Break ended"
            res.status(StatusCodes.OK).json({status: true, message: response})
        }
        else
        {
            response = "Error! Break not ended"
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
        action: 'endBreak method of attendanceController ', 
        ipAddress: requestIp.getClientIp(req), 
        userAgent: req.useragent.source,
        logResult: response
    }]
    const userActivityLog = await insertEmployeeActivityLog(logData)
}

const checkClockInToday = async(req, res) => {

    try 
    {
        const today = moment().format('YYYY-MM-DD');
        const userId = req.user.userId;
        const selectQuery = `SELECT attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, users.name, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE attendances.user_id= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ?`
        const queryResults = await db.query(selectQuery, [userId, today])
        
        if(queryResults.length > process.env.VALUE_ZERO)
        {
            var values = [];
            var result = [];

           for (const row of queryResults)
           {
                values.push({
                    name: row.name,
                    break_type: row.break_name
                })
           }
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: values, result: result})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "data not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const timeSheet = async(req, res) => {

    try 
    {
        const date = req.query.date ||  moment().format('YYYY-MM');
        const today = moment(date).format('YYYY-MM')
        const userId = req.user.userId;
        var response = ''

        const selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE attendances.user_id= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? AND attendances.status = ? ORDER BY attendances.id DESC`
        const queryResults = await db.query(selectQuery, [userId, today, 'incomplete'])

        if(queryResults.length > process.env.VALUE_ZERO)
        {
            var values = [];
            var outTime = '--';
            var totalWorkDuration = '--'

            for(const row of queryResults)
            {
                if(row.out_time == null)
                {
                    outTime, totalWorkDuration
                }
                else
                {
                    totalWorkDuration = await getDifferenceBetweenTime(row.in_time, row.out_time)
                    outTime = moment(row.out_time).format('H:m:s A')
                }

                values.push({
                    id: row.id,
                    name: row.name,
                    date: moment(row.created_at).format('YYYY-MM-DD'),
                    day: await getDayNameOnDate(row.in_time),
                    clockIn: moment(row.in_time).format('H:m:s A'),
                    clockOut: outTime,
                    totalWorkHour: totalWorkDuration
                })
            }
            response = "Fetched successfully"
            res.status(StatusCodes.OK).json({status: true, message: response, data: values})
        }
        else
        {
            response = "Records not found"
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
        action: 'timeSheet method of attendanceController ', 
        ipAddress: requestIp.getClientIp(req), 
        userAgent: req.useragent.source,
        logResult: response
    }]
    const userActivityLog = await insertEmployeeActivityLog(logData)
}


module.exports = {clockIn, clockOut, checkClockInToday, startBreak, endBreak, timeSheet}