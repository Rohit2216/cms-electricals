// const bcrypt = require('bcrypt');
// var jwt = require('jsonwebtoken');
// require("dotenv").config();
// const { con, makeDb } = require("../db");
// const { adminCreateValidation } = require("../helpers/validation");
// const Joi = require("joi");
// const db = makeDb();


// const contractorLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         //const sql = `SELECT * FROM admins WHERE email='${email}' AND user_type='${process.env.CONTRACTOR_ROLE_ID}'`
//         const adminQuery = await db.query(`SELECT * FROM admins WHERE email='${email}' `);
//         console.log("adminQuery", adminQuery)
//         if (adminQuery.length > 0) {

//             // account is active or not
//             if (adminQuery[0].status !== '1') {
//                 return res.status(400).json({ status: false, message: "Your account is not activated yet. Please contact our support team for assistance." });
//             }
            
//             const isCorrectPassword = await bcrypt.compare(password, adminQuery[0].password)

//             if (isCorrectPassword) {
//                 delete adminQuery[0].password;
//                 const token = jwt.sign({ user_id: adminQuery[0].id, user_type: adminQuery[0].user_type, employee_id: adminQuery[0].employee_id, user_data: adminQuery }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
//                 return res.status(200).json({ status: true, message: "Login Successfully", data: adminQuery[0], token: token })
//             }
//             else {
//                 return res.status(400).json({ status: false, message: "Wrong Credentials" })
//             }
//         }
//         else {
//             const userQuery = await db.query(`SELECT * FROM users WHERE email='${email}'`);
//             console.log("userQuery", userQuery)
//             if (userQuery.length > 0) {
//                 const isCorrectPassword = await bcrypt.compare(password, userQuery[0].password)

//                 if (isCorrectPassword) {
//                     delete userQuery[0].password;

//                     const token = jwt.sign({ user_id: userQuery[0].id, user_type: userQuery[0].user_type, employee_id: userQuery[0].employee_id, user_data: userQuery }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
//                     return res.status(200).json({ status: true, message: "Login Successfully", data: userQuery[0], token: token })
//                 }
//                 else {
//                     return res.status(400).json({ status: false, message: "Wrong Credentials" })
//                 }
//             }
//             else {
//                 return res.status(500).json({ status: false, message: "Email Invalid" })
//             }
//         }
//     }
//     catch (error) {
//         console.error(error)
//         res.status(400).json({
//             status: false,
//             message: error.message
//         })
//     }
// }


// module.exports = { contractorLogin }



const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require("dotenv").config();
const { con, makeDb } = require("../db");
const { adminCreateValidation } = require("../helpers/validation");
const Joi = require("joi");
const { getRecord } = require('../helpers/general');
const db = makeDb();


const contractorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //const sql = `SELECT * FROM admins WHERE email='${email}' AND user_type='${process.env.CONTRACTOR_ROLE_ID}'`
        const adminQuery = await db.query(`SELECT admins.*, plans.name as plan_name, plans.duration as plan_duration, plans.price as plan_price, admins.name, roles.name AS role FROM admins LEFT JOIN plans ON admins.plan_id = plans.id INNER JOIN roles ON roles.id = admins.user_type WHERE admins.email='${email}'`);

        if (adminQuery.length > 0) {

            // account is active or not
            if (adminQuery[0].status !== '1') {
                return res.status(400).json({ status: false, message: "Your account is not activated yet. Please contact our support team for assistance." });
            }
            
            const isCorrectPassword = await bcrypt.compare(password, adminQuery[0].password)

            if (isCorrectPassword) {
                delete adminQuery[0].password;
                const token = jwt.sign({ user_id: adminQuery[0].id, user_type: adminQuery[0].user_type, employee_id: adminQuery[0].employee_id, user_data: adminQuery }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
                return res.status(200).json({ status: true, message: "Login Successfully", data: adminQuery[0], token: token })
            }
            else {
                return res.status(400).json({ status: false, message: "Wrong Credentials" })
            }
        }
        else {
            const userQuery = await db.query(`SELECT * FROM users WHERE email='${email}'`);

            if (userQuery.length > 0) {
                const isCorrectPassword = await bcrypt.compare(password, userQuery[0].password)

                if (isCorrectPassword) {
                    delete userQuery[0].password;

                    const token = jwt.sign({ user_id: userQuery[0].id, user_type: userQuery[0].user_type, employee_id: userQuery[0].employee_id, user_data: userQuery }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
                    return res.status(200).json({ status: true, message: "Login Successfully", data: userQuery[0], token: token })
                }
                else {
                    return res.status(400).json({ status: false, message: "Wrong Credentials" })
                }
            }
            else {
                return res.status(500).json({ status: false, message: "Email Invalid" })
            }
        }
    }
    catch (error) {
        console.error(error)
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

const renewPlan = async (req, res) => {
    try{
      const contractorId = req.user.user_id;
      const { plan_id } = req.body;
      /** renew the current contractor plan  */
      const [planRecord] = await getRecord("plans", 'id' , plan_id)
       if(!planRecord){
        return res.status(404).json({
            status: false,
            message: "Plan not found"
        });
       }
    const daysObject = {
       "week" : 7,
       "month" :30,
       "year" : 365
    }
     const numberOfDays = daysObject[planRecord?.duration] || 0;
     const [userDetails] = await getRecord("admins", "id", contractorId)
       if(!userDetails){
        return res.status(404).json({
            status: false,
            message: "User not found"
        });
       }
       /** Renew Check can't update plan  */
       if(userDetails.plan_id != plan_id){
        return res.status(400).json({
            status: false,
            message: "You can only renew your plan"
        });
       }
       const planRenewQuery = `UPDATE admins SET plan_expire_date = DATE_ADD(plan_expire_date, INTERVAL ? DAY) WHERE id = ?`
       await db.query(planRenewQuery, [
        numberOfDays,
        contractorId
       ])
       return res.status(200).json({
            status: true,
            message: "Plan renewed successfully"
       });
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

module.exports = { contractorLogin, renewPlan }