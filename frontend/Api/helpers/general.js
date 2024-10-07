const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger} = require('./validation');
const { StatusCodes } = require('http-status-codes');

async function getTeamMemberList(parent_id)
{
    const sql = `SELECT teams.user_id, teams.id, users.name FROM teams LEFT JOIN users on teams.user_id = users.id WHERE teams.parent_id='${parent_id}'`;    
    return await db.query(sql);
}

async function getTeamMemberOnId(memberIds)
{
    const teamMembersId = JSON.parse(memberIds)
    sql = `SELECT id, name, image, mobile, email FROM users WHERE id IN(${teamMembersId.team_member})`
    return await db.query(sql)
}

async function getSubModule(module_id)
{
    const sql = `SELECT * FROM sub_modules WHERE module_id='${module_id}'`;
    return await db.query(sql);
}

async function getZoneNameById(zone_id) 
{   const zoneId = JSON.parse(zone_id)
    var sql = '';
    if(typeof zoneId == 'object')
    {
        const commaSeparated = zoneId.join(",");
        sql = `SELECT zone_id, zone_name FROM zones WHERE zone_id IN(${commaSeparated})`
    }
    else
    {
        sql = `SELECT zone_name FROM zones WHERE zone_id='${zone_id}'`;
    }
    
    return await db.query(sql);
}

async function getZoneUsers(zone_id) {
    const sql = `SELECT users.id as users_id, users.name as user_name,users.zone_id, zones.zone_name as zone_name, users.regional_id, users.sale_area_id, roles.name as user_type FROM zones LEFT JOIN users ON users.zone_id=zones.zone_id INNER JOIN roles ON roles.id=users.user_type WHERE users.zone_id='${zone_id}' AND users.user_id IS NULL`
    return await db.query(sql);
}

async function getZoneSubUsers(zone_id, user_id)
{
    const sql = `SELECT users.id as users_id, users.name as user_name,users.zone_id, users.image, users.joining_date, zones.zone_name as zone_name, roles.name as user_type FROM zones LEFT JOIN users ON users.zone_id=zones.zone_id INNER JOIN roles ON roles.id=users.user_type WHERE users.zone_id='${zone_id}' AND users.user_id='${user_id}'`

    return await db.query(sql);
}

async function getReginalOfficeUsers(regional_id)
{
    const sql = `SELECT users.id as user_id, users.name as user_name, users.zone_id, users.regional_id, regional_offices.regional_office_name, users.sale_area_id, roles.name as user_type FROM regional_offices LEFT JOIN users ON users.regional_id=regional_offices.id INNER JOIN roles ON roles.id=users.user_type WHERE users.regional_id='${regional_id}'  AND users.user_id IS NULL`
    return await db.query(sql);
}

async function getRegionalOfficeSubUsers(regional_id, user_id) {
    const sql = `SELECT users.id as user_id, users.name as user_name, users.zone_id, users.regional_id, regional_offices.regional_office_name, users.sale_area_id, roles.name as user_type FROM regional_offices LEFT JOIN users ON users.regional_id=regional_offices.id INNER JOIN roles ON roles.id=users.user_type WHERE users.regional_id='${regional_id}' AND users.user_id='${user_id}'`
    return await db.query(sql);
}


async function getSaleAreaUsers(sale_area_id)
{
    const sql = `SELECT users.id as user_id, users.name as user_name, users.zone_id, users.regional_id, sales_area.sales_area_name, roles.name as user_type FROM sales_area LEFT JOIN users ON users.sale_area_id=sales_area.id INNER JOIN roles ON roles.id=users.sale_area_id WHERE sales_area.id='${sale_area_id}'`
    return await db.query(sql);
}

async function getSaleAreaSubUsers(sale_area_id, user_id) {

    const sql = `SELECT users.id as user_id, users.name as user_name, users.zone_id, users.regional_id, users.sale_area_id, users.image, users.joining_date, sales_area.sales_area_name, roles.name as user_type FROM sales_area LEFT JOIN users ON users.sale_area_id=sales_area.id INNER JOIN roles ON roles.id=users.user_type WHERE users.sale_area_id='${sale_area_id}'AND users.user_id='${user_id}' `
    return await db.query(sql);
} 

async function getRegionalNameById(regional_id)
{
    const regionalId = JSON.parse(regional_id)
    var sql = '';
    if(typeof regionalId == 'object')
    {
        const commaSeparated = regionalId.join(",");
        sql = `SELECT id as ro_id, regional_office_name FROM regional_offices WHERE id IN(${commaSeparated})`
    }
    else
    {
        sql = `SELECT regional_office_name FROM regional_offices WHERE id='${regional_id}'`;
    }
    
    return await db.query(sql);
}

async function getSaleAreaNameById(sale_area_id)
{
    const saleAreaId = JSON.parse(sale_area_id)
    var sql = '';
    if(typeof saleAreaId == 'object')
    {
        const commaSeparated = saleAreaId.join(",");
        sql = `SELECT id as sale_area_id_id, sales_area_name FROM sales_area WHERE id IN(${commaSeparated})`
    }
    else
    {
        sql = `SELECT id as sale_area_id_id, sales_area_name FROM sales_area WHERE id='${sale_area_id}'`;
    }
    
    return await db.query(sql);
}

