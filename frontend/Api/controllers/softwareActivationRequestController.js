var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { subUserFormValidation, teamValidations, checkPositiveInteger} = require('../helpers/validation');
const { getSubModule } = require('../helpers/general');

const getAllPendingRequests = async (req, res) => {

    try 
    {
        const selectQuery = `SELECT admins.name as user_name, companies.company_name as name, modules.title, software_activation_requests.status, software_activation_requests.id, software_activation_requests.requested_date, software_activation_requests.approved_by, software_activation_requests.module_id FROM software_activation_requests INNER JOIN admins ON admins.id=software_activation_requests.user_id INNER JOIN companies ON companies.company_id=software_activation_requests.company_id INNER JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.status='${process.env.INACTIVE_STATUS}'`

        db.query(selectQuery, async (err, result) => {

            if(err) return res.status(400).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "success", data: result})
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

const viewSinglePendingRequestDetails = async(req, res) => {

    try 
    {
        const id = req.params.id
        const {error, value} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(400).json({status: false, message: error.message})

        const selectQuery = `SELECT admins.name as user_name, companies.company_name as name, modules.title as module_name, software_activation_requests.status, software_activation_requests.requested_date, software_activation_requests.approved_by, software_activation_requests.module_id FROM software_activation_requests INNER JOIN admins ON admins.id=software_activation_requests.user_id INNER JOIN companies ON companies.company_id=software_activation_requests.company_id INNER JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.id='${id}'`

        db.query(selectQuery, async(err, result) => {
            if(err) return res.status(400).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                const final = result.map(async (element) => {
                    return {...element, 
                        sub_module: await getSubModule(element.module_id)
                    };
                })

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message: "success", data: values})
                });
                //res.status(200).json({status: true, message: "success", data: result})
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

const approvedSoftwareActivationRequest = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error, value} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const approved_by = req.user.user_id

        const updateQuery = `UPDATE software_activation_requests SET status = '1', approved_by = '${approved_by}' WHERE id = '${id}'`

        db.query(updateQuery, async(err, result) => {
            if(err) return res.status(400).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const selectSoftwareActivationRequestQuery = `SELECT * FROM software_activation_requests WHERE id = '${id}'`
                const softwareActivationRequestDetails = await db.query(selectSoftwareActivationRequestQuery)
                const userId = softwareActivationRequestDetails[0].user_id
                const moduleId = softwareActivationRequestDetails[0].module_id
                const getRoleQuery = `SELECT * FROM admins WHERE id='${userId}'`
                const roleQueryResult = await db.query(getRoleQuery)
                const roleId = roleQueryResult[0].user_type

                const insertPermissionQuery = `INSERT INTO permissions(module_id, role_id,  user_id) VALUES('${moduleId}', '${roleId}', '${userId}')`
                db.query(insertPermissionQuery, async (err, result) => {
                    if(err) return res.status(403).json({status: false, message: err})
                    if(result.affectedRows > process.env.VALUE_ZERO)
                    {
                        res.status(200).json({status: true, message: "Request approved successfully"})
                    }
                    else
                    {
                        return res.status(400).json({status: false, message: "Something went wrong, please try again"})
                    }
                })
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

const rejectedSoftwareActivationRequest = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error, value} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const rejected_by = req.user.user_id
        
        const updateQuery = `UPDATE software_activation_requests SET status = '2', approved_by = '${rejected_by}' WHERE id = '${id}'`
        db.query(updateQuery, async(err, result) => {
            if(err) return res.status(400).json({status: false, message: err})
            
            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Request rejected successfully"})
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

const deleteSoftwareActivationRequest = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error, value} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const deleteQuery = `DELETE FROM software_activation_requests WHERE id = '${id}'`
        db.query(deleteQuery, async (err, result) => {
            if(err) return res.status(400).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Request deleted successfully"})
            }
            else
            {
                return res.status(403).json({status: true, message: "Something went wrong, please try again later"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getAllApprovedRequests = async (req, res) => {

    try 
    {
        const selectQuery = `SELECT admins.name as user_name, companies.company_name as name, modules.title, software_activation_requests.status, software_activation_requests.id, software_activation_requests.requested_date, software_activation_requests.approved_by, software_activation_requests.module_id FROM software_activation_requests INNER JOIN admins ON admins.id=software_activation_requests.user_id INNER JOIN companies ON companies.company_id=software_activation_requests.company_id INNER JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.status='${process.env.ACTIVE_STATUS}'`

        db.query(selectQuery, async (err, result) => {

            if(err) return res.status(400).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "success", data: result})
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

const getAllRejectedRequests = async (req, res) => {

    try 
    {
        const selectQuery = `SELECT admins.name as user_name, companies.company_name as name, modules.title, software_activation_requests.status, software_activation_requests.id, software_activation_requests.requested_date, software_activation_requests.approved_by, software_activation_requests.module_id FROM software_activation_requests INNER JOIN admins ON admins.id=software_activation_requests.user_id INNER JOIN companies ON companies.company_id=software_activation_requests.company_id INNER JOIN modules ON modules.id = software_activation_requests.module_id WHERE software_activation_requests.status='2'`

        db.query(selectQuery, async (err, result) => {

            if(err) return res.status(400).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "success", data: result})
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


module.exports = {getAllPendingRequests, viewSinglePendingRequestDetails, approvedSoftwareActivationRequest, rejectedSoftwareActivationRequest, deleteSoftwareActivationRequest, getAllApprovedRequests, getAllRejectedRequests}