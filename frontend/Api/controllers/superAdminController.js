const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require("dotenv").config();
const { con, makeDb } = require("../db");
const { adminCreateValidation } = require("../helpers/validation");


const db = makeDb();

const superAdminLogin = async(req, res) => {
   try 
   {
        const {email, password} = req.body;      

        const sql = `SELECT * FROM admins WHERE email='${email}' AND user_type='${process.env.SUPER_ADMIN_ROLE_ID}'`
        db.query(sql, async(error, result) => {
            if(error)
            {
               return  res.status(500).json({status: false, message: error})
            }

            if(result.length > process.env.VALUE_ZERO)
            {
                const isCorrectPassword = await bcrypt.compare(password, result[0].password)
                if(isCorrectPassword)
                {
                    delete result[0].password;
                    const token = jwt.sign({user_id: result[0].id, user_type: result[0].user_type}, process.env.JWT_SECRET_KEY, {expiresIn: '30d'});
                    return res.status(200).json({status: true, message: "Login Successfully", data: result[0], token: token})
                }
                else
                {
                    return res.status(400).json({status: false, message: "Wrong Credentials"})
                }
            }
            else
            {
                return res.status(500).json({status:false, message: "Email Invalid"})
            }
        });
   } 
   catch (error) 
   {
        res.status(400).json({
            status: false,
            message: error.message
        }) 
   }
}


const getProfileDetails = async(req, res) => {

    try 
    {
        const loggedUserId = req.user.user_id;
        const sql = `SELECT admins.*, admins.name, roles.name AS role FROM admins INNER JOIN roles ON roles.id = admins.user_type WHERE admins.user_type='${loggedUserId}'`
        db.query(sql, async (error, result) => {
            if(error) return res.status(403).json({status: false, message: error});

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'success', data: result[0]});
            }
            else
            {
                res.status(400).json({
                    status:false,
                    message: 'Details not found.'
                })
            }
        })
    } 
    catch (error) 
    {
        res.status(400).json({
            status: false,
            message: error.message
        })    
    }
}

const updateProfile = async (req, res) => {

    try 
    {
        const {name, email, contact_no} = req.body
        const updatedTime =new Date().toISOString().slice(0, 19).replace('T', ' ');
        const loggedUserId = req.user.user_id;
        const user_type = process.env.SUPER_ADMIN_ROLE_ID
       
        if(req.files != null)
        {
            const image = req.files.image
            const imageName = Date.now()+image.name
            const uploadPath =  process.cwd() +'/public/super_admin_images/' + imageName;
            const storePath = '/super_admin_images/' + imageName;

            image.mv(uploadPath, (error, response) => {
                if(error) return res.status(403).json({status:false, message: error.message});

            })
            var updateSql = `UPDATE admins SET name='${name}', email='${email}', contact_no='${contact_no}', image='${storePath}', updated_at='${updatedTime}' WHERE id='${loggedUserId}'`
        }
        else
        {
            var updateSql = `UPDATE admins SET name='${name}', email='${email}', contact_no='${contact_no}', updated_at='${updatedTime}' WHERE id='${loggedUserId}'`
        }

        db.query(updateSql, (err, result) => {
            if(err) return res.status(500).json({status: false, message: err});

            if(result.affectedRows > process.env.VALUE_ZERO) 
            return res.status(200).json({status: true, message:"Data Updated Successfully"});
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            status: false,
            message: error.message
        })     
    }
}

