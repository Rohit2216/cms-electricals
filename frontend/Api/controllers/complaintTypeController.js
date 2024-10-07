var moment = require('moment');
require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { complaintTypeValidations, checkPositiveInteger} = require('../helpers/validation');
const {getZoneNameById, getRegionalNameById, getSaleAreaNameById, getDistrictById, getOutletById} = require('../helpers/general')


const addComplaintType = async (req, res) => {

    try 
    {
        const {energy_company_id, zone_id, ro_id, sale_area_id, district_id, outlet_id, complaint_type} = req.body;
        const {error} = complaintTypeValidations.validate(req.body);
        if(error)
        {
            return res.status(400).json({ status: false, message: error.message });
        }
        const formatZoneId = JSON.stringify(zone_id)
        const formatRoId = JSON.stringify(ro_id)
        const formatSaleAreaId = JSON.stringify(sale_area_id)
        const formatDistrictId = JSON.stringify(district_id)
        const formatOutletId = JSON.stringify(outlet_id)

        const loggedUserId = req.user.user_id;
        const insertQuery = `INSERT INTO complaints (energy_company_id, zone_id, ro_id, sale_area_id, district_id, outlet_id, complaint_type, created_by) VALUES ('${energy_company_id}', '${formatZoneId}', '${formatRoId}', '${formatSaleAreaId}', '${formatDistrictId}', '${formatOutletId}', '${complaint_type}', '${loggedUserId}')`
        
        db.query(insertQuery, (err, result) => {
            
            if(err) return res.status(500).json({ status: false, message: err.message });

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({ status: true, message: "Complaint Type Added successfully"});
            }else
            {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later"});
            }
        });

    } 
    catch (error) 
    {
        return res.status(500).json({ status: false, message: error.message });
    }
}


