var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, planValidations} = require('../helpers/validation');
const {getPlanModuleById, getPlanCheckLists} = require('../helpers/general')


const createPlan = async (req, res) => {

    try 
    {
        const {name, price, duration, description, module, checkLists} = req.body
        const {error} = planValidations.validate({name: name, price: price, duration: duration, description: description})
        if(error) return res.status(400).json({status: false, message: error.message})

        const moduleJson = JSON.stringify(module)
        const createdBy = req.user.user_id
        const insertQuery = `INSERT INTO plans (name, price, duration, description, module, created_by) VALUES('${name}', '${price}', '${duration}', '${description}', '${moduleJson}', '${createdBy}')`
        
        db.query(insertQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const PlanId = result.insertId
                if(checkLists != null)
                {
                    for(let i = 0; i < checkLists.length; i++)
                    {
                        const checkList = checkLists[i];
                        const checkListQuery = `INSERT INTO plan_checklists (plan_id, checklist_name, created_by) VALUES('${PlanId}', '${checkList}', '${createdBy}')`
                        const result = await db.query(checkListQuery)
                    }
                }
                res.status(200).json({status: true, message: "Plans created successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getAllPlans = async (req, res) => {

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM plans`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '')
        {
            var query = `SELECT * FROM plans WHERE name LIKE '%${searchData}%' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }
        else
        {
            var query = `SELECT * FROM plans ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }

        db.query(query, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.length > process.env.VALUE_ZERO)
            {                    
                const final = result.map( async (element) => {

                    return {...element,
                        planCheckLists: await getPlanCheckLists(element.id),
                        modules: await getPlanModuleById(element.module)
                    }
                });

                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

                Promise.all(final).then( (values) => {
                    res.status(200).json({status: true, message: 'Fetched successfully', data: values, pageDetails: pageDetails})
                }) 
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

const getPlanById = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const query = `SELECT id, name, price, duration, description, module, created_at FROM plans WHERE id='${id}'`
        db.query(query, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.length > process.env.VALUE_ZERO)
            {                    
                const final = result.map( async (element) => {

                    return {...element,
                        planCheckLists: await getPlanCheckLists(element.id),
                        modules: await getPlanModuleById(element.module)
                    }
                });

                Promise.all(final).then( (values) => {
                    res.status(200).json({status: true, message: 'Fetched successfully', data: values})
                }) 
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

const updatePlanDetails = async (req, res) => {

    try 
    {
        const {name, price, duration, description, module, checkLists, id} = req.body
        const {error} = planValidations.validate({name: name, price: price, duration: duration, description: description})
        if(error) return res.status(400).json({status: false, message: error.message})

        const {error: idValidateError} = checkPositiveInteger.validate({id: id})
        if(idValidateError) return res.status(400).json({status: false, message: idValidateError.message})

        const moduleJson = JSON.stringify(module)
        const createdBy = req.user.user_id
        const updatedAt = moment().format();

        const updateQuery = `UPDATE plans SET name='${name}', price='${price}', duration='${duration}', description='${description}', module='${moduleJson}', updated_at='${updatedAt}' WHERE id='${id}'`
       
        db.query(updateQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const PlanId = id
                if(checkLists != null)
                {
                    for(let i = 0; i < checkLists.length; i++)
                    {
                        const checkList = checkLists[i];
                        const checkListUpdateQuery = `UPDATE plan_checklists SET plan_id='${PlanId}', checklist_name='${checkList}', updated_at='${updatedAt}' WHERE plan_id='${id}'`
                        const result = await db.query(checkListUpdateQuery)
                    }
                }
                res.status(200).json({status: true, message: "plans updated successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const deletePlan = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const query = `DELETE FROM plans WHERE id='${id}'`
        db.query(query, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Plan deleted successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}


module.exports = {createPlan, getAllPlans, getPlanById, updatePlanDetails, deletePlan}