const changePassword = async(req, res) => {

    try 
    {   
        const{old_password, new_password, confirm_password} = req.body
        const loggedUserId = req.user.user_id;
        const getLoggedUserPassword = `SELECT password FROM admins WHERE id='${loggedUserId}'`
        db.query(getLoggedUserPassword, async(err, result) => {
            if(err) return res.status(403).json({status: false, message: err})
            
            if(result.length > process.env.VALUE_ZERO)
            {
                const isCorrectPassword = await bcrypt.compare(old_password, result[0].password)
                if(isCorrectPassword)
                {
                    if(new_password == confirm_password)
                    {
                        const salt = bcrypt.genSaltSync(10);
                        const hashPassword = await bcrypt.hash(new_password, salt);
                        const updateQuery = `UPDATE admins SET password='${hashPassword}' WHERE id='${loggedUserId}'`
                      //  res.status(200).send(updateQuery);
                        db.query(updateQuery, async(err, result) => {
                            if(err) return res.status(403).json({status: false, message: err});

                            if(result.affectedRows > process.env.VALUE_ZERO)
                            {
                                res.status(200).json({status: true, message: "Password changed successfully"})
                            }
                            else
                            {
                                res.status(200).json({status: false, message: "There is some error to change password, please try after sometime."})
                            }
                        })
                    }
                    else
                    {
                        return res.status(403).json({status: false, message: "Confirm password is not equal to new password."})
                    }
                }
                else
                {
                    return res.status(400).json({status: false, message: "Old password wrong"})
                }
            }
            else
            {
                return res.status(400).json({status: false, message: "Something went wrong, please try after sometime"})
            }
        })
    } 
    catch (error)
    {
        return res.status(400).json({
            status: false,
            message: error.message
        })    
    }
}


const createEnergyCompany = async(req, res) => {

    try 
    {
        const {username, email, password, contact_no, alt_number, company_name, website_url, address_1, gst_number, zone_id, ro_id, sale_area_id, status, country, city, pin_code, description} = req.body

        const {error} = adminCreateValidation.validate({email: req.body.email, password: req.body.password, contact_no: req.body.contact_no})
        if(error) return res.status(400).json({status: false, message: error.message})

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const createdBy = req.user.user_id;
        const user_type = process.env.ENERGY_COMPANY_ROLE_ID;

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

        const userInsertQuery = `INSERT INTO admins (name, email, password, contact_no, alt_number, user_type, address_1, status, country, city, pin_code, image, description, gst_number, created_by) VALUES ('${username}', '${email}', '${hashPassword}', '${contact_no}', '${alt_number}', '${user_type}', '${address_1}', '${status}', '${country}', '${city}', '${pin_code}',  '${storePath}', '${description}', '${gst_number}', '${createdBy}')`
       
        db.query(userInsertQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const energy_company_id = result.insertId;
                //energy company create
                const insertEnergyCompanyQuery = `INSERT INTO energy_companies (admin_id, name, website) VALUES('${energy_company_id}', '${company_name}', '${website_url}')`
                const insertEnergyCompanyResult = await db.query(insertEnergyCompanyQuery)
                //assign zone to that energy company
                const insertZoneQuery = `INSERT INTO zone_assigns (zone_id, energy_company_id) VALUES('${zone_id}', '${energy_company_id}')`
                const insertZoneResult = await db.query(insertZoneQuery)
                //assign regional office to that energy company
                const insertRegionalQuery = `INSERT INTO regional_office_assigns (zone_id, regional_office_id, energy_company_id) VALUES('${zone_id}', '${ro_id}', '${energy_company_id}')`
                const insertRegionalResult = await db.query(insertRegionalQuery)
                //assign sales area to that energy company
                const insertSalesAreaQuery = `INSERT INTO sale_area_assigns (zone_id, regional_office_id, sale_area_id, energy_company_id) VALUES('${zone_id}', '${ro_id}', '${sale_area_id}', '${energy_company_id}')`
                const insertSalesAreaResult = await db.query(insertSalesAreaQuery)

                res.status(200).json({status: true, message: "Energy company created Successfully"})
            }
            else
            {
                res.status(200).json({status: false, message: "There is some error to insert data, please try after sometime."})
            }
        })    
    } 
    catch (error) 
    {
        return res.status(400).json({status: false, message: error.message})    
    }
}

const getAllSubUserForSuperAdmin = async (req, res) => {

    try 
    {
        const loggedUserId = req.user.user_id;
        const selectQuery = `SELECT * FROM users WHERE created_by = '${loggedUserId}'`
        
        db.query(selectQuery, (err, result) => {
            
            if(err) return res.status(500).json({status: false, message: err});

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Success', data: result})
            }
            else
            {
                return res.status(200).json({status: false, message: 'No Data Found'})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

module.exports = {superAdminLogin, getProfileDetails, updateProfile, changePassword, createEnergyCompany, getAllSubUserForSuperAdmin}