async function  getDistrictById(district_id)
{
    const districtId = JSON.parse(district_id)
    var sql = '';
    if(typeof districtId == 'object')
    {
        const commaSeparated = districtId.join(",");
        sql = `SELECT id as district_id, district_name FROM districts WHERE id IN(${commaSeparated})`
    }
    else
    {
        sql = `SELECT id as district_id, district_name FROM districts WHERE id='${sale_area_id}'`;
    }
    
    return await db.query(sql);
}

async function  getOutletById(outlet_id)
{
    const outletId = JSON.parse(outlet_id)
    var sql = '';
    if(typeof outletId == 'object')
    {
        const commaSeparated = outletId.join(",");
        sql = `SELECT id as outlet_id, outlet_name FROM outlets WHERE id IN(${commaSeparated})`
    }
    else
    {
        sql = `SELECT id as outlet_id, outlet_name FROM outlets WHERE id='${sale_area_id}'`;
    }
    
    return await db.query(sql);
}

async function getUsersById(admin_id)
{
    const sql = `SELECT * FROM users WHERE admin_id='${admin_id}'`;
    return await db.query(sql);
}

async function getContractorUsersById(admin_id)
{
    const sql = `SELECT users.id as admin_id, users.name, users.email, users.status, users.image, users.mobile as contact_no, roles.name as user_type FROM users INNER JOIN roles ON roles.id=users.user_type WHERE admin_id='${admin_id}' AND users.is_deleted='0'`;
    return await db.query(sql);
}

async function getDealerAllUserById(admin_id)
{
    const sql = `SELECT users.id as admin_id, users.name, users.email, users.status, users.image, roles.name as user_type, users.mobile as contact_no FROM users INNER JOIN roles ON roles.id=users.user_type WHERE admin_id='${admin_id}' AND users.is_deleted='0'`;
    return await db.query(sql);
}

async function getPlanModuleById(module_id)
{   
    const module_idStr = JSON.parse(module_id).toString();
    const sql = `SELECT title as module_name FROM modules WHERE id in(${module_idStr})`
    return await db.query(sql);
}

async function getPlanCheckLists(planId)
{
    const sql = `SELECT * FROM plan_checklists WHERE plan_id='${planId}'`;
    return await db.query(sql);
}

async function getSurveyQuestions(surveyId)
{
    const sql = `SELECT id as question_id, survey_id, question, assign_to, assign_to_sub_user, survey_response FROM survey_questions WHERE survey_id='${surveyId}'`;
    return await db.query(sql);
}

async function getCreatedUserNameFromAdmin(createdById)
{
    const{error} = checkPositiveInteger.validate({id: createdById})
    if(error) return res.status(403).json({status: false, message: error.message})
    const selectAdminUserName = `SELECT name FROM admins WHERE id = '${createdById}'`
    return await db.query(selectAdminUserName);
}

async function getAssignFromAdmin(assignTo)
{
    const{error} = checkPositiveInteger.validate({id: assignTo})
    if(error) return res.status(403).json({status: false, message: error.message})
    const selectAdminUserName = `SELECT name FROM admins WHERE id = '${assignTo}'`
    return await db.query(selectAdminUserName);
}

async function getAssignToSubUser(assignToSubUser)
{
    const{error} = checkPositiveInteger.validate({id: assignToSubUser})
    if(error) return res.status(403).json({status: false, message: error.message})
    const selectUserName = `SELECT name FROM users WHERE id = '${assignToSubUser}'`
    return await db.query(selectUserName);
}

async function getUploadedFileExtension(file)
{
    const files = JSON.parse(file);
    
    if(files != null && files != '')
    {
        for (let i = 0; i < files.length; i++) 
        {
            const fileName = files[i].storePath;
            const replaceFolderFromFileName = fileName.replace('/documents/','')
            const extension = replaceFolderFromFileName.split('.').pop();
            return extension;
        }
    }
    else
    {
        return null;
    }
}

async function getGstDetailsByCompanyId(companyId)
{
    const{error} = checkPositiveInteger.validate({id: companyId})
    if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

    const sql = `SELECT id, company_id, gst_number, shipping_address, billing_address, is_default FROM company_gst_details WHERE company_id = ? `
    return await db.query(sql, [companyId])
}

async function getCompanyTypeById(typeId)
{
    const{error} = checkPositiveInteger.validate({id: typeId})
    if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

    const sql = `SELECT company_type_name FROM company_types WHERE company_type_id = ? `
    return await db.query(sql, [typeId])
}

async function roleById(roleId)
{
    const {error} = checkPositiveInteger.validate({id: roleId})
    if(error) return res.status(403).json({status: false, message: error.message})

    const sql = `SELECT * FROM roles WHERE id=?`
    const result = await db.query(sql, [roleId])
    return result[0]
}

module.exports = {getTeamMemberList, getTeamMemberOnId, getSubModule, getZoneNameById, getRegionalNameById, getSaleAreaNameById, getUsersById, getZoneUsers, getReginalOfficeUsers, getSaleAreaUsers, getZoneSubUsers, getRegionalOfficeSubUsers, getSaleAreaSubUsers, getContractorUsersById, getDealerAllUserById, getPlanModuleById, getPlanCheckLists, getSurveyQuestions, getCreatedUserNameFromAdmin, getAssignFromAdmin, getAssignToSubUser, getUploadedFileExtension, getGstDetailsByCompanyId, getCompanyTypeById, getDistrictById, getOutletById, roleById}