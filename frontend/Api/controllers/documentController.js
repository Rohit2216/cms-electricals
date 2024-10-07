var moment = require('moment');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger, addDocumentValidations} = require('../helpers/validation');
const {getUploadedFileExtension} = require('../helpers/general')


const createDocumentCategory = async (req, res) => {

    try 
    {
        const{category, title, description} = req.body
        const createdBy = req.user.user_id
        const insertDocumentCategory = `INSERT INTO document_categories(category, title, description, created_by) VALUES('${category}', '${title}', '${description}', '${createdBy}')`
        
        db.query(insertDocumentCategory, async (err, result) => {
            if(err) return res.status(403).json({status: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Document Category created successfully'})
            }
            else
            {
                res.status(403).json({status: false, message: 'Something went wrong, please try again'})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}


const getAllDocumentCategory = async (req, res) => {

    try 
    {
        const selectQuery = `SELECT * FROM document_categories ORDER BY id DESC`
        
        db.query(selectQuery, async (err, result) => {
            if(err) return res.status(403).json({status: false, message: err.message})
            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Fetched successfully", data: result})
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

const getDocumentCategoryById = async (req, res) => {
    
    try 
    {
        const id = req.params.id
        const{error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(403).json({status: false, message: error.message})
        
        const selectQuery = `SELECT * FROM document_categories WHERE id = '${id}'`
        db.query(selectQuery, async (err, result) => {
            if(err) return res.status(403).json({status: false, message: err.message})

            if(result.length > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Fetched successfully", data: result[0]})
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

const updateDocumentCategory = async (req, res) => {

    try 
    {
        const id = req.body.id
        const{error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(403).json({status: false, message: error.message})
        
        const {category, title, description} = req.body
        const updatedAT = moment().format();
        const updateDocumentCategory = `UPDATE document_categories SET category = '${category}', title = '${title}', description = '${description}', updated_at = '${updatedAT}' WHERE id = '${id}'`
        
        db.query(updateDocumentCategory, async (err, result) => {
            if(err) return res.status(403).json({status: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Document Category updated successfully'})
            }
            else
            {
                return res.status(403).json({status: false, message: 'Something went wrong, please try again'})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}


const removeDocumentCategoryById = async (req, res) => {

    try 
    {
        const id = req.params.id
        const{error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(403).json({status: false, message: error.message})
        
        const deleteDocumentCategory = `DELETE FROM document_categories WHERE id = '${id}'`
        
        db.query(deleteDocumentCategory, async (err, result) => {
            if(err) return res.status(403).json({status: false, message: err.message})

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: 'Document Category deleted successfully'})
            }
            else
            {
                return res.status(403).json({status: false, message: 'Something went wrong, please try again'})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}


const addDocuments = async (req, res) => {

    try 
    {
        const {category_id, user_type, user_id, remarks} = req.body
        const {error} = addDocumentValidations.validate(req.body)
        if(error) return res.status(500).json({status: false, message: error.message})
        
        const createdBy = req.user.user_id
        var storePath = '';
        var jsonArr = [];
        
        if(req.files != null)
        {
            for(i = 0; i < req.files.images.length; i++)
            {
                const image = req.files.images[i];
                const imageName = Date.now()+image.name;
                const uploadPath =  process.cwd() +'/public/documents/' + imageName;
                storePath = '/documents/' + imageName;
                image.mv(uploadPath, (err, response) => {
                    if (err) return res.status(400).json({status: false, message: err.message});
                })
                jsonArr.push({storePath: storePath})
            }
        }
        const obj = JSON.stringify(jsonArr);

        const insertDocuments = `INSERT INTO documents(document_category_id, user_type, user_id, image, remark, created_by) VALUES('${category_id}', '${user_type}', '${user_id}', '${obj}', '${remarks}', '${createdBy}')`
       db.query(insertDocuments, async(err, results) => {
        if(err) return res.status(403).json({status: false, message: err.message})

        if(results.affectedRows > process.env.VALUE_ZERO)
        {
            res.status(200).json({status:true, message: "Document added successfully"})
        }
        else
        {
            return res.status(403).json({status: false, message: 'Something went wrong, please try again'})
        }
       })
           
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const getAllDocuments = async (req, res) => {

    try 
    {
        const pageSize = req.query.pageSize || 10;
        const currentPage = req.query.pageNo || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;
        const countSelectQuery = `SELECT COUNT(*) as total FROM documents`
        constTotalLength = await db.query(countSelectQuery);
        totalPages = Math.round((constTotalLength[0].total/pageSize));
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        if(searchData != null && searchData != '') 
        {
            var selectQuery = `SELECT documents.id as document_id, documents.image, documents.remark, documents.created_at, document_categories.category, document_categories.title FROM documents INNER JOIN document_categories ON document_categories.id=documents.document_category_id WHERE document_categories.title LIKE '%${searchData}%'  ORDER BY documents.id DESC limit ${pageFirstResult} , ${pageSize}`; 
        }
        else
        {
            var selectQuery = `SELECT documents.id as document_id, documents.image, documents.remark, documents.created_at, document_categories.category, document_categories.title FROM documents INNER JOIN document_categories ON document_categories.id=documents.document_category_id  ORDER BY documents.id DESC limit ${pageFirstResult} , ${pageSize}`; 
        }
        db.query(selectQuery, async(err, results) => {
            if (err) return res.status(403).json({status: false, message: err.message})

            if(results.length > process.env.VALUE_ZERO)
            {
                const final = results.map(async (element) => {
                    return {
                        document_id: element.document_id,
                        created_at: element.created_at,
                        category: element.category,
                        title: element.title,
                        remark: element.remark,
                        fileExtension: await getUploadedFileExtension(element.image)
                    }
                });

                var pageDetails = [];
                pageDetails.push({pageSize, currentPage, currentPage, totalPages, total})

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message: "Fetched successfully", data: values, pageDetails: pageDetails});
                })
            }
            else
            {
                return res.status(403).json({status: false, message:"Data not found"});
            }
        })
    } catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const viewDocuments = async (req, res) => {

    try 
    {
        const id = req.params.id
        const{error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(403).json({status: false, message: error.message})
        
        const selectQuery = `SELECT id, image FROM documents WHERE id = '${id}'`
        db.query(selectQuery, async (err, result) => {
            if(err) return res.status(403).json({status: false, message: err.message})

            if(result.length > process.env.VALUE_ZERO) 
            {
                res.status(200).json({status: true, message: "Fetched successfully", data: result[0]})
            }
            else
            {
                return res.status(403).json({status: false, message:"Data not found"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message});    
    }
}

const getDocumentOnCategoryById = async (req, res) => {

    try 
    {
        const id = req.params.id
        const{error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(403).json({status: false, message: error.message})

        const selectQuery = `SELECT documents.id as document_id, documents.image, documents.remark, documents.created_at, document_categories.category, document_categories.title FROM documents INNER JOIN document_categories ON document_categories.id=documents.document_category_id WHERE documents.document_category_id='${id}' ORDER BY documents.id DESC`; 
        
        db.query(selectQuery, async(err, results) => {
            if (err) return res.status(403).json({status: false, message: err.message})

            if(results.length > process.env.VALUE_ZERO)
            {
                const final = results.map(async (element) => {
                    return {
                        document_id: element.document_id,
                        created_at: element.created_at,
                        category: element.category,
                        title: element.title,
                        remark: element.remark,
                        fileExtension: await getUploadedFileExtension(element.image)
                    }
                });

                Promise.all(final).then((values) => {
                    res.status(200).json({status: true, message: "Fetched successfully", data: values});
                })
            }
            else
            {
                return res.status(403).json({status: false, message:"Data not found"});
            }
        })    
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

const removeDocumentById = async (req, res) => {

    try 
    {
        const id = req.params.id
        const{error} = checkPositiveInteger.validate({id: id})
        if(error) return res.status(500).json({status: false, message: error.message});   
        
        const deleteQuery = `DELETE FROM documents WHERE id='${id}'`

        db.query(deleteQuery, async (err, result) => {
            if(err) return res.status(500).json({status: false, message: err.message});

            if(result.affectedRows > process.env.VALUE_ZERO)
            {
                res.status(200).json({status: true, message: "Document deleted successfully"})
            }
            else
            {
                return res.status(404).json({status: true, message:"Something went wrong, please try again later"})
            }
        })
    } 
    catch (error) 
    {
        return res.status(500).json({status: false, message: error.message})    
    }
}

module.exports = {createDocumentCategory, getAllDocumentCategory, getDocumentCategoryById, updateDocumentCategory, removeDocumentCategoryById, addDocuments, getAllDocuments, viewDocuments, getDocumentOnCategoryById, removeDocumentById}