var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require('http-status-codes');
const { promisify } = require('util');
const {hrTeamValidations, checkPositiveInteger} = require('../helpers/validation');
const {getTeamMemberOnId, getUsersById} = require('../helpers/general');

const createHrTeam = async (req, res) => {

    try 
    {
        const {team_name, team_short_description, manager_id, team_member} = req.body; 
        const {error} = hrTeamValidations.validate({manager_id, team_name})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        
        const createdBy = req.user.user_id
        const teamMember = JSON.stringify({team_member: team_member})
        const insertQuery = `INSERT INTO hr_teams (manager_id, team_name, team_short_description, team_member, created_by) VALUES(?, ?, ?, ?, ?)`;
       
        const queryResult = await db.query(insertQuery, [manager_id, team_name, team_short_description, teamMember, createdBy]);

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Team created successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Something went wrong, please try again later"})
        }
    } 
    catch (error)
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})
    }
}

const getAllHrTeamWithMember = async (req, res) => {

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM hr_teams`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '')
        {
            var selectQuery = `SELECT hr_teams.id as team_id, hr_teams.team_name, hr_teams.team_short_description, hr_teams.team_member, hr_teams.created_by, hr_teams.manager_id, users.name as manager_name,users.image FROM hr_teams INNER JOIN users ON users.id=hr_teams.manager_id  WHERE hr_teams.team_name LIKE '%${searchData}%' ORDER BY team_id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }
        else
        {
            var selectQuery = `SELECT hr_teams.id as team_id, hr_teams.team_name, hr_teams.team_short_description, hr_teams.team_member, hr_teams.created_by, hr_teams.manager_id, users.name as manager_name, users.image FROM hr_teams INNER JOIN users ON users.id=hr_teams.manager_id ORDER BY team_id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }
        const queryResult = await promisify(db.query)(selectQuery);
        
        if(queryResult.length > process.env.VALUE_ZERO)
        {
            const values = []
            for(const element of queryResult)
            {
                const teamMember = await getTeamMemberOnId(element.team_member)
                const getUser = await getUsersById(element.manager_id)
                // var manager_name = '';
                // if(getUser.length > process.env.VALUE_ZERO)
                // {
                //     manager_name = getUser[0].name
                // }

                values.push({
                    team_id: element.team_id,
                    team_name: element.team_name,
                    team_short_description: element.team_short_description,
                    manager_id: element.manager_id,
                    manager_name: element.manager_name,
                    manager_image: element.image,
                    total_members: teamMember.length,
                    members: teamMember,
                })
            }
            var pageDetails = [];
            pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

            res.status(StatusCodes.OK).json({status: true, message: "Fetched data successfully", data: values, pageDetails: pageDetails});
        }
        else
        {
            return request.status(StatusCodes.FORBIDDEN).json({status: false, message: "Data not found"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const getHrTeamDetailsById = async (req, res) =>
{
    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id})
        if(error) res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        
        var selectQuery = `SELECT hr_teams.id as team_id, hr_teams.team_name, hr_teams.team_short_description, hr_teams.team_member, hr_teams.created_by, hr_teams.manager_id, users.name as manager_name,users.image FROM hr_teams INNER JOIN users ON users.id=hr_teams.manager_id  WHERE hr_teams.id = ?`

        const queryResult = await db.query(selectQuery, [id])

        if(queryResult.length > process.env.VALUE_ZERO)
        {
            var values = [];
            for(const row of queryResult)
            {
                const teamMember = await getTeamMemberOnId(row.team_member)
                values.push({
                    team_id: row.team_id,
                    team_name: row.team_name,
                    team_short_description: row.team_short_description,
                    manager_id: row.manager_id,
                    manager_name: row.manager_name,
                    manager_image: row.image,
                    members: teamMember,

                })
            }

            res.status(StatusCodes.OK).json({status: true, message: "Fetched successfully", data: values});
        }
        else
        {
            res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const updateHrTeamDetails = async(req, res) => {

    try 
    {
        const {team_name, team_short_description, manager_id, team_member, team_id} = req.body; 
        const {error} = hrTeamValidations.validate({manager_id, team_name})
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})

        const teamMember = JSON.stringify({team_member: team_member})
        const updatedAt = moment().format();
        const updateQuery = `UPDATE hr_teams SET manager_id=?, team_name=?, team_short_description=?, team_member=?, updated_at=? WHERE id=?`
        const queryResult = await db.query(updateQuery, [manager_id, team_name, team_short_description, teamMember, updatedAt, team_id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message:"Team updated successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Something went wrong, please try again later."});
        }
    }
     catch (error) 
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: false, message: error.message})    
    }
}

const deleteHrTeam = async(req, res)=>{

    try 
    {
        const team_id = req.params.team_id;
        const{error} = checkPositiveInteger.validate({id: team_id}); 
        if(error) return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})
        
        const deleteQuery = `DELETE FROM hr_teams WHERE id=?`
        const queryResult = await db.query(deleteQuery, [team_id])

        if(queryResult.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(StatusCodes.OK).json({status: true, message: "Team deleted successfully"})
        }
        else
        {
            return res.status(StatusCodes.FORBIDDEN).json({status: false, message: "Something went wrong, please try again later"})
        }
    } 
    catch (error) 
    {
        return res.status(StatusCodes.FORBIDDEN).json({status: false, message: error.message})    
    }
}


module.exports = {createHrTeam, getAllHrTeamWithMember, getHrTeamDetailsById, updateHrTeamDetails, deleteHrTeam}