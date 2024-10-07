var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, adminCreateValidation, energyCompanyValidations } = require('../helpers/validation');
const { StatusCodes } = require('http-status-codes');
const { promisify } = require('util');



const createEnergyCompanyUser = async (req, res) => {

    try 
    {
        const {username, email, password, contact_no, joining_date} = req.body
        const {error, value} = adminCreateValidation.validate(req.body)
        if(error) return res.status(400).json({status: false, message: error.message});

        const user_type = process.env.USER_ROLE_ID
        const admin_id = req.user.user_id
        const created_by = admin_id
        var user_for = req.body.user_for

        if(user_for == 'zone')
        {
            var zone_id = req.body.zone_id
        }
        else if(user_for == 'regional_office')
        {
            var regional_id = req.body.regional_id
        }
        else
        {
            var sale_area_id = req.body.sale_area_id
        }

        var storePath = '';

        if(req.files != null)
        {   
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, (err, response) => {

                if (err) return res.status(400).json({status: false, message: err.message});
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const date = new Date(req.body.joining_date);
       
        const createUserQuery = `INSERT INTO users (name, username, email, password, mobile, joining_date, image, user_type, admin_id, zone_id, regional_id, sale_area_id, created_by) VALUES('${username}', '${username}', '${email}', '${hashPassword}', '${contact_no}', '${joining_date}', '${storePath}', '${user_type}', '${admin_id}', '${zone_id}', '${regional_id}', '${sale_area_id}', '${created_by}')`

        db.query(createUserQuery, async (err, result) => {
            if (err) return res.status(500).json({status: false, message: err});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "User created successfully"})    
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try again later"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const createSubUsersForEnergyCompanyZoneUser = async (req, res) => {

    try 
    {
       const {username, email, password, contact_no, joining_date, zone_id} = req.body
       const {error, value} = adminCreateValidation.validate({email: req.body.email, password: req.body.password, contact_no: req.body.contact_no})

       if(error) return res.status(400).json({status: false, message: error.message});

       const user_type = process.env.SUB_USER_ROLE_ID
       const admin_id = req.user.user_id
       const created_by = admin_id
       const getZoneUser = `SELECT id FROM users WHERE user_type='${process.env.USER_ROLE_ID}' AND zone_id='${zone_id}'`
       const getZoneUserResult = await db.query(getZoneUser)
       const user_id = getZoneUserResult[0].id
        
       var storePath = '';

       if(req.files != null)
       {   
           const image = req.files.image
           const imageName = Date.now()+image.name
           const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
           storePath = '/user_images/' + imageName;
           image.mv(uploadPath, (err, response) => {

               if (err) return res.status(400).json({status: false, message: err.message});
           })
        }

       const salt = bcrypt.genSaltSync(10);
       const hashPassword = await bcrypt.hash(password, salt);

       const insertQuery = `INSERT INTO users (name, username, email, password, mobile, joining_date, image, user_type, admin_id, user_id, zone_id, created_by) VALUES('${username}', '${username}', '${email}', '${hashPassword}', '${contact_no}', '${joining_date}', '${storePath}', '${user_type}', '${admin_id}', '${user_id}', '${zone_id}', '${created_by}')`
       
      // res.status(200).json({status: true, data:insertQuery})

       db.query(insertQuery, async (err, result) => {
            if(err) return res.status(403).json({stats: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Sub user created successfully'})
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
            }
       })
       
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}


const createSubUsersForEnergyCompanyRegionalOfficeUser = async (req, res) => {

    try 
    {
        const {username, email, password, contact_no, joining_date, regional_id} = req.body
        const {error, value} = adminCreateValidation.validate({email: req.body.email, password: req.body.password, contact_no: req.body.contact_no})
        
        if(error) return res.status(400).json({status: false, message: error.message});
        
        const user_type = process.env.SUB_USER_ROLE_ID
        const admin_id = req.user.user_id
        const created_by = admin_id
        const getZoneUser = `SELECT id FROM users WHERE user_type='${process.env.USER_ROLE_ID}' AND regional_id='${regional_id}'`
        const getZoneUserResult = await db.query(getZoneUser)
        const user_id = getZoneUserResult[0].id
        
        var storePath = '';
        
        if(req.files != null)
        {   
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, (err, response) => {
                
                if (err) return res.status(400).json({status: false, message: err.message});
            })
        }
        
        
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        
        const insertQuery = `INSERT INTO users (name, username, email, password, mobile, joining_date, image, user_type, admin_id, user_id, regional_id, created_by) VALUES('${username}', '${username}', '${email}', '${hashPassword}', '${contact_no}', '${joining_date}', '${storePath}', '${user_type}', '${admin_id}', '${user_id}', '${regional_id}', '${created_by}')`
        
        //res.status(200).json({status: true, data: insertQuery})

       db.query(insertQuery, async (err, result) => {
            if(err) return res.status(403).json({stats: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Sub user created successfully'})
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
            }
       })
       
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const createSubUsersForEnergyCompanySaleAreaUser = async (req, res) => {

    try 
    {
        const {username, email, password, contact_no, joining_date, sale_area_id} = req.body
        const {error, value} = adminCreateValidation.validate({email: req.body.email, password: req.body.password, contact_no: req.body.contact_no})
        
        if(error) return res.status(400).json({status: false, message: error.message});
        
        const user_type = process.env.SUB_USER_ROLE_ID
        const admin_id = req.user.user_id
        const created_by = admin_id
        const getZoneUser = `SELECT id FROM users WHERE user_type='${process.env.USER_ROLE_ID}' AND sale_area_id='${sale_area_id}'`
        const getZoneUserResult = await db.query(getZoneUser)
       // res.status(200).json({status: true, data: getZoneUserResult})
        const user_id = getZoneUserResult[0].id
        
        var storePath = '';
        
        if(req.files != null)
        {   
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, (err, response) => {
                
                if (err) return res.status(400).json({status: false, message: err.message});
            })
        }
        
        
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        
        const insertQuery = `INSERT INTO users (name, username, email, password, mobile, joining_date, image, user_type, admin_id, user_id, sale_area_id, created_by) VALUES('${username}', '${username}', '${email}', '${hashPassword}', '${contact_no}', '${joining_date}', '${storePath}', '${user_type}', '${admin_id}', '${user_id}', '${sale_area_id}', '${created_by}')`
        
       db.query(insertQuery, async (err, result) => {
            if(err) return res.status(403).json({stats: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Sub user created successfully'})
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
            }
       })
       
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getEnergyCompanyDetailsById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error}  = checkPositiveInteger.validate({id: id});
        if(error) return res.status(400).json({status: false, message: error.message});
        
        // const selectQuery = `SELECT admins.name, admins.email, admins.contact_no, admins.image, zone_assigns.zone_id, zones.zone_name, regional_office_assigns.regional_office_id, regional_offices.regional_office_name, sale_area_assigns.sale_area_id, sales_area.sales_area_name, roles.name as user_type FROM admins INNER JOIN zone_assigns ON zone_assigns.energy_company_id=admins.id INNER JOIN zones ON zones.zone_id=zone_assigns.zone_id INNER JOIN regional_office_assigns ON regional_office_assigns.energy_company_id=admins.id INNER JOIN regional_offices ON regional_offices.id=regional_office_assigns.regional_office_id INNER JOIN sale_area_assigns ON sale_area_assigns.energy_company_id=admins.id INNER JOIN sales_area ON sales_area.id=sale_area_assigns.sale_area_id INNER JOIN roles ON roles.id=admins.user_type WHERE admins.id ='${id}' AND admins.user_type = '${process.env.ENERGY_COMPANY_ROLE_ID}'`

        const selectQuery = `SELECT energy_companies.id as ec_id, energy_companies.name as company_name, energy_companies.website as website_url, admins.name as username, admins.email, admins.contact_no, admins.alt_number, admins.address_1, admins.status, admins.country, admins.city, admins.pin_code, admins.image, admins.description, admins.gst_number, zone_assigns.zone_id, zones.zone_name, regional_office_assigns.regional_office_id as ro_id, regional_offices.regional_office_name, sale_area_assigns.sale_area_id, sales_area.sales_area_name FROM admins INNER JOIN energy_companies ON energy_companies.admin_id=admins.id INNER JOIN zone_assigns ON zone_assigns.energy_company_id=energy_companies.admin_id LEFT JOIN zones ON zones.zone_id=zone_assigns.zone_id LEFT JOIN regional_office_assigns ON regional_office_assigns.energy_company_id=energy_companies.admin_id LEFT JOIN regional_offices ON regional_offices.id=regional_office_assigns.regional_office_id INNER JOIN sale_area_assigns ON sale_area_assigns.energy_company_id=energy_companies.admin_id LEFT JOIN sales_area ON sales_area.id=sale_area_assigns.sale_area_id WHERE admins.id ='${id}' AND admins.user_type = '${process.env.ENERGY_COMPANY_ROLE_ID}'`

        db.query(selectQuery, async (err, result) => {
            if(err) return res.status(403).json({stats: false, message: err})
            
            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, data: result[0]})
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




const updateEnergyCompanyDetails = async (req, res) => {

    try 
    {
        const {username, email, contact_no, alt_number, country, city, company_name, description, gst_number, pin_code, status, website_url, address_1, zone_id, ro_id,  sale_area_id, image, id} = req.body
        
        const {error} = energyCompanyValidations.validate({name: username, email: email, contact_no: contact_no})
        if(error) return res.status(400).json({status: false, message: error.message});

        const {error: idError} = checkPositiveInteger.validate({id: id})
        if(idError) return res.status(400).json({status: false, message:idError.message});

        var storePath = '';
        if(req.files != null)
        {   
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, (err, response) => {

                if (err) return res.status(400).json({status: false, message: err.message});
            })
        }
        else
        {
            storePath = image 
        }

        const updatedAt = moment().format();

        const updateQuery = `UPDATE admins SET name='${username}', email='${email}', contact_no='${contact_no}',  alt_number='${alt_number}', country='${country}', city='${city}', description='${description}', gst_number='${gst_number}', pin_code='${pin_code}', status='${status}', address_1='${address_1}',  updated_at='${updatedAt}' WHERE id='${id}'`
       
        db.query(updateQuery, async (err, result) => {

            if(err) return res.status(403).json({stats: false, message: err.message})
            
            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const energy_company_id = id
                const assignZoneUpdateQuery = `UPDATE zone_assigns SET zone_id='${zone_id}', updated_at='${updatedAt}' WHERE energy_company_id='${energy_company_id}'`
                const assignZoneUpdateResult = await db.query(assignZoneUpdateQuery)
                
                const assignRegionalOfficeUpdateQuery = `UPDATE regional_office_assigns SET regional_office_id='${ro_id}', updated_at='${updatedAt}' WHERE energy_company_id='${energy_company_id}'`
                const assignRegionalOfficeUpdateResult = await db.query(assignRegionalOfficeUpdateQuery)

                const assignSaleAreaUpdateQuery = `UPDATE sale_area_assigns SET sale_area_id='${sale_area_id}', updated_at='${updatedAt}' WHERE energy_company_id='${energy_company_id}'`
                const assignSaleAreaUpdateResult = await db.query(assignSaleAreaUpdateQuery)

                const energyCompanyUpdateQuery = `UPDATE energy_companies SET name= ?, website= ? WHERE admin_id= ?`
                const queryResult = await db.query(energyCompanyUpdateQuery, [company_name, website_url, energy_company_id])

                res.status(200).json({status: true, message: 'Data updated successfully'})
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
            }
        });
    } 
    catch (error) 
    {
        return res.status500(500).json({status: false, message: error.message});    
    }
}

const updateEnergyCompanyUserDetails = async (req, res) => { 

    try 
    {
        const {name, email, mobile, joining_date, zone_id, regional_id, sale_area_id, id} = req.body; 
        const {error} = energyCompanyValidations.validate({name: name, email: email, contact_no: mobile})
        if(error) return res.status(400).json({status: false, message: error.message});

        const {error: idError} = checkPositiveInteger.validate({id: id})
        if(idError) return res.status(400).json({status: false, message:idError.message});

        var storePath = '';
        if(req.files!= null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(400).json({status: false, message: err.message});
            })
        }

        const updatedAt = moment().format();
        const updateQuery = `UPDATE users SET name='${name}', email='${email}', mobile='${mobile}', joining_date='${joining_date}', image='${storePath}', zone_id='${zone_id}', regional_id='${regional_id}', sale_area_id='${sale_area_id}', updated_at='${updatedAt}' WHERE id = '${id}'`

        db.query(updateQuery, async(err, result) => {
            if(err) return res.status(403).json({stats: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "User updated successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const updateEnergyCompanySubUserDetails = async (req, res) => {

    try 
    {
        const {name, email, mobile, joining_date, zone_id, regional_id, sale_area_id, id} = req.body; 
        const {error} = energyCompanyValidations.validate({name: name, email: email, contact_no: mobile})
        if(error) return res.status(400).json({status: false, message: error.message});

        const {error: idError} = checkPositiveInteger.validate({id: id})
        if(idError) return res.status(400).json({status: false, message:idError.message}); 
        
        var storePath = '';
        const updatedAt = moment().format();
        if(req.files != null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
            storePath = '/user_images/' + imageName;
            image.mv(uploadPath, (err, response) => {
                if (err) return res.status(400).json({status: false, message: err.message});
            })
        }

        const updateQuery = `UPDATE users SET name='${name}', email='${email}', mobile='${mobile}', joining_date='${joining_date}', image='${storePath}', zone_id='${zone_id}', regional_id='${regional_id}', sale_area_id='${sale_area_id}', updated_at='${updatedAt}' WHERE id = '${id}'`

        db.query(updateQuery, async(err, result) => {
            if(err) return res.status(403).json({stats: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Sub user updated successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
            }
        })

    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});     
    }
}

const deleteEnergyCompany = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(400).json({status: false, message: error.message});

        const selectQueryForUserType = `SELECT admins.name, admins.user_type, energy_companies.name as company_name, energy_companies.id as energy_company_id, zone_assigns.id as zone_id, regional_office_assigns.id as regional_office_id, sale_area_assigns.id as sale_area_id FROM admins INNER JOIN energy_companies ON energy_companies.admin_id= admins.id INNER JOIN zone_assigns ON zone_assigns.energy_company_id=admins.id INNER JOIN regional_office_assigns ON regional_office_assigns.energy_company_id = admins.id INNER JOIN sale_area_assigns ON sale_area_assigns.energy_company_id = admins.id WHERE admins.id='${id}' AND admins.user_type='${process.env.ENERGY_COMPANY_ROLE_ID}'`
        db.query(selectQueryForUserType, async (err, result) => {
            
            if(err) return res.status(400).json({status: false, message: err});

            if(result.length > process.env.VALUE_ZERO) 
            {
                if(result[0].user_type != process.env.ENERGY_COMPANY_ROLE_ID) 
                {
                    return res.status(403).json({status: false, message: 'Energy company does not exist'})
                }
                else
                { 
                    const {username, email, password, contact_no, alt_number, address_1, gst_number, country, city, pin_code, description} = req.body
                    const {error} = adminCreateValidation.validate({email: email, password: password, contact_no: contact_no})
                    if(error) return res.status(400).json({status: false, message: error.message});

                    const energy_company_id = result[0].energy_company_id
                    const zone_id = result[0].zone_id
                    const regional_id = result[0].regional_office_id
                    const sale_area_id = result[0].sale_area_id
                    const user_type = result[0].user_type
                    const created_by = req.user.user_id

                    var storePath = '';
                    if(req.files != null)
                    {
                        const image = req.files.image
                        const imageName = Date.now()+image.name
                        const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
                        storePath = '/user_images/' + imageName;
                        image.mv(uploadPath, (err, response) => {
                            if (err) return res.status(400).json({status: false, message: err.message});
                        })
                    }

                    const salt = bcrypt.genSaltSync(10);
                    const hashPassword = await bcrypt.hash(password, salt);

                    const insertAdminQuery = `INSERT INTO admins (name, email, password, contact_no, alt_number, user_type, address_1, country, city, pin_code, image, description, gst_number, created_by) VALUES('${username}', '${email}', '${hashPassword}', '${contact_no}', '${alt_number}', '${user_type}', '${address_1}', '${country}', '${city}', '${pin_code}', '${storePath}', '${description}', '${gst_number}', '${created_by}')`

                    db.query(insertAdminQuery, async(err, result) => {
                        if(err) return res.status(403).json({stats: false, message: err})
                        
                        if(result.affectedRows > process.env.VALUE_ZERO)
                        {
                            const newEnergyCompanyId = result.insertId
                            const updated_at = moment().format();

                            const updateZoneAssignQuery = `UPDATE zone_assigns SET energy_company_id='${newEnergyCompanyId}', updated_at='${updated_at}' WHERE id = '${zone_id}'`
                            const updateZoneAssignResult = await db.query(updateZoneAssignQuery)

                            const updateRegionalAssign = `UPDATE regional_office_assigns SET energy_company_id='${newEnergyCompanyId}', updated_at='${updated_at}' WHERE id = '${regional_id}'`
                            const updateRegionalAssignResult = await db.query(updateRegionalAssign) 

                            const updateSaleAreaQuery = `UPDATE sale_area_assigns SET energy_company_id='${newEnergyCompanyId}', updated_at='${updated_at}' WHERE id = '${sale_area_id}'`
                            const updateSaleAreaResult = await db.query(updateSaleAreaQuery)

                            const updateEnergyCompanyQuery = `UPDATE energy_companies SET admin_id='${newEnergyCompanyId}', updated_at='${updated_at}' WHERE id='${energy_company_id}'`
                            const updateEnergyCompanyResult = await db.query(updateEnergyCompanyQuery)

                            const softDeleteQueryForOldEnergyCompany = `UPDATE admins SET status='0' WHERE id='${id}'`
                            const softDeleteResultForOldEnergyCompany = await db.query(softDeleteQueryForOldEnergyCompany)

                            return res.status(200).json({status: true, message: "Energy company deleted and new user assigned to company successfully"});   
                        }
                        else
                        {
                            return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
                        }
                    })

                }
            }
            else
            {
                return res.status(400).json({status: false, message: 'Energy company does not exist'})
            }
        })   
    } 
    catch(error)
    {
        return res.status(500).json({status: false, message: error.message});
    }
}

const deleteEnergyCompanyUser = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(400).json({status: false, message: error.message});
        
        const existedUserQuery = `SELECT * FROM users WHERE id='${id}' AND user_type='${process.env.USER_ROLE_ID}'`
        const existedUserDetails = await db.query(existedUserQuery)
        
        if(existedUserDetails.length > process.env.VALUE_ZERO)
        {
            const admin_id = existedUserDetails[0].existedUserDetails
            const zone_id = existedUserDetails[0].zone_id
            const regional_id = existedUserDetails[0].regional_id
            const sale_area_id = existedUserDetails[0].sale_area_id
            const created_by = req.user.user_id
            const user_type = existedUserDetails[0].user_type
            
            const {name, email, password, mobile, joining_date} = req.body
            const {error: formError} = adminCreateValidation.validate({email: email, password: password, contact_no: mobile})
            if(formError) return res.status(400).json({status: false, message: formError.message});
            
            var storePath = '';
            
            if(req.files != null)
            {
                const image = req.files.image
                const imageName = Date.now()+image.name
                const uploadPath =  process.cwd() +'/public/user_images/' + imageName;
                storePath = '/user_images/' + imageName;
                image.mv(uploadPath, (err, response) => {
                    if (err) return res.status(400).json({status: false, message: err.message});
                })
            }

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const insertQuery = `INSERT INTO users (name, username, email, password, mobile, joining_date, image, user_type, admin_id, zone_id, regional_id, sale_area_id, created_by) VALUES('${name}', '${name}', '${email}', '${hashPassword}', '${mobile}', '${joining_date}', '${storePath}', '${user_type}', '${admin_id}', '${zone_id}', '${regional_id}', '${sale_area_id}', '${created_by}')`

            db.query(insertQuery, async (err, result) => {
                if(err) return res.status(400).json({status: false, message: err})

                if(result.affectedRows > process.env.VALUE_ZERO)
                {
                    const softDeleteQuery = `UPDATE users SET status='0' WHERE id='${id}'`
                    const softDeleteQueryResult = await db.query(softDeleteQuery)
                    
                    res.status(200).json({status: true, message: 'Energy company deleted and new admin assigned successfully'})
                }
                else
                {
                    return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
                }
            })

        }
        else
        {
            return res.status(400).json({status: false, message: 'User does not exist'})
        }
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message:error.message})
    }
}

const energyCompanyDeleteSubUser = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(400).json({status: false, message: error.message});

        const deleteQueryForSubUser = `DELETE  FROM users WHERE id='${id}' AND user_type='${process.env.SUB_USER_ROLE_ID}'`

        db.query(deleteQueryForSubUser, async (err, result) => {
            if(err) return res.status(400).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Sub user deleted successfully"})
            }
            else
            {
                return res.status(400).json({status: false, message: 'Something went wrong, please try again later'})
            }
        })

    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getAllCreatedEnergyCompany = async(req, res) => {

    try 
    {
        const selectQuery = `SELECT id as energy_company_id, admin_id as user_id, name, status FROM energy_companies`
        const queryResult = await promisify(db.query)(selectQuery)

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message:"Fetched successfully", data: queryResult})
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

const getAllActiveEnergyCompany = async (req, res) =>{

    try 
    {
        const activeStatus = process.env.ACTIVE_STATUS
        const selectQuery = `SELECT id as energy_company_id, admin_id as user_id, name, status FROM energy_companies WHERE status='${activeStatus}'`
        db.query(selectQuery, async (err, result) =>{
            if(err) return res.status(400).json({status: false, message: req.error.message})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message:"Fetched successfully", data: result})
            }
            else
            {
                return res.status(400).json({status: false, message: "Data not found"})
            }
        }) 
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

module.exports = {createEnergyCompanyUser, createSubUsersForEnergyCompanyZoneUser, createSubUsersForEnergyCompanyRegionalOfficeUser, createSubUsersForEnergyCompanySaleAreaUser, getEnergyCompanyDetailsById, updateEnergyCompanyDetails, updateEnergyCompanyUserDetails, updateEnergyCompanySubUserDetails, deleteEnergyCompany, deleteEnergyCompanyUser, energyCompanyDeleteSubUser, getAllActiveEnergyCompany, getAllCreatedEnergyCompany}