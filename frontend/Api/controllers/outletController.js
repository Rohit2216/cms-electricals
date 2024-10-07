var moment = require('moment');
require("dotenv").config();
const { con, makeDb } = require("../db");
const Joi = require("joi");
const db = makeDb();
const { outletFormValidation} = require('../helpers/validation');



const addOutlet = async (req, res) => {

    try 
    {
        const {energy_company_id, zone_id, regional_id, sales_area_id, district_id, outlet_name, outlet_contact_person_name, outlet_conatct_number, primary_number, secondary_number, primary_email, secondary_email, customer_code, outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude} = req.body; 
        const created_by = req.user.user_id;
        var storePath = '';
        
        const joiSchema = Joi.object({
            energy_company_id: Joi.number().required(),
            zone_id: Joi.number().required(),
            regional_id: Joi.number().required(),
            sales_area_id: Joi.number().required(),
            district_id: Joi.number().required(),
            outlet_name: Joi.string().required(),
            outlet_conatct_number: Joi.number().required(),
            customer_code: Joi.string().required(),
            outlet_category: Joi.string().required(),
            outlet_ccnoms: Joi.string().required(),
            outlet_ccnohsd: Joi.string().required(),

        }).options({ allowUnknown: true });

        const {error, value} = joiSchema.validate(req.body)

        if(error) return res.status(400).json({status: false, message: error.message});

        if(req.files != null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/outlet_images/' + imageName;
            storePath = '/outlet_images/' + imageName;
            image.mv(uploadPath, (err, response) => {

                if (err) return res.status(400).json({status: false, message: err.message});
            })
        }
       
        const insertQuery = `INSERT INTO outlets (energy_company_id, zone_id, regional_office_id, sales_area_id, district_id, outlet_name, outlet_contact_person_name, outlet_contact_number, primary_number, secondary_number, primary_email, secondary_email, customer_code, outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude, created_by, outlet_image) VALUES ('${energy_company_id}', '${zone_id}', '${regional_id}', '${sales_area_id}', '${district_id}', '${outlet_name}', '${outlet_contact_person_name}', '${outlet_conatct_number}', '${primary_number}', '${secondary_number}', '${primary_email}', '${secondary_email}', '${customer_code}', '${outlet_category}', '${location}', '${address}', '${outlet_ccnoms}', '${outlet_ccnohsd}', '${outlet_resv}', '${outlet_lattitude}', '${outlet_longitude}', '${created_by}', '${storePath}')`
        
        db.query(insertQuery, (err, result) => {
            if (err) return res.status(500).json({status: false, message: err.message });

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Outlet created successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message });      
    }
}

const getAllOutlet = async (req, res) => {

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM notifications`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '')
        {
            var selectQuery = `SELECT outlets.id, outlets.energy_company_id, outlets.zone_id, outlets.regional_office_id, outlets.sales_area_id, outlets.district_id, outlets.outlet_name, outlets.outlet_contact_person_name, outlets.outlet_contact_number, outlets.primary_number, outlets.secondary_number, outlets.primary_email, outlets.secondary_email, outlets.customer_code, outlets.outlet_category, outlets.location, outlets.address, outlets.outlet_ccnoms, outlets.outlet_ccnohsd, outlets.outlet_resv, outlets.outlet_longitude, outlets.outlet_lattitude, outlets.outlet_image, outlets.created_by, outlets.created_at, energy_companies.name as energy_company_name, zones.zone_name, regional_offices.regional_office_name, sales_area.sales_area_name, districts.district_name FROM outlets INNER JOIN energy_companies ON energy_companies.id=outlets.energy_company_id INNER JOIN zones ON zones.zone_id=outlets.zone_id INNER JOIN regional_offices ON regional_offices.id=outlets.regional_office_id INNER JOIN sales_area ON sales_area.id=outlets.sales_area_id INNER JOIN districts ON districts.id=outlets.district_id WHERE outlets.outlet_name LIKE '%${searchData}%' ORDER by outlets.id DESC LIMIT ${pageFirstResult} , ${pageSize} `
        }
        else
        {
            var selectQuery = `SELECT outlets.id, outlets.energy_company_id, outlets.zone_id, outlets.regional_office_id, outlets.sales_area_id, outlets.district_id, outlets.outlet_name, outlets.outlet_contact_person_name, outlets.outlet_contact_number, outlets.primary_number, outlets.secondary_number, outlets.primary_email, outlets.secondary_email, outlets.customer_code, outlets.outlet_category, outlets.location, outlets.address, outlets.outlet_ccnoms, outlets.outlet_ccnohsd, outlets.outlet_resv, outlets.outlet_longitude, outlets.outlet_lattitude, outlets.outlet_image, outlets.created_by, outlets.created_at, energy_companies.name as energy_company_name, zones.zone_name, regional_offices.regional_office_name, sales_area.sales_area_name, districts.district_name FROM outlets INNER JOIN energy_companies ON energy_companies.id=outlets.energy_company_id INNER JOIN zones ON zones.zone_id=outlets.zone_id INNER JOIN regional_offices ON regional_offices.id=outlets.regional_office_id INNER JOIN sales_area ON sales_area.id=outlets.sales_area_id INNER JOIN districts ON districts.id=outlets.district_id ORDER by outlets.id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({status: false, message: err});

            if(result.length > process.env.VALUE_ZERO)
            {
                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

                res.status(200).json({status: true, message: "Outlet fetched successfully", data: result, pageDetails: pageDetails})
            }
            else
            {
                return res.status(400).json({status: false, message: "Data not found"})
            }
        });
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}

