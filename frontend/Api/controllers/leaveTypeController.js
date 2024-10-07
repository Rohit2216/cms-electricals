require("dotenv").config();
const bcrypt = require('bcrypt');
var moment = require('moment');
var jwt = require('jsonwebtoken');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger} = require("../helpers/validation");
const {roleById} = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');

const createLeaveType = async (req, res) => {

    try 
    {
        const{leave_type, description, status} = req.body
        const createdBy = req.user.user_id

        const insertQuery = `INSERT INTO leave_types (leave_type, description, status, created_by) VALUES(?, ?, ?, ?)` 
        const queryResult = await db.query(insertQuery, [leave_type, description, status, createdBy])
        
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Leave type created successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Something went wrong,   please try again"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

const getAllLeaveType = async (req, res) => {

    try 
    {
        const selectQuery = `SELECT * FROM leave_types ORDER by id DESC`
        const queryResult = await promisify(db.query)(selectQuery) 
        
        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

const getAllActiveLeaveType = async (req, res) => {

    try 
    {
        const selectQuery = `SELECT * FROM leave_types WHERE status = ? ORDER by id DESC`
        const queryResult = await db.query(selectQuery, [process.env.ACTIVE_STATUS]) 
        
        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

const getAllLeaveTypeById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const{error} = checkPositiveInteger.validate({id})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message});

        const selectQuery = `SELECT * FROM leave_types WHERE id = ? ORDER by id DESC`
        const queryResult = await db.query(selectQuery, [id]) 
        
        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

const updateLeaveType = async (req, res) => {

    try 
    {
        const{leave_type, description, status, id} = req.body
        const updatedAt = moment().format();

        const updateQuery = `UPDATE leave_types SET leave_type = ?, description= ?, status = ?, updated_at = ? WHERE id = ?`

        const queryResult = await db.query(updateQuery, [leave_type, description, status, updatedAt, id]);
        
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Leave type updated successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Something went wrong,   please try again"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

const deleteLeaveType = async(req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id});
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message});
        
        const deleteQuery = `DELETE FROM leave_types WHERE id = ?`
        const queryResult = await db.query(deleteQuery, [id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Leave Type deleted successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Something went wrong, please try again later"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}


module.exports = {createLeaveType, getAllLeaveType, getAllActiveLeaveType, getAllLeaveTypeById, updateLeaveType, deleteLeaveType}