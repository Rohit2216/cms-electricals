var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, surveyValidations} = require('../helpers/validation');
const {getSurveyQuestions, getCreatedUserNameFromAdmin, getAssignFromAdmin, getAssignToSubUser} = require('../helpers/general')

const createSurvey = async (req, res) => {

    try 
    {
        const {title, description, format, questions} = req.body
        const{error} = surveyValidations.validate({title: title, description: description, format: format})
        if(error) return res.status(403).json({status: false, message: error.message})

        const createdBy = req.user.user_id
        const insertQuery = `INSERT INTO survey(title, description, format, created_by) VALUES('${title}', '${description}', '${format}', '${createdBy}')`

        db.query(insertQuery, async (error, result) =>{
            if(error) return res.status(500).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const surveyId =  result.insertId
                for(let i = 0; i < questions.length; i++)
                {
                    const questionFormat = JSON.stringify(questions[i])
                    const insertQuestionQuery = `INSERT INTO survey_questions(survey_id, question, created_by) VALUES('${surveyId}', '${questionFormat}', '${createdBy}')`
                    const insertQuestionResult = await db.query(insertQuestionQuery)
                }
                res.status(200).json({status: true, message: "Survey created successfully"})
            }
            else
            {
                return res.status(403).json({status: false, message: "Something went wrong, please try again later"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getAllSurvey = async (req, res) => {

    try 
    {   
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM survey_questions`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '')
        {
            var selectAllSurveyQuery = `SELECT survey_questions.survey_id, survey.title, survey.description, survey.status, survey.assign_to, survey.assign_to_sub_user, survey_questions.question, survey_questions.created_by, survey_questions.survey_response, survey_questions.created_at FROM survey_questions INNER JOIN survey ON survey.id=survey_questions.survey_id WHERE survey.title LIKE '%${searchData}%' ORDER BY survey_questions.survey_id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }
        else
        {
            var selectAllSurveyQuery = `SELECT survey_questions.survey_id, survey.title, survey.description, survey.status, survey.assign_to, survey.assign_to_sub_user, survey_questions.question, survey_questions.created_by, survey_questions.survey_response, survey_questions.created_at FROM survey_questions INNER JOIN survey ON survey.id=survey_questions.survey_id ORDER BY survey_questions.survey_id DESC LIMIT ${pageFirstResult} , ${pageSize}`
        }
        

        db.query(selectAllSurveyQuery, async (error, result) =>{
            if(error) return res.status(500).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

                res.status(200).json({status: true, message:"Fetched successfully", data: result, pageDetails: pageDetails})
            }
            else
            {
                return res.status(403).json({status: false, message: "Data not found"})
            }
        
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getSurveyById = async (req, res) => {

    try 
    {
        const id = req.params.id;
        const {error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(403).json({status: false, message: error.message}) 
        
        const selectSurveyByIdQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.created_by, survey.status,survey.assign_to, survey.assign_to_sub_user FROM survey WHERE id='${id}'`

        db.query(selectSurveyByIdQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO) 
            {
                const final = result.map(async (element) => {
                    return {...element,
                        created_by_name: await getCreatedUserNameFromAdmin(element.created_by),
                        survey_questions: await getSurveyQuestions(element.survey_id)

                    }
                })

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message:"Fetched successfully", data: values[0]})
                })
            }
            else
            {
                return res.status(403).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message:error.message})    
    }
}

const editSurveyDetails = async (req, res) => {

    try 
    {
        const id = req.params.id 
        const {error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(403).json({status: false, message: error.message})
        
        const selectSurveyByIdQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.created_by,survey.status FROM survey WHERE id='${id}'`

        db.query(selectSurveyByIdQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO) 
            {
                const final = result.map(async (element) => {
                    return {...element,
                        survey_questions: await getSurveyQuestions(element.survey_id)

                    }
                })

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message:"Fetched successfully", data: values[0]})
                })
            }
            else
            {
                return res.status(403).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message:error.message})    
    }
}


const updateSurveyDetails = async (req, res) => {

    try 
    {
        const {title, description, format, questions, id} = req.body 
        const{error} = surveyValidations.validate({title: title, description: description, format: format})
        if(error) return res.status(403).json({status: false, message: error.message})

        const{error: idErrorCheck} = checkPositiveInteger.validate({id: id})
        if(idErrorCheck) return res.status(403).json({status: false, message: idErrorCheck.message})

        const updatedAt = moment().format();
        const updateQuery = `UPDATE survey SET title='${title}', description='${description}', updated_at='${updatedAt}' WHERE id='${id}'`;

        db.query(updateQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                const getQuestionsId = `SELECT id FROM survey_questions where survey_id='${id}'`
                const questionIds = await db.query(getQuestionsId)
                const ids = [];
                for(let j = 0; j < questionIds.length; j++)
                {
                   ids.push(questionIds[j]);
                }

                for(let i = 0; i < questions.length; i++)
                {
                    const resultFormatIds = JSON.stringify(ids[i])
                    const jsonParsedIds = JSON.parse(resultFormatIds).id

                    const questionFormat = JSON.stringify(questions[i])
                    const insertQuestionQuery = `UPDATE survey_questions SET question='${questionFormat}', updated_at='${updatedAt}' WHERE id='${jsonParsedIds}'`
                    const insertQuestionResult = await db.query(insertQuestionQuery)
                }

                res.status(200).json({status: true, message: "Survey details updated successfully"})
            }
            else
            {
                return res.status(403).json({status: false, message: "Something went wrong, please try again later"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})     
    }
}

const deleteSurvey = async (req, res) => {

    try 
    {
        const id = req.params.id
        const {error} = checkPositiveInteger.validate({id: id});
        if(error) return res.status(403).json({status: false, message: error.message})
        
        const deleteQuery = `UPDATE survey SET status='0' WHERE id='${id}'`
        
        db.query(deleteQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err})
            
            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Survey deleted successfully"})
            }
            else
            {
                return res.status(500).json({status: false, message: "Something went wrong, please try again later"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message:error.message})     
    }
}


const getAssignedSurvey = async (req, res) => {

    try 
    {
        const selectAllSurveyQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.status, survey.assign_to, survey.assign_to_sub_user, survey.created_by FROM survey WHERE survey.assign_to IS NOT NULL AND survey.assign_to_sub_user IS NOT NULL`

        db.query(selectAllSurveyQuery, async (error, result) =>{
            if(error) return res.status(500).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                const final = result.map(async (element) => {
                    return {...element,
                        created_by: await getCreatedUserNameFromAdmin(element.created_by),
                        assign: await getAssignFromAdmin(element.assign_to),
                        assign_to_sub_user: await getAssignToSubUser(element.assign_to_sub_user),
                        survey_questions: await getSurveyQuestions(element.survey_id)
                    }
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message:"Fetched successfully", data: values})
                })
            }
            else
            {
                return res.status(403).json({status: false, message: "Data not found"})
            }
        
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})     
    }
}


const getRequestedSurvey = async (req, res) => {
    
    try 
    {
        const superAdminRoleId = process.env.SUPER_ADMIN_ROLE_ID
        const selectAllSurveyQuery = `SELECT survey.id as survey_id, survey.title, survey.description, survey.status, survey.assign_to, survey.assign_to_sub_user, survey.created_by FROM survey WHERE survey.created_by!='${superAdminRoleId}'`
        db.query(selectAllSurveyQuery, async (error, result) =>{
            if(error) return res.status(500).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                const final = result.map(async (element) => {
                    return {...element,
                        created_by: await getCreatedUserNameFromAdmin(element.created_by)                    }
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message:"Fetched successfully", data: values})
                })
            }
            else
            {
                return res.status(500).json({status: false, message:"Data not found"})
            }

        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getSurveyQuestionResponse = async (req, res) => {

    try 
    {
        const selectAllSurveyQuery = `SELECT survey_questions.survey_id, survey.title, survey.description, survey.status, survey.assign_to, survey.assign_to_sub_user, survey_questions.question, survey_questions.created_by, survey_questions.survey_response, survey_questions.created_at FROM survey_questions INNER JOIN survey ON survey.id=survey_questions.survey_id WHERE survey_questions.survey_response IS NOT NULL`

        db.query(selectAllSurveyQuery, async(err, result) => {
            if(err) return res.status(500).json({status: false, message: err})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status:true, message: "Fetched successfully", data: result})
            }
            else
            {
                return res.status(403).json({status: false, message: "Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}


module.exports = {createSurvey, getAllSurvey, getSurveyById, editSurveyDetails, updateSurveyDetails, deleteSurvey, getAssignedSurvey, getRequestedSurvey, getSurveyQuestionResponse}