const getOutletById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM outlets WHERE id = '${id}'`

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({status: false, message: err});
            
            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Outlet fetched successfully", data: result[0]})
            }
            else
            {
                return res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
       return res.status(400).json({status: false, message: error.message}) 
    }
}


const editOutlet = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM outlets WHERE id = '${id}'`

        db.query(selectQuery, (err, result) => {
            if (err) return res.status(500).json({status: false, message: err});

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status:true, message: "Outlet fetched successfully", data: result[0]})
            }
            else
            {
                return res.status(400).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}

const updateOutlet = async (req, res) => {

    try 
    {
        const id = req.body.id;
        
        const {energy_company_id, zone_id, regional_id, sales_area_id, district_id, outlet_name, outlet_contact_person_name, outlet_conatct_number, primary_number, secondary_number, primary_email, secondary_email, customer_code, outlet_category, location, address, outlet_ccnoms, outlet_ccnohsd, outlet_resv, outlet_longitude, outlet_lattitude} = req.body; 

        const {error, value} = outletFormValidation.validate(req.body);
        
        if(error) return res.status(400).json({status: false, message: error})

        const updatedAt = moment().format();
        var storePath = '';
        
        if(req.files != null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/outlet_images/' + imageName;
            storePath = '/outlet_images/' + imageName;
            image.mv(uploadPath, (err, response) => {
                
                if (err) return res.status(403).json({status: false, message: err});
            })
        }
        else
        {
            storePath = req.body.image
        }

        const updateQuery = `UPDATE outlets SET energy_company_id = '${energy_company_id}', zone_id='${zone_id}', regional_office_id='${regional_id}', sales_area_id='${sales_area_id}', district_id='${district_id}', outlet_name='${outlet_name}', outlet_contact_person_name='${outlet_contact_person_name}', outlet_contact_number='${outlet_conatct_number}', primary_number='${primary_number}', secondary_number='${secondary_number}', primary_email='${primary_email}', secondary_email='${secondary_email}', customer_code='${customer_code}', outlet_category='${outlet_category}', location='${location}', address='${address}', outlet_ccnoms='${outlet_ccnoms}', outlet_ccnohsd='${outlet_ccnohsd}', outlet_resv='${outlet_resv}', outlet_longitude='${outlet_longitude}', outlet_lattitude='${outlet_lattitude}', updated_at='${updatedAt}', outlet_image='${storePath}' WHERE id = '${id}'`
        db.query(updateQuery, (err, result) => {
            if (err) return res.status(500).json({status: false, message: err});
            
            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Outlet updated successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}


const removeOutletById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const deleteQuery = `DELETE FROM outlets WHERE id = '${id}'`

        db.query(deleteQuery, (err, result) => {
            if (err) return res.status(500).json({status: false, message: err});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                return res.status(200).json({status: true, message: "Outlet deleted successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}


module.exports = {addOutlet, getAllOutlet, getOutletById, editOutlet, updateOutlet, removeOutletById}