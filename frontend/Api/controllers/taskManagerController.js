var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, tasksManagerValidations} = require('../helpers/validation');
const {getTotalTaskCount, getTotalCompletedTask, getTotalCanceledTask, getTotalToDoTask, getTotalInProgressTask, getTotalOverDueTask} = require('../helpers/taskHelper');

const createTask = async (req, res) => {

    try 
    {
        const {title, start_date, end_date, assign_to, project_name, category_id, status} = req.body 
        const {error} = tasksManagerValidations.validate(req.body)
        if(error) return res.status(403).json({status: false, message: error.message})
        
        if(end_date <= start_date) return res.status(403).json({status: false, message: "Task end date must be greater than start date"})

        const createdBy = req.user.user_id
        const insertQuery = `INSERT INTO tasks(title, start_date, end_date, assign_to, project_name, category_id, status, created_by) VALUES('${title}', '${start_date}', '${end_date}', '${assign_to}', '${project_name}', '${category_id}', '${status}', '${createdBy}')`

        db.query(insertQuery, async(err, result) => {
            if (err) return res.status(403).json({status: false, message: err.message})
            
            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Task created successfully"})
            }
            else
            {
                return res.status(403).json({status: false, message: "Something went wrong, please try again later"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getAllTaskList = async (req, res) => {

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM tasks`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '') 
        {
            var selectQuery = `SELECT * FROM tasks WHERE title LIKE '%${searchData}%' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize} `;
        }
        else
        {
            var selectQuery = `SELECT * FROM tasks ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize} `;
        }
        db.query(selectQuery, async(err, results) => {
            if(err) return res.status(403).json({status: false, message: err.message})
 
            if(results.length > process.env.VALUE_ZERO)
            {
                const final = results.map(async(element) => {
                    return {
                        id: element.id,
                        title: element.title,
                        start_date: element.start_date,
                        end_date: element.end_date,
                        assign_to: element.assign_to,
                        project_name: element.project_name,
                        category_id: element.category_id,
                        status: element.status,
                    }
                })

                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails})
                })
            }
            else
            {
                return res.status(403).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getTaskById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const{error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(403).json({status: false, message: error.message})
        
        const selectQuery = `SELECT * FROM tasks WHERE id = ${id}`

        db.query(selectQuery, async (err, result) => {
            if(err) return res.status(403).json({status: false, message: err.message})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: false, message: "Fetched successfully", data: result[0]})
            }
            else
            {
                return res.status(403).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const updateTaskDetails = async (req, res) => {

    try 
    {
        const {title, start_date, end_date, assign_to, project_name, category_id, status, id} = req.body 
        const {error} = tasksManagerValidations.validate({title: title, start_date: start_date, end_date: end_date, assign_to: assign_to, project_name: project_name, category_id: category_id, status: status})
        if(error) return res.status(403).json({status: false, message: error.message})
        
        const{error: idError} = checkPositiveInteger.validate({id: id})
        if(idError) return res.status(403).json({status: false, message: idError.message})

        if(end_date <= start_date) return res.status(403).json({status: false, message: "Task end date must be greater than start date"})

        const updatedBy = req.user.user_id
        const updatedAt = moment().format();

        const updateQuery = `UPDATE tasks SET title='${title}', start_date='${start_date}', end_date='${end_date}', assign_to='${assign_to}', project_name='${project_name}', category_id='${category_id}', status='${status}', updated_by='${updatedBy}', updated_at='${updatedAt}' WHERE id='${id}'`

        db.query(updateQuery, async(err, result) =>{
            if(err) return request.status(403).json({status: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Task updated successfully"})
            }
            else
            {
                return res.status(403).json({status: false, message: "Something went wrong, please try again later"})
            }
        })

    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}


const deleteTask = async(req, res) => {

    try 
    {
        const id = req.params.id
        const{error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(403).json({status: false, message: error.message})
        
        const deleteQuery = `DELETE FROM tasks WHERE id='${id}'`

        db.query(deleteQuery, async(err, result) => {
            if(err) return res.status(403).json({status: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Task deleted successfully"})
            }
            else
            {
                return res.status(403).json({status: false, message: "Something went wrong, please try again later" })
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})     
    }
}

const taskDashboard = async (req, res) => {

    try 
    {
        var data = [];
        const totalTask = await getTotalTaskCount();
        const completedTasks = await getTotalCompletedTask();
        const canceledTasks = await getTotalCanceledTask();
        const toDoTasks = await getTotalToDoTask();
        const inProgressTasks = await getTotalInProgressTask();
        const overDueTasks = await getTotalOverDueTask();

        data.push(totalTask, completedTasks, canceledTasks, toDoTasks, inProgressTasks, overDueTasks);
        const results = data.reduce((r, a) => r.concat(a), []);
        return res.status(404).json({status: true, message: "Found", data: results})    
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

module.exports = {createTask, getAllTaskList, getTaskById, updateTaskDetails, deleteTask, taskDashboard}