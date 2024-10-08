require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger, termsAndConditionsValidation} = require("../helpers/validation");
const {roleById} = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');

const createTermsAndConditions = async (req, res) => {

    try 
    {
        const {title, content, status} = req.body;
        const {error} = termsAndConditionsValidation.validate(req.body)

        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const insertQuery = `INSERT INTO term_conditions(title, content, status, created_by) VALUES(?, ?, ?, ?)`
        const createdBy = req.user.user_id
        const insertValues = [title, content, status, createdBy] 

        const queryResult = await db.query(insertQuery, insertValues)

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Terms and conditions created successfully"})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Error! Terms and conditions not created"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}


const getAllCreateTermsAndConditions = async (req, res) => {

    try 
    {
        const selectQuery = `SELECT * FROM term_conditions`
        const queryResult = await promisify(db.query)(selectQuery)   
        
        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const getCreateTermsAndConditionsDetailsById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id});
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message});

        const selectQuery = `SELECT * FROM term_conditions WHERE id = ?`
        const queryResult = await db.query(selectQuery, [id])   
        
        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult[0]})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const updateTermsConditionsDetails = async(req, res) =>{

    try 
    {
        const {title, content, status, id} = req.body;
        const {error} = termsAndConditionsValidation.validate(req.body)

        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const updateQuery = `UPDATE term_conditions SET title = ?, content = ?, status = ?, updated_by = ?, updated_at = ? WHERE id = ?`

        const updatedBy = req.user.user_id
        const updatedAt = moment().format()
        const updateValues = [title, content, status, updatedBy, updatedAt, id] 

        const queryResult = await db.query(updateQuery, updateValues)

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Terms and conditions updated successfully"})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Error! Terms and conditions not updated"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const deleteTermsAndConditions = async(req, res) =>{

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id});
        
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const deleteQuery = `DELETE FROM term_conditions WHERE id = ?`
        const queryResult = await db.query(deleteQuery, [id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({sttaus: true, message: "Terms and conditions deleted successfully"})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Error! Terms and conditions not deleted"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})     
    }
}


module.exports = {createTermsAndConditions, getAllCreateTermsAndConditions, getCreateTermsAndConditionsDetailsById, updateTermsConditionsDetails, deleteTermsAndConditions}