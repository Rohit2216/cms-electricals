require("dotenv").config();
const moment = require("moment");
const { con, makeDb } = require("../db");
const Joi = require("joi");
const db = makeDb();
const {checkPositiveInteger, companyValidation} = require('../helpers/validation');
const { StatusCodes } = require('http-status-codes');
const {getGstDetailsByCompanyId} = require('../helpers/general');

const addPurchaseCompany = async (req, res) => {

    try 
    {

        const {company_name, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, gst_number, place_of_supply, billings_address, shipping_address} = req.body

        const {error, value} = purchaseCompany.validate(req.body);

        if (error) return res.status(400).json({status: false, message: error.message});

        const createdBy = req.user.user_id;
        const insertQuery = `INSERT INTO purchase_companies(company_name, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, gst_number, place_of_supply, billings_address, shipping_address, created_by) VALUES('${company_name}', '${company_email}', '${company_contact}', '${company_mobile}', '${company_address}', '${company_contact_person}', '${primary_contact_number}', '${primary_contact_email}', '${designation}', '${department}', '${company_website}', '${gst_treatment_type}', '${business_legal_name}', '${business_trade_name}', '${pan_number}', '${gst_number}', '${place_of_supply}', '${billings_address}', '${shipping_address}', '${createdBy}')`

        db.query(insertQuery, async (err, result) => {

            if(err) return res.status(500).json({status: false, message: err});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Purchase company created successfully"});
            }
            else
            {
                return res.status(403).json({status: false, message: "Something went wrong, please try again"});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getPurchaseCompany = async (req, res) => {
    try 
    {
        const loggedUserId = req.user.user_id

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1 ;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM companies WHERE company_type = ? AND is_deleted = ? `
        constTotalLength = await db.query(countSelectQuery, [process.env.PURCHASE_COMPANY, process.env.INACTIVE_STATUS]);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;
       
        var searchDataCondition = '';
        var queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != '') 
        {
            searchDataCondition = "AND companies.company_name LIKE ? ";
            queryParams.unshift(`%${searchData}%`);
        }

        const selectQuery = `SELECT companies.company_id, companies.company_unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, company_types.company_type_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type WHERE companies.is_superadmin_company = ? AND companies.company_type = ? AND companies.is_deleted = ? ${searchDataCondition} ORDER BY companies.company_id DESC LIMIT ?, ?`

        queryParams.unshift(process.env.VALUE_ZERO, process.env.PURCHASE_COMPANY, process.env.INACTIVE_STATUS)
        const  queryResult = await db.query(selectQuery, queryParams)

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            var values = [];

            for(const row of queryResult)
            {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);
               
                values.push({
                    company_id: row.company_id, 
                    company_unique_id: row.company_unique_id, 
                    company_name: row.company_name, 
                    company_email: row.company_email, 
                    company_contact: row.company_contact, 
                    company_mobile: row.company_mobile, 
                    company_address: row.company_address, 
                    company_contact_person: row.company_contact, 
                    primary_contact_number: row.primary_contact_, 
                    primary_contact_email: row.primary_contact_email, 
                    designation: row.designation, 
                    department: row.department, 
                    company_website: row.company_website, 
                    gst_treatment_type: row.gst_treatment_type, 
                    business_legal_name: row.business_legal_name, 
                    business_trade_name: row.business_trade, 
                    pan_number: row.pan_number, 
                    place_of_supply: row.place_of_supply, 
                    is_superadmin_company: row.is_superadmin_company,
                    company_type: row.company_type, 
                    company_type_name: row.company_type_name,
                    gst_details: companyGstDetails
                })
            }

            var pageDetails = [];
            pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

            res.send({status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails})
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

const getPurchaseCompanyById = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id})

        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const loggedUserId = req.user.user_id
        const selectQuery = `SELECT companies.company_id, companies.company_unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, company_types.company_type_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type WHERE companies.company_type = ? AND companies.company_id = ?`
        const queryResult = await db.query(selectQuery, [process.env.PURCHASE_COMPANY, id]);

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            var values = [];

            for(const row of queryResult)
            {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);
               
                values.push({
                    company_id: row.company_id, 
                    company_unique_id: row.company_unique_id, 
                    company_name: row.company_name, 
                    company_email: row.company_email, 
                    company_contact: row.company_contact, 
                    company_mobile: row.company_mobile, 
                    company_address: row.company_address, 
                    company_contact_person: row.company_contact_person, 
                    primary_contact_number: row.primary_contact_number, 
                    primary_contact_email: row.primary_contact_email, 
                    designation: row.designation, 
                    department: row.department, 
                    company_website: row.company_website, 
                    gst_treatment_type: row.gst_treatment_type, 
                    business_legal_name: row.business_legal_name, 
                    business_trade_name: row.business_trade_name, 
                    pan_number: row.pan_number, 
                    place_of_supply: row.place_of_supply, 
                    is_superadmin_company: row.is_superadmin_company,
                    company_type: row.company_type, 
                    company_type_name: row.company_type_name,
                    gst_details: companyGstDetails
                })
            }

            res.send({status: true, message: "Fetched successfully", data: values[0]})
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

const editPurchaseCompany = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id})

        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const loggedUserId = req.user.user_id
        const selectQuery = `SELECT companies.company_id, companies.company_unique_id, companies.company_type, companies.company_name, companies.company_email, companies.company_contact, companies.company_mobile, companies.company_address, companies.company_contact_person, companies.primary_contact_number, companies.primary_contact_email, companies.designation, companies.department, companies.company_website, companies.gst_treatment_type, companies.business_legal_name, companies.business_trade_name, companies.pan_number, companies.place_of_supply, companies.is_superadmin_company, company_types.company_type_name FROM companies INNER JOIN company_types ON company_types.company_type_id=companies.company_type WHERE companies.company_type = ? AND companies.company_id = ?`
        const queryResult = await db.query(selectQuery, [process.env.PURCHASE_COMPANY, id]);

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            var values = [];

            for(const row of queryResult)
            {
                const companyGstDetails = await getGstDetailsByCompanyId(row.company_id);
               
                values.push({
                    company_id: row.company_id, 
                    company_unique_id: row.company_unique_id, 
                    company_name: row.company_name, 
                    company_email: row.company_email, 
                    company_contact: row.company_contact, 
                    company_mobile: row.company_mobile, 
                    company_address: row.company_address, 
                    company_contact_person: row.company_contact_person, 
                    primary_contact_number: row.primary_contact_number, 
                    primary_contact_email: row.primary_contact_email, 
                    designation: row.designation, 
                    department: row.department, 
                    company_website: row.company_website, 
                    gst_treatment_type: row.gst_treatment_type, 
                    business_legal_name: row.business_legal_name, 
                    business_trade_name: row.business_trade_name, 
                    pan_number: row.pan_number, 
                    place_of_supply: row.place_of_supply, 
                    is_superadmin_company: row.is_superadmin_company,
                    company_type: row.company_type, 
                    company_type_name: row.company_type_name,
                    gst_details: companyGstDetails
                })
            }

            res.send({status: true, message: "Fetched successfully", data: values[0]})
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

const updatePurchaseCompanyById = async (req, res) => {

    try 
    {
        const {company_name, company_type, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, gst_details, place_of_supply, my_company, id} = req.body

        const {error} = companyValidation.validate(req.body)
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message:error.message})

        const updateQuery = `UPDATE companies SET company_name = ?, company_type = ?, company_email = ?, company_contact = ?, company_mobile = ?, company_address = ?, company_contact_person = ?, primary_contact_number = ?, primary_contact_email = ?, designation = ?, department = ?, company_website = ?, gst_treatment_type = ?, business_legal_name = ?, business_trade_name = ?, pan_number = ?, place_of_supply = ?, is_superadmin_company = ?, updated_at = ? WHERE company_id = ?`

        const updatedAt = moment().format()
        const createdBy = req.user.user_id

        const queryResult = await db.query(updateQuery, [company_name, company_type, company_email, company_contact, company_mobile, company_address, company_contact_person, primary_contact_number, primary_contact_email, designation, department, company_website, gst_treatment_type, business_legal_name, business_trade_name, pan_number, place_of_supply, my_company, updatedAt, id ])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            if(gst_details != null)
            {
                const getCompanyGstDetails = `SELECT company_id FROM company_gst_details WHERE company_id = ?`
                var getCompanyQueryResult = await db.query(getCompanyGstDetails, [id])
                

                for(let i = 0; i < gst_details.length; i++)
                {
                    const gst_number = gst_details[i].gst_number;
                    const shipping_address = gst_details[i].shipping_address;
                    const billing_address = gst_details[i].billing_address;
                    const is_default = gst_details[i].is_default;
                    const gst_details_id = gst_details[i].id;

                    if(getCompanyQueryResult.length > process.env.VALUE_ZERO)
                    {
                        const gstDetailUpdateQuery = `UPDATE company_gst_details SET gst_number = ?, shipping_address = ?, billing_address = ?, is_default = ?, updated_at = ? WHERE id = ?`;
                        const result = await db.query(gstDetailUpdateQuery, [gst_number, shipping_address, billing_address, is_default, updatedAt, gst_details_id])
                    }
                    else
                    {
                        const gstDetailInsertQuery = `INSERT INTO company_gst_details (company_id, gst_number, shipping_address, billing_address, is_default, created_by) VALUES(?, ?, ?, ?, ?, ?)`;
                        const result = await db.query(gstDetailInsertQuery, [id, gst_number, shipping_address, billing_address, is_default, createdBy])
                    }
                    
                    
                }
            }

            res.status(StatusCodes.OK).json({status: true, message: "Company details updated successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Error! Company details not updated"})
        }

    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const deletePurchaseCompanyById = async (req, res) => {

    try 
    {
        const id = req.params.id
        const{error} = checkPositiveInteger.validate({id})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        
        const deleteQuery = `UPDATE companies SET is_deleted = ? WHERE company_id = ?`
        const queryResult = await db.query(deleteQuery, [process.env.ACTIVE_STATUS, id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Company deleted successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Error! Company details not updated"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})
    }
}

module.exports = {addPurchaseCompany, getPurchaseCompany, getPurchaseCompanyById, editPurchaseCompany, updatePurchaseCompanyById, deletePurchaseCompanyById}