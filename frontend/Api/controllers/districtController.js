var moment = require('moment');
require("dotenv").config();
const { con, makeDb } = require("../db");
const Joi = require("joi");
const { checkPositiveInteger } = require('../helpers/validation');
const db = makeDb();



const addDistrict = async (req, res) => {

    try 
    {
        const {energy_company_id, zone_id, regional_office_id, sales_area_id, district_name, status} = req.body;
        const joiSchema = Joi.object({
            energy_company_id: Joi.number().required(),
            zone_id: Joi.number().required(),
            regional_office_id: Joi.number().required(),
            sales_area_id: Joi.number().required(),
            district_name: Joi.string().required(),
        })
        const { error, value } = joiSchema.validate({energy_company_id: energy_company_id, zone_id: zone_id, regional_office_id: regional_office_id, sales_area_id: sales_area_id, district_name: district_name});
        
        if(error)
        {
            return res.status(400).json({status: false, message: error.message });
        }

        const createdBy = req.user.user_id;
        const insertQuery = `INSERT INTO districts (energy_company_id, zone_id, regional_office_id, sales_area_id, district_name, status, created_by) VALUES ('${energy_company_id}', '${zone_id}', '${regional_office_id}', '${sales_area_id}', '${district_name}', '${status}', '${createdBy}')`;

        db.query(insertQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "District created successfully"})
            }
            else
            {
                res.status(400).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message });    
    }
}


