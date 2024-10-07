var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger} = require('../helpers/validation');

const createItemMaster = async (req, res) => {

    try 
    {
        const {name, rate, qty} = req.body
        const createdBy = req.user.user_id
        var storePath = '';
        
        if(req.files !=null)
        {   
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/item_masters/' + imageName;
            storePath = '/item_masters/' + imageName;

            image.mv(uploadPath, (err, response) => {
                if(err) return res.status(403).json({status: false, message: err.message})
            })
        }
        const insertQuery = `INSERT INTO item_masters (name, rate, qty, image, created_by) VALUES('${name}', '${rate}', '${qty}', '${storePath}', '${createdBy}')`

        db.query(insertQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Item created successfully"})
            }
            else
            {
                return res.status(403).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: true, message: error.message})    
    }
}

const getAllItemMasters = async (req, res) => {

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM item_masters ORDER BY id DESC`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '') 
        {
            var selectQuery = `SELECT * FROM item_masters WHERE name LIKE '%${searchData}%' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }
        else
        {
            var selectQuery = `SELECT * FROM item_masters ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }

        db.query(selectQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err.message})

            if(result.length > process.env.VALUE_ZERO)
            {
                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})
                res.status(200).json({status: true, message: "Fetched successfully",  data: result, pageDetails: pageDetails})
            }
            else
            {
                return res.status(500).json({status: false, message:"data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: true, message: error.message})    
    }
}

const getSingleItemMaster = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const selectQuery = `SELECT * FROM item_masters WHERE id = ${id}`

        db.query(selectQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err.message})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Fetched successfully",  date: result[0]})
            }
            else
            {
                return res.status(403).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: true, message: error.message})    
    }
}

const updateItemMaster = async (req, res) => {  

    try 
    {
        const {name, rate, qty, id} = req.body
        const updatedAt = moment().format();
        var storePath = '';
        const{error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(403).json({status: false, message: error.message})

        const selectQuery  = `SELECT * FROM item_masters WHERE id = '${id}'`
        const getExistData = await db.query(selectQuery);

        if(req.files != null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/item_masters/' + imageName;
            storePath = '/item_masters/' + imageName;
            image.mv(uploadPath, (err, response) => {
                if(err) return res.status(403).json({status: false, message: err.message})
            })
        }
        else
        {
            storePath = getExistData[0].image
        }

        const updateQuery = `UPDATE item_masters SET name = '${name}', rate = '${rate}', qty = '${qty}', image = '${storePath}', updated_at = '${updatedAt}' WHERE id = '${id}'`

        db.query(updateQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Item updated successfully"})
            }
            else
            {
                return res.status(403).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
       return res.status(500).json({status: true, message: error.message}) 
    }
}


const deleteItemMaster = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(400).json({status: false, message: error.message})
        
        const deleteQuery = `DELETE FROM item_masters WHERE id = '${id}'`

        db.query(deleteQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Item deleted successfully"})
            }
            else
            {
                return res.status(403).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: true, message: error.message})    
    }
}

module.exports = {createItemMaster, getAllItemMasters, getSingleItemMaster, updateItemMaster, deleteItemMaster}