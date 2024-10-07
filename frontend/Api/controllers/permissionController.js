var moment = require('moment');
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { validatePermissionOnRoleBassi} = require('../helpers/validation');


const setPermissionOnRoleBasis = async (req, res) => {

    try 
    {
        const {module_id, sub_module_id, role_id, user_id, created, viewed, updated, deleted} = req.body;

        const {error} = validatePermissionOnRoleBassi.validate(req.body);
        if(error) return res.status(400).json({status: false, message: error.message});
        
        const insertQuery = `INSERT INTO permissions (module_id, sub_module_id, role_id, user_id, created, viewed, updated, deleted) VALUES ('${module_id}', '${sub_module_id}', '${role_id}', '${user_id}', '${created}', '${viewed}', '${updated}', '${deleted}')`;

        db.query(insertQuery, async(err, result) => {
            
            if(err) return res.status(500).json({status: false, message: err});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Permission set successfully"});
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again"});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}


const checkPermittedModuleOnRoleBasis = async (req, res) => {

    try 
    {
        
        const role_id = req.user.user_type;
    
        const selectQuery = `SELECT * FROM permissions WHERE role_id = '${role_id}'`
        db.query(selectQuery, async(err, result) => {

            if(err) return res.status(500).json({status: false, message: err});
            
            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Fetch permissions successfully", data: result});
            }
            else
            {
                return res.status(400).json({status: false, message: "No permissions found"});
            }
        })    
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getAllPermittedModuleNameOnRoleBasis = async (req, res) => {

    try 
    {
        const role_id = req.user.user_type;
        const selectQuery = `SELECT modules.title as module_title, sub_modules.title as sub_module_title, permissions.id as permitted_id, permissions.created, permissions.viewed, permissions.updated, permissions.deleted FROM permissions LEFT JOIN modules ON permissions.module_id = modules.id LEFT JOIN sub_modules ON permissions.sub_module_id = sub_modules.id WHERE permissions.role_id = '${role_id}'`
        
        db.query(selectQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message:err});
            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Fetch permissions successfully", data: result});
            }
            else
            {
                return res.status(400).json({status: false, message: "No permissions found"});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});     
    }
}

const updatePermissionOnRoleBasis = async (req, res) => {

    try 
    {
        const {module_id, sub_module_id, role_id, user_id, created, viewed, updated, deleted} = req.body;

        const {error} = validatePermissionOnRoleBassi.validate(req.body);
        if(error) return res.status(400).json({status: false, message: error.message});

        const id = req.body.id;
        const updateQuery = `UPDATE permissions SET module_id = '${module_id}', sub_module_id = '${sub_module_id}', role_id = '${role_id}', user_id = '${user_id}', created = '${created}', viewed = '${viewed}', updated = '${updated}', deleted = '${deleted}' WHERE id = '${id}'`;

        db.query(updateQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Permission updated successfully"});
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again"});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});     
    }
}


module.exports = {setPermissionOnRoleBasis, checkPermittedModuleOnRoleBasis, getAllPermittedModuleNameOnRoleBasis, updatePermissionOnRoleBasis}