const getAllComplaintTypes = async (req, res) => {

    try 
    {

        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM complaints`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '')
        {
            var selectQuery = `SELECT complaints.*, energy_companies.name as ec_name FROM complaints INNER JOIN energy_companies ON energy_companies.id=complaints.energy_company_id WHERE complaint_type LIKE '%${searchData}%' ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }
        else
        {
            var selectQuery = `SELECT complaints.*, energy_companies.name as ec_name FROM complaints INNER JOIN energy_companies ON energy_companies.id=complaints.energy_company_id ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        }

        db.query(selectQuery, async(err, result) => {
            if(err) return res.status(500).json({ status: false, message: err});

            if(result.length > process.env.VALUE_ZERO)
            {
                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

                var values = [];

                for(const row of result)
                {
                    const selectedZones = await getZoneNameById(row.zone_id)
                    const selectedRegionalOffices = await getRegionalNameById(row.ro_id)
                    const selectedSaleAreas = await getSaleAreaNameById(row.sale_area_id)
                    const selectedDistricts = await getDistrictById(row.district_id)
                    const selectedOutlets = await getOutletById(row.outlet_id)

                    values.push({
                        id: row.id,
                        energy_company_id: row.energy_company_id,
                        ec_name: row.ec_name,
                        complaint_type: row.complaint_type,
                        status: row.status,
                        complaint_create_date: moment(row.created_at).format('YYYY-MM-DD'),
                        zones: selectedZones,
                        regionalOffices: selectedRegionalOffices,
                        saleAreas: selectedSaleAreas,
                        districts: selectedDistricts,
                        outlets: selectedOutlets,
                    })
                }
                res.status(200).json({ status: true, message: "Complaint Types fetched successfully", data: values, pageDetails: pageDetails});
            }
            else
            {
                return res.status(400).json({ status: false, message: "Data not found"});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({ status: false, message: error.message})    
    }
}

const getComplaintTypeById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id: id});
        
        if(error) return res.status(400).json({ status: false, message: error.message})
        
        const selectQuery = `SELECT * FROM complaints WHERE id = '${id}'`;

        db.query(selectQuery, async(err, result) => {
            
            if(err) return res.status(500).json({ status: false, message: err});
            
            if(result.length > process.env.VALUE_ZERO)
            {
                var values = [];

                for(const row of result)
                {
                    const selectedZones = await getZoneNameById(row.zone_id)
                    const selectedRegionalOffices = await getRegionalNameById(row.ro_id)
                    const selectedSaleAreas = await getSaleAreaNameById(row.sale_area_id)
                    const selectedDistricts = await getDistrictById(row.district_id)
                    const selectedOutlets = await getOutletById(row.outlet_id)

                    values.push({
                        id: row.id,
                        energy_company_id: row.energy_company_id,
                        ec_name: row.ec_name,
                        complaint_type: row.complaint_type,
                        status: row.status,
                        complaint_create_date: moment(row.created_at).format('YYYY-MM-DD'),
                        zones: selectedZones,
                        regionalOffices: selectedRegionalOffices,
                        saleAreas: selectedSaleAreas,
                        districts: selectedDistricts,
                        outlets: selectedOutlets,
                    })
                }
                res.status(200).json({ status: true, message: "Complaint Type fetched successfully", data: values[0]});
            }
            else
            {
                return res.status(400).json({ status: false, message: "Data not found"});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({ status: false, message: error.message})    
    }
}

const updateComplaintType = async (req, res) => {

    try 
    {
        const {energy_company_id, zone_id, ro_id, sale_area_id, district_id, outlet_id, complaint_type} = req.body;
        const {error} = complaintTypeValidations.validate(req.body);
        if(error)
        {
            return res.status(400).json({ status: false, message: error.message });
        }

        const formatZoneId = JSON.stringify(zone_id)
        const formatRoId = JSON.stringify(ro_id)
        const formatSaleAreaId = JSON.stringify(sale_area_id)
        const formatDistrictId = JSON.stringify(district_id)
        const formatOutletId = JSON.stringify(outlet_id)
        
        const updatedAt = moment().format();
        const id = req.body.id;

        const updateQuery = `UPDATE complaints SET energy_company_id = '${energy_company_id}', zone_id = '${formatZoneId}', ro_id = '${formatRoId}', sale_area_id = '${formatSaleAreaId}', district_id= '${formatDistrictId}', outlet_id = '${formatOutletId}', complaint_type = '${complaint_type}', updated_at = '${updatedAt}' WHERE id = '${id}'`;

        db.query(updateQuery, (err, result) => {
            if(err) return res.status(500).json({ status: false, message: err});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({ status: true, message: "Complaint Type Updated successfully"});
            }
            else
            {
                return res.status(400).json({ status: false, message: "Something went wrong, please try again later"});
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({ status: false, message: error.message})    
    }
}

const updateComplaintStatus = async(req, res) => {

    try 
    {
        const {id, status} = req.body;
        
        const {error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(403).json({status: false, message: error.message})

        var complaintStatus = '';
        if(status == 1)
        {
            complaintStatus = 'Pending'
        }
        else if(status == 2)
        {
            complaintStatus = 'Viewed'
        }
        else if(status == 3)
        {
            complaintStatus = 'Approved'
        }
        else if(status == 4)
        {
            complaintStatus = 'Rejected'
        }
        else if(status == 5)
        {
            complaintStatus = 'Resolved'
        }
        const updateQuery = `UPDATE complaints SET status = ? WHERE id = ?`

        const queryResult = await db.query(updateQuery, [status, id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(200).json({status: true, message: "Complaint status change to " + complaintStatus 
            + " successfully"})
        }
        else
        {
            return res.status(400).json({status: false, message:"Error! complaint status not changed"})
        }
    } catch (error) 
    {
        return res.status(500).json({ status: false, message: error.message})     
    }
}



module.exports = {addComplaintType, getAllComplaintTypes, getComplaintTypeById, updateComplaintType, updateComplaintStatus}