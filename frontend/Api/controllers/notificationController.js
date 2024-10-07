var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, notificationCreateValidations} = require('../helpers/validation');


const createNotifications = async (req, res) => {

    try 
    {
        const {title, message, user_type, created_for} = req.body
        const {error} = notificationCreateValidations.validate({title: title, message: message})
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const created_by = req.user.user_id

        const insertQuery = `INSERT INTO notifications (title, message, user_type, created_by, created_for) VALUES('${title}', '${message}', '${user_type}',  '${created_by}','${created_for}')`

        db.query(insertQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO) 
            {
                res.status(200).json({status: true, message: "Notifications created successfully"})
            }
            else
            {
               return res.status(400).json({status: false, message: "Something went wrong, please try again later"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});       
    }
}

const getNotifications = async (req, res) => {

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM notifications`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '')
        {
            var selectQuery = `SELECT notifications.*, users.name, users.image FROM notifications INNER JOIN users ON users.id=notifications.created_by WHERE notifications.title LIKE '%${searchData}%' ORDER BY notifications.id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }
        else
        {
            var selectQuery = `SELECT notifications.*, users.name, users.image FROM notifications INNER JOIN users ON users.id=notifications.created_by ORDER BY notifications.id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }
        db.query(selectQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.length > process.env.VALUE_ZERO)
            {
                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

                res.status(200).json({status: true, message: "Fetched successfully",  data: result, pageDetails: pageDetails})
            }
            else
            {
                return res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getLoggedUserNotifications = async (req, res) => {

    try 
    {
        const loggedUserId = req.user.user_id
        const selectQuery = `SELECT * FROM notifications WHERE created_for='${loggedUserId}'`
        db.query(selectQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Fetched successfully",  data: result})
            }
            else
            {
                return res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const countLoggedUserUnreadNotifications = async (req, res) => {

    try 
    {
        const loggedUserId = req.user.user_id
        const userType = req.user.user_type

        if(userType == 1)
        {
            var selectQuery = `SELECT COUNT(*) as totalUnreadNotifications FROM notifications WHERE created_for='${loggedUserId}' AND is_admin_read='${0}'`
        }
        else
        {
            var selectQuery = `SELECT COUNT(*) as totalUnreadNotifications FROM notifications WHERE created_for='${loggedUserId}' AND is_user_read='${0}'`
        }
       
        db.query(selectQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Fetched successfully",  data: result[0]})
            }
            else
            {
                return res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const markAsReadNotifications = async (req, res) => {

    try 
    {
        const loggedInUserId = req.user.user_id
        const userType = req.user.user_type
        const {error} = checkPositiveInteger.validate({id: loggedInUserId})
        if(error) return res.status(400).json({status: false, message: error.message})

        if(userType == 1)
        {
            var updateQuery = `UPDATE notifications SET is_admin_read='1' WHERE created_for='${loggedInUserId}'`
        }
        else
        {
            var updateQuery = `UPDATE notifications SET is_user_read='1' WHERE created_for='${loggedInUserId}'`
        }
        
        db.query(updateQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Notifications marked as read successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again later"})
            }
        })

    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}


module.exports = {createNotifications, getNotifications, getLoggedUserNotifications, countLoggedUserUnreadNotifications, markAsReadNotifications}