require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger} = require("../helpers/validation");
const {getRoleInGroupById, getUserInGroupById, calculatePagination }  = require("../helpers/general")
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');

const createGroupInsurance = async (req, res) => {

    try 
    {
        const {insurance_for, insurance_company_id, insurance_plan_id, insurance_deduction_amount, insurance_applied_on} = req.body

        const formValidation = Joi.object({
            insurance_for: Joi.number().integer().positive().required(),
            insurance_company_id: Joi.number().integer().positive().required(),
            insurance_plan_id: Joi.number().integer().positive().required(),
            insurance_deduction_amount: Joi.number().required()
        })
        const {error} = formValidation.validate({insurance_for: insurance_for, insurance_company_id: insurance_company_id, insurance_plan_id: insurance_plan_id, insurance_deduction_amount: insurance_deduction_amount})

        if(error) return res.status(StatusCodes.OK).json({status: false, message: error.message})

        const insertQuery = `INSERT INTO group_insurances(insurance_for, insurance_company_id, insurance_plan_id, insurance_deduction_amount, insurance_applied_on, created_by) VALUES (?, ?, ?, ?, ?, ?)`

        const createdBy = req.user.user_id
        const insuranceAppliedOnFormat = JSON.stringify([{insurance_applied_on: insurance_applied_on}])
        const insertValues = [insurance_for, insurance_company_id, insurance_plan_id, insurance_deduction_amount, insuranceAppliedOnFormat, createdBy]

        const queryResult = await db.query(insertQuery, insertValues)
        
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Group insurance created successfully"})
        }
        else
        {
            return res.status(StatusCodes.OK).json({status: false, message: "Group insurance not created"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

const getAllGroupInsurance = async (req, res) => {

    try 
    {
        
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1 ;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';
        var queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != '') 
        {
            searchDataCondition = ` WHERE insurance_companies.company_name LIKE '%${searchData}%' OR insurance_company_plans.policy_name LIKE '%${searchData}%'`;
        }

        const selectQuery = `SELECT group_insurances.*, insurance_companies.company_name, insurance_company_plans.policy_name FROM group_insurances LEFT JOIN insurance_companies ON insurance_companies.id = group_insurances.insurance_company_id LEFT JOIN insurance_company_plans ON insurance_company_plans.plan_id = group_insurances.insurance_plan_id ${searchDataCondition} ORDER BY group_insurances.id DESC LIMIT ?, ?`;

        const queryResult = await db.query(selectQuery, queryParams)  
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);  
                
        if(queryResult.length > process.env.VALUE_ZERO)
        {   
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            var values = []
            var insuranceFor = '';
            var insuranceAppliedOn = ''
            
            for(const row of queryResult)
            {
                if(row.insurance_for === process.env.ROLE_WISE)
                {
                    insuranceFor = 'Designation Wise'
                    insuranceAppliedOn = await getRoleInGroupById(row.insurance_applied_on)
                }
                else
                {
                    insuranceFor = 'Employee Wise'
                    insuranceAppliedOn = await getUserInGroupById(row.insurance_applied_on)
                }

                values.push({
                    id: row.id,
                    insurance_for: insuranceFor,
                    insurance_for_id : row.insurance_for,
                    insurance_company_id: row.insurance_company_id,
                    insurance_company_name: row.company_name,
                    insurance_plan_id: row.insurance_plan_id,
                    insurance_plan_name: row.policy_name,
                    insurance_deduction_amount: row.insurance_deduction_amount,
                    insurance_applied_on: insuranceAppliedOn //row.insurance_applied_on
                })
            }
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails })
        }
        else
        {
            res.status(StatusCodes.OK).json({status: false, message: "Data not found"})
        }   
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}


const getSingleGroupInsuranceDetails = async(req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id})
        if(error) return res.status(StatusCodes.OK).json({status: false, message: error.message})
       
        const selectQuery = `SELECT group_insurances.*, insurance_companies.company_name, insurance_company_plans.policy_name FROM group_insurances INNER JOIN insurance_companies ON insurance_companies.id = group_insurances.insurance_company_id INNER JOIN insurance_company_plans ON insurance_company_plans.plan_id = group_insurances.insurance_plan_id WHERE group_insurances.id = ?`
        const queryResult = await db.query(selectQuery, [id])  
        
        if(queryResult.length > process.env.VALUE_ZERO)
        {
            var values = []
            var insuranceFor = '';
            var insuranceAppliedOn = ''
            for(const row of queryResult)
            {
                if(row.insurance_for === process.env.ROLE_WISE)
                {
                    insuranceFor = 'Designation Wise'
                    insuranceAppliedOn = await getRoleInGroupById(row.insurance_applied_on)
                }
                else
                {
                    insuranceFor = 'Employee Wise'
                    insuranceAppliedOn = await getUserInGroupById(row.insurance_applied_on)
                }

                values.push({
                    id: row.id,
                    insurance_for: insuranceFor,
                    insurance_for_id : row.insurance_for,
                    insurance_company_id: row.insurance_company_id,
                    insurance_company_name: row.company_name,
                    insurance_plan_id: row.insurance_plan_id,
                    insurance_plan_name: row.policy_name,
                    insurance_deduction_amount: row.insurance_deduction_amount,
                    insurance_applied_on: insuranceAppliedOn 
                })
            }
            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: values[0]})
        }
        else
        {
            res.status(StatusCodes.OK).json({status: false, message: "Data not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const updateGroupInsuranceDetails = async(req, res) =>{

    try 
    {
        const {insurance_for, insurance_company_id, insurance_plan_id, insurance_deduction_amount, insurance_applied_on, id} = req.body

        const formValidation = Joi.object({
            insurance_for: Joi.number().integer().positive().required(),
            insurance_company_id: Joi.number().integer().positive().required(),
            insurance_plan_id: Joi.number().integer().positive().required(),
            insurance_deduction_amount: Joi.number().required(),
        })
        const {error} = formValidation.validate({insurance_for: insurance_for, insurance_company_id: insurance_company_id, insurance_plan_id: insurance_plan_id, insurance_deduction_amount: insurance_deduction_amount})

        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const updateQuery = `UPDATE group_insurances SET insurance_for = ?, insurance_company_id = ?, insurance_plan_id = ?, insurance_deduction_amount = ?, insurance_applied_on = ?, updated_at = ? WHERE id = ?`

        const updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const insuranceAppliedOnFormat = JSON.stringify([{insurance_applied_on: insurance_applied_on}])

        const updateValues = [insurance_for, insurance_company_id, insurance_plan_id, insurance_deduction_amount, insuranceAppliedOnFormat, updatedAt, id]

        const queryResult = await db.query(updateQuery, updateValues) 
        
        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Group insurance updated successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Group insurance not updated"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error})    
    }
}

const deleteGroupInsurance = async(req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        
        const deleteQuery = `DELETE FROM group_insurances WHERE id = ?`
        const queryResult = await db.query(deleteQuery, [id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Group insurance deleted successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Group insurance not deleted"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message:error.message})    
    }
}


module.exports = {createGroupInsurance, getAllGroupInsurance, getSingleGroupInsuranceDetails, updateGroupInsuranceDetails, deleteGroupInsurance}