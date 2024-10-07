require("dotenv").config();
var moment = require('moment');
const { con, makeDb } = require("../db");
const { promisify } = require('util');
const db = makeDb();
const {checkPositiveInteger, profileValidations} = require("../helpers/validation");
const {roleById} = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');


const getAllStoredEmployeeDetails = async (req, res) => {

    try 
    {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1 ;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM users`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';
        var queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != '') 
        {
            searchDataCondition = "AND name LIKE ? ";
            queryParams.unshift(`%${searchData}%`);
        }


        const selectQuery = `SELECT id, name, email, mobile, joining_date, image, status, user_type, created_by FROM users WHERE is_deleted = '0' ${searchDataCondition} ORDER BY id DESC LIMIT ?, ?`
        
        const queryResult = await db.query(selectQuery, queryParams)

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            var pageDetails = [];
            pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: queryResult, pageDetails: pageDetails})
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

const getSingleEmployeeDetailById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const selectQuery = `SELECT * FROM users WHERE id = ?`
        
        const queryResult = await db.query(selectQuery, [id])

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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}


const updateEmployeeDetails = async (req, res) => {

    try 
    {
        const {name, email, mobile, joining_date, status, role_id, address, skills, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, id } = req.body 
        
        const {error} = profileValidations.validate({name: name, email: email, joining_date: joining_date, mobile: mobile,})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const {error: idError} = checkPositiveInteger.validate({id})
        if(idError) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: idError.message})

        const updatedAt = moment().format()
        var storePath = '';
        var graduationStorePath = '';
        var postGraduationStorePath = '';
        var doctorateStorePath = '';
        
        if(req.files != null)
        {
            const image = req.files.image
            const graduation = req.files.graduation
            const post_graduation = req.files.post_graduation
            const doctorate = req.files.doctorate
            const imageName = Date.now()+ image.name
            const graduationImageName = Date.now()+graduation.name
            const postGraduationImageName = Date.now()+post_graduation.name
            const doctorateImageName = Date.now()+doctorate.name
            
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            const graduationUploadPath =  process.cwd() +'/public/user_images/' + graduationImageName;
            const postGraduationUploadPath =  process.cwd() +'/public/user_images/' + postGraduationImageName;
            const doctorateUploadPath =  process.cwd() +'/public/user_images/' + doctorateImageName;
            storePath = '/user_images/' + imageName;
            graduationStorePath = '/user_images/' + graduationImageName;
            postGraduationStorePath = '/user_images/' + postGraduationImageName;
            doctorateStorePath = '/user_images/' + doctorateImageName
            
            image.mv(uploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })

            graduation.mv(graduationUploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })
            post_graduation.mv(postGraduationUploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })
            doctorate.mv(doctorateUploadPath, async(err, response) => {
                if(err) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: err.message});
            })
        }
       

        const getRoleOnId = await roleById(role_id)
        const userType = getRoleOnId.role

        const updateQuery = `UPDATE users SET name = ?, email = ?, mobile = ?, joining_date = ?, image = ?, status = ?, role_id = ?, user_type = ?, address = ?, graduation = ?, post_graduation = ?, doctorate = ?, skills = ?, employment_status = ?, pan = ?, aadhar = ?, epf_no = ?, esi_no = ?, bank_name = ?, ifsc_code = ?, account_number = ?, department = ?, updated_at = ? WHERE id = ?`

        const queryResult = await db.query(updateQuery, [name, email, mobile, joining_date, storePath, status, role_id, userType, address, graduationStorePath, postGraduationStorePath, doctorateStorePath, skills, employment_status, pan, aadhar, epf_no, esi_no, bank_name, ifsc_code, account_number, department, updatedAt, id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Employee details updated successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Employee details Not updated"})
        }

    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message});    
    }
}

const deleteEmployee = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const deleteQuery = `UPDATE users SET is_deleted = ? WHERE id = ?`;
        const queryResult = await db.query(deleteQuery, ['1', id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Employee deleted successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Employee not deleted"})
        }

    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const getEmployeeTaskById = async (req, res) => {

    try 
    {
        const id = req.query.id;
        const project = req.query.project;
        const status = req.query.status;

        const {error} = checkPositiveInteger.validate({id})

        if(error)  return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        var queryParams = [];
        var searchDataCondition = '';

        if (project != null && project != '') 
        {
            searchDataCondition += "AND project_name LIKE ? ";
            queryParams.push(`%${project}%`);
        }

        if (status != null && status != '') 
        {
            searchDataCondition += "AND status LIKE ? ";
            queryParams.push(`%${status}%`);
        }

        queryParams.unshift(id);
        
        const selectQuery = `SELECT * FROM tasks WHERE assign_to = ? ${searchDataCondition}`
        const queryResult = await db.query(selectQuery, queryParams)

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message:"Fetched successfully", data: queryResult})
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Task not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

module.exports = {getAllStoredEmployeeDetails, getSingleEmployeeDetailById, updateEmployeeDetails, deleteEmployee, getEmployeeTaskById}