const getDistricts = async (req, res) => {

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM districts`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '')
        {
            var selectQuery = `SELECT districts.id, districts.district_name, districts.status, districts.energy_company_id, energy_companies.name as ec_name, zones.zone_id, zones.zone_name, regional_offices.id as ro_id, regional_offices.regional_office_name, sales_area.id as sale_area_id, sales_area.sales_area_name FROM districts INNER JOIN sales_area ON sales_area.id=districts.sales_area_id INNER JOIN regional_offices ON regional_offices.id=districts.regional_office_id INNER JOIN zones ON zones.zone_id=districts.zone_id INNER JOIN energy_companies ON energy_companies.id = districts.energy_company_id WHERE districts.district_name LIKE '%${searchData}%' ORDER BY districts.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }
        else
        {
            var selectQuery = `SELECT districts.id, districts.district_name, districts.status, districts.energy_company_id, energy_companies.name as ec_name, zones.zone_id, zones.zone_name, regional_offices.id as ro_id, regional_offices.regional_office_name, sales_area.id as sale_area_id, sales_area.sales_area_name FROM districts INNER JOIN sales_area ON sales_area.id=districts.sales_area_id INNER JOIN regional_offices ON regional_offices.id=districts.regional_office_id INNER JOIN zones ON zones.zone_id=districts.zone_id INNER JOIN energy_companies ON energy_companies.id = districts.energy_company_id ORDER BY districts.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }


        db.query(selectQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.length > process.env.VALUE_ZERO)
            {
                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

                res.status(200).json({status: true, message:"Data fetched successfully", data: result, pageDetails: pageDetails})
            }
            else
            {
                res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}


const getDistrictById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        
        const selectQuery = `SELECT districts.id, districts.district_name, districts.status, districts.energy_company_id, zones.zone_id, zones.zone_name, regional_offices.id as ro_id, regional_offices.regional_office_name, sales_area.id as sale_area_id, sales_area.sales_area_name FROM districts INNER JOIN sales_area ON sales_area.id=districts.sales_area_id INNER JOIN regional_offices ON regional_offices.id=districts.regional_office_id INNER JOIN zones ON zones.zone_id=districts.zone_id WHERE districts.id = '${id}'`;
        
        db.query(selectQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Data fetched successfully", data: result})
            }
            else
            {
                res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}

const getActiveDistricts = async (req, res) => {

    try 
    {
        const activeStatus = process.env.ACTIVE_STATUS;
        const selectQuery = `SELECT districts.id, districts.district_name, districts.status, districts.energy_company_id, zones.zone_id, zones.zone_name, regional_offices.id as ro_id, regional_offices.regional_office_name, sales_area.id as sale_area_id, sales_area.sales_area_name FROM districts INNER JOIN sales_area ON sales_area.id=districts.sales_area_id INNER JOIN regional_offices ON regional_offices.id=districts.regional_office_id INNER JOIN zones ON zones.zone_id=districts.zone_id WHERE districts.id AND  districts.status = '${activeStatus}' ORDER BY districts.id DESC`;

        db.query(selectQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Data fetched successfully", data: result})
            }
            else
            {
                res.status(400).json({status: false, message: "Data not found"})
            }
        })
        
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}


const editDistrictById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const selectQuery = `SELECT districts.id, districts.district_name, districts.status, districts.energy_company_id, zones.zone_id, zones.zone_name, regional_offices.id as ro_id, regional_offices.regional_office_name, sales_area.id as sale_area_id, sales_area.sales_area_name FROM districts INNER JOIN sales_area ON sales_area.id=districts.sales_area_id INNER JOIN regional_offices ON regional_offices.id=districts.regional_office_id INNER JOIN zones ON zones.zone_id=districts.zone_id WHERE districts.id = '${id}'`;

        db.query(selectQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Data fetched successfully", data: result[0]})
            }
            else
            {
                res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}


const updateDistrictById = async (req, res) => {

    try 
    {
        const district_id = req.body.district_id;
        const {energy_company_id, zone_id, regional_office_id, sales_area_id, district_name, status} = req.body;
        
        const joiSchema = Joi.object({
            energy_company_id: Joi.number().required(),
            zone_id: Joi.number().required(),
            regional_office_id: Joi.number().required(),
            sales_area_id: Joi.number().required(),
            district_name: Joi.string().required(),
            district_id: Joi.number().required()
        })
        
        const {error, value} = joiSchema.validate({energy_company_id: energy_company_id, zone_id: zone_id, regional_office_id: regional_office_id, sales_area_id: sales_area_id, district_name: district_name, district_id: district_id})
        
        if(error) return res.status(400).json({status: false, message:error.message});
        
        const updatedAt = moment().format();
        
        const updateQuery = `UPDATE districts SET energy_company_id='${energy_company_id}', zone_id = '${value.zone_id}', regional_office_id = '${value.regional_office_id}', sales_area_id = '${value.sales_area_id}', district_name = '${value.district_name}',  status='${status}', updated_at='${updatedAt}' WHERE id = '${district_id}'`;
        
        db.query(updateQuery, async(err, result) => {

            if(err) return res.status(500).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Data updated successfully"})
            }
            else
            {
                res.status(400).json({status: false, message: "Something went wrong, please try again."})
            }
        })

    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}

const removeDistrictById = async (req, res) => {
    
    try 
    {
        const id = req.params.id;
        
        const deleteQuery = `DELETE FROM districts WHERE id = '${id}'`;
    
        db.query(deleteQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Data deleted successfully"})
            }
            else
            {
                res.status(400).json({status: false, message: "Something went wrong, please try again."})
            }
        })
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}

const getAllDistrictBySaleAreaId = async(req, res) => {

    try 
    {
        const id = req.params.id
        const{error} = checkPositiveInteger.validate({id: id})
        if (error) return res.status(403).json({status: true, message: error.message})
        
        const activeStatus = process.env.ACTIVE_STATUS
        const selectQuery = `SELECT districts.id as district_id, districts.district_name, districts.status,sales_area.id as sale_area_id, sales_area.sales_area_name FROM districts INNER JOIN sales_area ON sales_area.id=districts.sales_area_id WHERE districts.sales_area_id='${id}' AND districts.status='${activeStatus}'`

        db.query(selectQuery, async(err, result) => {
            if (err) return res.status(403).json({status: false, message: err.message})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Fetched successfully", data: result})
            }
            else
            {
                return res.status(403).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}

module.exports = { addDistrict, getDistricts, getDistrictById, getActiveDistricts, editDistrictById, updateDistrictById, removeDistrictById, getAllDistrictBySaleAreaId}