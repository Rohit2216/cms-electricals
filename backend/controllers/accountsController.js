require('dotenv').config();
var moment = require('moment');
const Joi = require('joi');
const { con, makeDb } = require('../db');
const db = makeDb();
const { StatusCodes, OK } = require('http-status-codes');
const { accountDetailsValidation, checkPositiveInteger, addWalletAmountValidation, updateAccountDetailsValidation } = require('../helpers/validation');
const { calculatePagination, accountsTransaction, getAllBanksForUser, checkAccountNumber, filterTransactionsByDate, toGetManagerToSupervisor, calculateUserActiveLoan, getComplaintUniqueId } = require('../helpers/general');
const { query } = require('express');


/**function to add account */
const addAccountDetails = async (req, res) => {
    try {
        const { banks } = req.body;

        const { error } = accountDetailsValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message
            });
        }
        const userId = req.user.user_id;

        for (const bank of banks) {
            const { bank_id, accounts } = bank;

            const activeAccounts = accounts.filter(account => account.is_default === true);
            if (activeAccounts.length > 1) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: "Only one account can be marked as active at a time"
                });
            }

            let accounts_data = accounts;
            const checkExistingAccount = await checkAccountNumber(accounts_data)
            if (checkExistingAccount.length > 0) {
                return res.status(StatusCodes.OK).json({
                    status: false,
                    message: `Account No. ${checkExistingAccount[0].account_number} already exists.`
                });
            }


            for (const row of accounts) {
                const { account_number, account_holder_name, account_type, ifsc_code, branch, is_default } = row;
                if (is_default > 0) {
                    // Set is_default to 0 for other accounts of the user
                    await db.query(`UPDATE accounts SET is_default = 0 WHERE user_id = ?`, [userId]);
                }

                // Insert the new account details
                const insertQuery = await db.query(`
                    INSERT INTO accounts (user_id, bank_id, account_number, account_holder_name, account_type, ifsc_code, branch, is_default)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [userId, bank_id, account_number, account_holder_name, account_type, ifsc_code, branch, is_default]);

                if (insertQuery.affectedRows > 0 && is_default > 0) {
                    // Update the newly inserted account to be the default if it's marked as default
                    await db.query(`UPDATE accounts SET is_default = 1 WHERE id = ?`, [insertQuery.insertId]);
                }
            }
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            message: "Account details saved successfully"
        });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

/** function to add amount in bank accounts */
const addAmountToBankAccount = async (req, res) => {
    const { id, remark, balance, transaction_id } = req.body;

    try {
        const { error } = addWalletAmountValidation.validate(req.body);

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: Error.message,
                message: error.message
            });
        }

        const query = await db.query(`SELECT * FROM accounts WHERE id=?`, [id]);

        if (query.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: "Account not found"
            });
        }

        const existingUpdatedBalance = query[0].balance;
        const existingUser = query[0].user_id;

        let updatedBalance;
        if (existingUpdatedBalance === 0) {
            updatedBalance = balance;
        } else {
            updatedBalance = existingUpdatedBalance + balance;
        }

        const transactionIdExists = await db.query(`SELECT * FROM account_transactions WHERE transaction_id=?`, [transaction_id]);

        if (transactionIdExists.length > 0) {
            return res.status(StatusCodes.CONFLICT).json({
                status: false,
                message: "Transaction ID already exists. Please use a different transaction ID."
            });
        }

        const balanceUpdate = await db.query(`UPDATE accounts SET balance=? where id=?`, [updatedBalance, id]);

        if (balanceUpdate.affectedRows > 0) {

            const addTransactions = await accountsTransaction(
                id,
                existingUser,
                "credit",
                balance,
                updatedBalance,
                transaction_id,
                remark
            );

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Amount added successfully"
            });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Error! Something went wrong, please try again later"
            });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

/** function to retrieve all account details */
const getAllAccountsDetails = async (req, res) => {

    try {

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND ( accounts.branch LIKE '%${searchData}%' OR banks.bank_name LIKE '%${searchData}%') `;
        }

        const selectQuery = `SELECT accounts.id, accounts.account_holder_name, accounts.user_id, accounts.account_type, users.name, banks.bank_name, banks.logo, accounts.account_number, accounts.account_type, accounts.ifsc_code, accounts.branch, accounts.is_default, accounts.created_by FROM accounts LEFT JOIN banks ON accounts.bank_id = banks.id LEFT JOIN users ON accounts.user_id = users.id WHERE accounts.is_deleted = 0 ${search_value} ORDER BY accounts.id LIMIT ${pageFirstResult} , ${pageSize}`;

        const queryResult = await db.query(selectQuery);
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Data found",
                    data: queryResult,
                    pageDetails: pageDetails
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Data not found"
                });
        }

    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}

/** function to retrieve all account details by user id*/
const accountDetailsbyId = async (req, res) => {

    try {
        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const query = `SELECT accounts.id, accounts.bank_id, accounts.user_id, users.name, banks.bank_name, banks.logo, accounts.account_number, accounts.account_type, accounts.account_holder_name, accounts.ifsc_code, accounts.branch,accounts.balance, accounts.is_default, accounts.created_by FROM accounts LEFT JOIN banks ON accounts.bank_id = banks.id LEFT JOIN users ON accounts.user_id = users.id WHERE accounts.is_deleted = 0 AND accounts.id = ? ORDER BY accounts.id; `;

        const queryResult = await db.query(query, [id]);

        if (queryResult.length > 0) {

            const getBankId = queryResult[0].bank_id;
            const getBankName = queryResult[0].bank_name;
            const getBankLogo = queryResult[0].logo;
            const getAccountId = queryResult[0].id;

            var finalData = [];
            for (const row of queryResult) {
                finalData.push({
                    account_id: row.id,
                    account_type: row.account_type,
                    account_holder_name:row.account_holder_name,
                    user_id: row.user_id,
                    user_name: row.name,
                    account_number: row.account_number,
                    ifsc_code: row.ifsc_code,
                    branch: row.branch,
                    balance: row.balance,
                    is_default: row.is_default,
                    created_at: row.created_at,
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Data found",
                    data: { bank_id: getBankId, bank_name: getBankName, bank_logo: getBankLogo, account_id: getAccountId, accounts: finalData }
                });
        } else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: 'No Data found'
                });
        }

    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
};

/** function to update account details and also is_default status */
const updateAccountDetails = async (req, res) => {
    try {
        const { id, bank_id, account_number, account_holder_name, account_type, ifsc_code, branch, is_default } = req.body;

        const { error } = updateAccountDetailsValidation.validate(req.body);

        if (error) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const user_id = req.user.user_id;
        // check account is default trues
        if (is_default > 0) {
            const query = await db.query(`UPDATE accounts SET is_default=0 WHERE user_id=?`, [user_id]);
        }

        const queryResult = await db.query(`
            UPDATE accounts SET bank_id=?, account_number=?, account_holder_name=?, account_type=?, ifsc_code=?, branch=?, is_default=? WHERE id=?
        `, [bank_id, account_number, account_holder_name, account_type, ifsc_code, branch, is_default, id]);

        if (queryResult.affectedRows > 0) {

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Account details updated successfully"
            });

        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: "Error! Something went wrong, please try again later"
            });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
};

/** function to delete the account details */
const deleteAccountDetails = async (req, res) => {

    try {

        const { id } = req.params;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) return res.status(StatusCodes.FORBIDDEN).json({ Status: false, message: error.message })

        const queryResult = await db.query(`UPDATE accounts SET is_deleted=1 where id=?`, [id]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Account details deleted successfully"
                });
        }
        else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: "Error! Something went wrong, please try again later"
                });
        }

    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}

const getTransactionByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const date = req.query.date ?? 'last12Months';

        const { error } = checkPositiveInteger.validate({ id });

        if (error)
            return res.status(StatusCodes.FORBIDDEN).json({ status: false, message: error.message });

        const pageSize = parseInt(req.query.pageSize) || parseInt(process.env.DEFAULT_PAGE_SIZE);
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;

        const getFilterOfDate = await filterTransactionsByDate(date);

        const { startDate, endDate } = getFilterOfDate;
        const startDateFormatted = startDate.format('YYYY-MM-DD');
        const endDateFormatted = endDate.format('YYYY-MM-DD');


        let dateCondition = "";
        if (startDateFormatted === endDateFormatted) {
            dateCondition = `WHERE date = '${startDateFormatted}'`;
        } else {
            dateCondition = `WHERE date BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'`;
        }


        const orderLimitQuery = `ORDER BY accounts.id DESC LIMIT ${pageFirstResult}, ${pageSize}`;


        // const searchClause = searchConditions.length > 0 ? ` AND (${searchConditions.join(' OR ')})` : '';

        const query = `SELECT account_transactions.id, accounts.id as account_id, accounts.user_id, users.name AS user_name, banks.bank_name, accounts.account_number, accounts.ifsc_code, accounts.branch, account_transactions.account_id, account_transactions.status, account_transactions.transaction, account_transactions.updated_balance, account_transactions.description, account_transactions.date,  accounts.is_default, accounts.created_by, accounts.created_at FROM accounts LEFT JOIN banks ON accounts.bank_id = banks.id LEFT JOIN users ON accounts.user_id = users.id LEFT JOIN account_transactions ON accounts.id = account_transactions.account_id  ${dateCondition} AND account_transactions.account_id = ${id} ${orderLimitQuery}`;

        // SELECT accounts.id, accounts.user_id, users.name AS user_name, banks.bank_name, accounts.account_number, accounts.ifsc_code, accounts.branch, account_transactions.status, account_transactions.transaction, account_transactions.updated_balance, account_transactions.description, accounts.is_default, accounts.created_by, accounts.created_at FROM accounts LEFT JOIN banks ON accounts.bank_id = banks.id LEFT JOIN users ON accounts.user_id = users.id LEFT JOIN account_transactions ON accounts.id = account_transactions.account_id WHERE date = '2024-02-15' ORDER BY accounts.id DESC LIMIT 0, 10;

        const queryResult = await db.query(query);


        if (queryResult.length > 0) {
            var finalData = [];
            var pageDetails = await calculatePagination(queryResult.length, currentPage, pageSize);


            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: row.user_name,
                    account_id: row.account_id,
                    account_number: row.account_number,
                    bank_name: row.bank_name,
                    ifsc_code: row.ifsc_code,
                    branch: row.branch,
                    status: row.status,
                    transaction: row.transaction,
                    updated_balance: row.updated_balance,
                    description: row.description,
                    is_default: row.is_default,
                    created_by: row.created_by,
                    date: moment(row.date).format('YYYY-MM-DD'),
                    created_at: row.created_at,
                });
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Data found",
                data: finalData, pageDetails: pageDetails
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: 'No Data found'
            });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

/** function to retrieve search query */
const transactionList = async (req, res) => {

    try {

        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ['account_transactions.status', 'account_transactions.date', 'account_transactions.transaction_id', 'accounts.account_number', 'users.name', 'users.employee_id', 'banks.bank_name'];
        const searchConditions = [];

        if (searchData != null && searchData != '') {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        const orderLimitQuery = `ORDER BY id DESC LIMIT ${pageFirstResult}, ${pageSize}`;

        const query = `SELECT users.name AS user_name, users.employee_id, users.image, banks.bank_name, accounts.account_number, accounts.ifsc_code, accounts.branch, account_transactions.* FROM accounts LEFT JOIN users ON users.id = accounts.user_id LEFT JOIN banks ON banks.id = accounts.bank_id LEFT JOIN account_transactions ON account_transactions.account_id = accounts.id ${searchConditions.length > 0 ? `WHERE ${searchConditions.map(condition => `${condition}`).join(' OR ')} ` : ''} ${orderLimitQuery}`;

        const queryResult = await db.query(query);

        const modifiedQueryString = query.substring(0, query.indexOf('ORDER BY'));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > 0) {
            var finalData = [];
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {

                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: row.user_name,
                    employee_id: row.employee_id,
                    image: row.image,
                    account_id: row.account_id,
                    bank_name: row.bank_name,
                    account_number: row.account_number,
                    ifsc_code: row.ifsc_code,
                    branch: row.branch,
                    status: row.status,
                    transaction: row.transaction,
                    updated_balance: row.updated_balance,
                    transaction_id: row.transaction_id,
                    description: row.description,
                    created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss A'),
                });
            }

            return res.
                status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Data found",
                    data: finalData,
                    pageDetails: pageDetails
                });
        } else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: 'No items found'
                });
        }

    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                status: false,
                message: error.message
            });
    }
}

/** function to retrieve bank balance by Id and bankId*/
const getBankBalance = async (req, res) => {
    try {
        const { id, bankId } = req.params;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message
            });
        }

        const query = await db.query('SELECT * FROM accounts where id= ? AND bank_id=?', [id, bankId])
        let dbBalance;
        if (query.length > 0) {
            dbBalance = query[0].balance
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Balance not found."
            });
        }

        return res.status(StatusCodes.OK).json({
            status: true,
            balance: dbBalance
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

/** function to retrieve bank balance by bankId , userId and account number*/
const bankAccountNumbertoBalance = async (req, res) => {
    try {

        const { id, bankId } = req.params;

        const { error } = checkPositiveInteger.validate({ id: id });

        if (error) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const query = await db.query(`SELECT banks.bank_name, accounts.account_number, accounts.balance FROM banks INNER JOIN accounts ON accounts.bank_id = banks.id WHERE banks.id = ? AND accounts.id = ?`, [bankId, id])


        if (query.length > 0) {
            var finalData = [];

            for (const row of query) {
                finalData.push({
                    user_id: row.id,
                    bank_name: row.bank_name,
                    account_number: row.account_number,
                    balance: row.balance
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Data found",
                    data: finalData,
                });

        } else {

            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: 'No Data found'
                });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

/** function to retrieve all transaction by users */
const getAllTransactionByUsers = async (req, res) => {
    try {
        const query = `SELECT accounts.id, accounts.user_id, users.name, banks.bank_name, accounts.account_number, accounts.ifsc_code, accounts.branch, account_transactions.status, account_transactions.transaction, account_transactions.updated_balance, account_transactions.description, accounts.is_default, accounts.created_by FROM accounts LEFT JOIN banks ON accounts.bank_id = banks.id LEFT JOIN users ON accounts.user_id = users.id LEFT JOIN account_transactions ON accounts.id = account_transactions.account_id WHERE accounts.is_deleted = 0  ORDER BY accounts.id;`;

        const queryResult = await db.query(query);

        if (queryResult.length > 0) {
            var finalData = [];

            for (const row of queryResult) {
                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    user_name: row.user_name,
                    account_id: row.account_id,
                    bank_name: row.bank_name,
                    account_number: row.account_number,
                    ifsc_code: row.ifsc_code,
                    branch_name: row.branch_name,
                    status: row.status,
                    transaction: row.transaction,
                    updated_balance: row.updated_balance,
                    description: row.description,
                    is_default: row.is_default,
                    createdBy: row.createdBy,
                    date: moment(row.date).format('YYYY-MM-DD'),
                    created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss A'),
                });
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Data found",
                    data: finalData,
                });
        } else {
            return res
                .status(StatusCodes.OK)
                .json({
                    status: false,
                    message: 'No Data found'
                });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

const getBankToAccount = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message
            });
        }

        const query = await db.query('SELECT id, bank_id, account_number, account_holder_name, account_type, branch, ifsc_code, balance FROM accounts where bank_id= ?', [id])

        if (query.length > 0) {
            return res.status(StatusCodes.OK).json({ status: true, data: query })
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Account not found."
            });
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

const getBankTransactions = async (req, res) => {
    try {

        const {id, type} = req.params;
        
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: error.message
            });
        }
        const date = req.query.date ?? 'last12Months';
    
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND ( accounts.branch LIKE '%${searchData}%' OR accounts.account_number LIKE '%${searchData}%' OR account_transactions.status LIKE '%${searchData}%' OR account_transactions.transaction_id LIKE '%${searchData}%') `;
        }

        const getFilterOfDate = await filterTransactionsByDate(date);
        const { startDate, endDate } = getFilterOfDate;
        // const startDateFormatted = startDate.format('YYYY-MM-DD');
        // const endDateFormatted = endDate.format('YYYY-MM-DD');

        let dateCondition = "";
        // if (startDateFormatted === endDateFormatted) {
        //     dateCondition = `AND date = '${startDateFormatted}'`;
        // } else {
        //     dateCondition = `AND date BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'`;
        // }

        if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
            const startDateFormatted = startDate.format('YYYY-MM-DD');
            const endDateFormatted = endDate.format('YYYY-MM-DD');

            if (startDateFormatted === endDateFormatted) {
                dateCondition = `AND date = '${startDateFormatted}'`;
            } else {
                dateCondition = `AND date BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'`;
            }
        }

        const selectQuery = `SELECT accounts.bank_id AS bank_id, banks.bank_name, banks.logo, account_transactions.account_id, accounts.account_number, accounts.account_type, accounts.ifsc_code, accounts.branch, accounts.is_default, account_transactions.status, account_transactions.transaction, account_transactions.updated_balance as last_balance, account_transactions.transaction_id, account_transactions.description, account_transactions.date FROM accounts LEFT JOIN account_transactions ON accounts.id = account_transactions.account_id LEFT JOIN banks ON accounts.bank_id = banks.id  WHERE (category_type = '${type}' OR category_type IS NULL OR category_type = '') AND accounts.id = '${id}' AND account_transactions.account_id IS NOT NULL AND account_transactions.status IN ('debit', 'credit') ${dateCondition} ${search_value} ORDER BY account_transactions.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        const execQuery = await db.query(selectQuery)

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (execQuery.length > 0) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({
                status: true, data: execQuery, pageDetails: pageDetails
            })
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found"
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

const getBankTransactionsForStock = async (req, res) => {
    try {

        const id = req.params.id;
        // const date = req.query.date ?? 'last12Months';

        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: error.message
            });
        }
        const date = req.query.date ?? 'last12Months';

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND ( accounts.branch LIKE '%${searchData}%' OR accounts.account_number LIKE '%${searchData}%' OR account_transactions.status LIKE '%${searchData}%' OR account_transactions.transaction_id LIKE '%${searchData}%') `;
        }

        const getFilterOfDate = await filterTransactionsByDate(date);

        const { startDate, endDate } = getFilterOfDate;
        // const startDateFormatted = startDate.format('YYYY-MM-DD');
        // const endDateFormatted = endDate.format('YYYY-MM-DD');

        let dateCondition = "";
        // if (startDateFormatted === endDateFormatted) {
        //     dateCondition = `AND date = '${startDateFormatted}'`;
        // } else {
        //     dateCondition = `AND date BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'`;
        // }

        if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
            const startDateFormatted = startDate.format('YYYY-MM-DD');
            const endDateFormatted = endDate.format('YYYY-MM-DD');

            if (startDateFormatted === endDateFormatted) {
                dateCondition = `AND date = '${startDateFormatted}'`;
            } else {
                dateCondition = `AND date BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'`;
            }
        }

        const selectQuery = `SELECT accounts.bank_id AS bank_id, banks.bank_name, banks.logo, account_transactions.account_id, accounts.account_number, accounts.account_type, accounts.ifsc_code, accounts.branch, accounts.is_default, account_transactions.status, account_transactions.transaction, account_transactions.updated_balance as last_balance, account_transactions.transaction_id, account_transactions.description, account_transactions.date FROM accounts LEFT JOIN account_transactions ON accounts.id = account_transactions.account_id LEFT JOIN banks ON accounts.bank_id = banks.id  WHERE (category_type = 'stock' OR category_type IS NULL OR category_type = '') AND accounts.bank_id = '${id}' AND account_transactions.account_id IS NOT NULL ${dateCondition} ${search_value} ORDER BY account_transactions.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        const execQuery = await db.query(selectQuery)

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (execQuery.length > 0) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({
                status: true, data: execQuery, pageDetails: pageDetails
            })
        } else {
            return res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: "Account transactions not found."
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message
        });
    }
}

const checklastBalanceOfWallets = async function (req, res) {
    try {
        const bankId = req.params.bankId;
        // const date = req.query.date ?? 'last12Months';

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value = ` AND (accounts.account_holder_name LIKE '%${searchData}%' OR accounts.account_number LIKE '%${searchData}%' OR accounts.ifsc_code LIKE '%${searchData}%' OR accounts.branch LIKE '%${searchData}%' OR accounts.account_type LIKE '%${searchData}%')`;
        }

        const selectQuery = `SELECT DISTINCT accounts.id AS account_id, accounts.account_number, accounts.account_holder_name, accounts.account_type, accounts.ifsc_code, accounts.branch, accounts.is_default, banks.bank_name, banks.logo, (SELECT at.updated_balance FROM account_transactions AS at WHERE at.account_id = accounts.id ORDER BY at.date DESC LIMIT 1) AS last_balance FROM accounts LEFT JOIN banks ON accounts.bank_id = banks.id LEFT JOIN account_transactions ON accounts.id = account_transactions.account_id WHERE accounts.bank_id = '${bankId}' ${search_value} ORDER BY accounts.id DESC LIMIT ${pageFirstResult} , ${pageSize}`;
        const execQuery = await db.query(selectQuery)
        
        const mainQueryStartIndex = selectQuery.indexOf("SELECT DISTINCT");
        const mainQueryEndIndex = selectQuery.lastIndexOf("ORDER BY");
        const mainQueryString = selectQuery.substring(mainQueryStartIndex, mainQueryEndIndex);
        const modifiedQueryString = `${mainQueryString} ORDER BY accounts.id`;
        const totalResult = await db.query(modifiedQueryString);

        if (execQuery.length > 0) {

            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            return res.status(StatusCodes.OK).json({
                status: true, data: execQuery, pageDetails: pageDetails
            })
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found"
            });
        }


    } catch (error) {
        return res.status(404).json({ status: false, message: error.message });
    }
}

const checkLastBalanceOfEmployee = async function (req, res) {
    try {

        const id = req.params.employeeId;

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search ?? '';

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND (users.username LIKE '%${searchData}%' OR users.mobile LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
        }

        let allUsers = [];

        // Check if the provided ID belongs to an area manager
        const isAreaManager = await db.query(`SELECT COUNT(*) as count FROM users WHERE id = '${id}' AND manager_id IS NULL`);

        if (isAreaManager[0].count > 0) {
            // If the provided ID belongs to an area manager, fetch all supervisors and end users under them
            const supervisors = await db.query(`SELECT id FROM users WHERE manager_id = '${id}'`);
            const endUsers = await db.query(`SELECT id FROM users WHERE supervisor_id IN (SELECT id FROM users WHERE manager_id = '${id}')`);
            allUsers = [id, ...supervisors.map(s => s.id), ...endUsers.map(e => e.id)];
        } else {
            // If the provided ID belongs to a supervisor, fetch all end users under them
            const supervisorEndUsers = await db.query(`SELECT id FROM users WHERE supervisor_id = '${id}'`);

            allUsers = [id, ...supervisorEndUsers.map(user => user.id)];

            // Check if the provided ID is an end user, if so, add it to the list of users
            const isEndUser = await db.query(`SELECT COUNT(*) as count FROM users WHERE id = '${id}' AND supervisor_id IS NOT NULL`);
            if (isEndUser[0].count > 0) {
                allUsers.push(id);
            }
        }
        const getLastBalanceQuery = `SELECT user_wallets.*, users.name, users.username, users.image, users.email, users.mobile, users.employee_id, users.role_id, roles.name as role_name FROM users LEFT JOIN user_wallets ON users.id = user_wallets.user_id LEFT JOIN roles ON users.role_id = roles.id WHERE user_wallets.user_id IN (${allUsers.map(userID => `'${userID}'`).join(',')}) ${search_value} ORDER BY user_wallets.user_id ASC LIMIT ${pageFirstResult}, ${pageSize};`;
  
        const result = await db.query(getLastBalanceQuery);

        const modifiedQueryString = getLastBalanceQuery.substring(0, getLastBalanceQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (result.length > 0) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({
                status: true, data: result, pageDetails: pageDetails
            })
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found"
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}

// balance overview 
const lastBalanceOfEmployeeInExpense = async function (req, res) {
    try {

        const id = req.params.employeeId ?? '';
        let where = id ? ` AND users.id = ${id}` : '';
        
        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';

        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND (users.username LIKE '%${searchData}%' OR users.mobile LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
        }

        let allUsers = [];

        // Check if the provided ID belongs to an area manager
        const isAreaManager = await db.query(`SELECT COUNT(*) as count FROM users WHERE  is_deleted='0' ${where} AND manager_id IS NULL`);

        if (isAreaManager[0].count > 0) {
            // If the provided ID belongs to an area manager, fetch all supervisors and end users under them
            let where = id ? ` AND manager_id = ${id}` : '';
            const supervisors = await db.query(`SELECT id FROM users WHERE  is_deleted='0' ${where}`);
            const endUsers = await db.query(`SELECT id FROM users WHERE is_deleted='0' AND supervisor_id IN (SELECT id FROM users WHERE  is_deleted='0' ${where})`);
            allUsers = [id, ...supervisors.map(s => s.id), ...endUsers.map(e => e.id)];
        } else {
            // If the provided ID belongs to a supervisor, fetch all end users under them
            let where = id ? ` AND supervisor_id = ${id}` : '';
            const supervisorEndUsers = await db.query(`SELECT id FROM users WHERE is_deleted='0' ${where}`);

            allUsers = [id, ...supervisorEndUsers.map(user => user.id)];

            // Check if the provided ID is an end user, if so, add it to the list of users
            where = id ? ` AND id = ${id}` : '';
            const isEndUser = await db.query(`SELECT COUNT(*) as count FROM users WHERE is_deleted='0' ${where} AND supervisor_id IS NOT NULL`);
            if (isEndUser[0].count > 0) {
                allUsers.push(id);
            }
        }

        const getLastBalanceQuery = `SELECT user_wallets.*, users.name, users.username, users.image, users.email, users.mobile, users.employee_id, users.role_id, roles.name as role_name FROM users LEFT JOIN user_wallets ON users.id = user_wallets.user_id LEFT JOIN roles ON users.role_id = roles.id WHERE  user_wallets.user_id IN (${allUsers.map(userID => `'${userID}'`).join(',')})
       ${search_value} ORDER BY user_wallets.user_id ASC LIMIT ${pageFirstResult}, ${pageSize};`;

        const result = await db.query(getLastBalanceQuery);

        const modifiedQueryString = getLastBalanceQuery.substring(0, getLastBalanceQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (result.length > 0) {
            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);
            return res.status(StatusCodes.OK).json({
                status: true, data: result, pageDetails: pageDetails
            })
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Data not found"
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
}


const getUserTransactionHistory = async (req, res) => {
    try {
        const userId = req.params.user_id;
      
        const { error } = checkPositiveInteger.validate({ id: userId });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = "";

        if (searchData != null && searchData != '') {
            search_value += `AND (transaction_type LIKE '%${searchData}%' OR amount LIKE '%${searchData}%' OR balance LIKE '%${searchData}%')`;
        }


        // now check the first area manager id if AM not then go to else conditions check to supervisor and  endusrs.

        let allUsers = [];

        const isAreaManager = await db.query(`SELECT COUNT(*) as count FROM users WHERE id = ? AND manager_id IS NULL`, [userId]);
        if (isAreaManager[0].count > 0) {
            // If the provided ID belongs to an area manager, fetch all supervisors and end users under them
            const supervisors = await db.query(`SELECT id FROM users WHERE manager_id = ?`, [userId]);
            const endUsers = await db.query(`SELECT id FROM users WHERE supervisor_id IN (SELECT id FROM users WHERE manager_id = ?)`, [userId]);
            allUsers = [userId, ...supervisors.map(s => s.id), ...endUsers.map(e => e.id)];
        } else {
            // If the provided ID belongs to a supervisor, fetch all end users under them
            const supervisorEndUsers = await db.query(`SELECT id FROM users WHERE supervisor_id = ?`, [userId]);
            allUsers = [userId, ...supervisorEndUsers.map(user => user.id)];

            // Check if the provided ID is an end user, if so, add it to the list of users
            const isEndUser = await db.query(`SELECT COUNT(*) as count FROM users WHERE id = ? AND supervisor_id IS NOT NULL`, [userId]);
            if (isEndUser[0].count > 0) {
                allUsers.push(userId);
            }
        }
        
        // individual transactions showing like area manager, supervisor, and end users

        const selectQuery = `SELECT transactions.*, users.username, users.email, users.mobile, users.employee_id, users.role_id, roles.name as role_name FROM transactions left join users ON transactions.user_id = users.id LEFT JOIN roles ON users.role_id = roles.id WHERE transactions.user_id = '${userId}' ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        // its depend upon the area manager to suppervisor and endusers, supervisor to endusers and endusers itself.
        
        // const selectQuery = `SELECT transactions.*, users.username, users.email, users.mobile, users.employee_id, users.role_id, roles.name as role_name FROM transactions left join users ON transactions.user_id = users.id LEFT JOIN roles ON users.role_id = roles.id  WHERE transactions.user_id IN (${allUsers.map(userID => `'${userID}'`).join(',')}) ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`

        const queryResult = await db.query(selectQuery);

        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {

            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                row.status = 'Completed';
                row.transaction_date = moment(row.created_at).format('YYYY-MM-DD');
                row.transaction_time = moment(row.created_at).format('HH:mm:ss A');

            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: queryResult,
                pageDetails: pageDetails
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: 'Data not found',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

// date filter like week month year
const getUserExpenseTransaction = async (req, res) => {
    try {
        const userId = req.params.user_id;

        const { error } = checkPositiveInteger.validate({ id: userId });

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const pageSize = parseInt(req.query.pageSize) || 10;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
       
        var search_value = "";


        if (searchData != null && searchData != '') {
            search_value += `AND (transaction_type LIKE '%${searchData}%' OR amount LIKE '%${searchData}%' OR balance LIKE '%${searchData}%' OR complaints.complaint_unique_id LIKE '%${searchData}%')`;
        }

        /** Date filter according to week, year, half year etc */
        const date = req.query.date ?? 'last12Months';
        const getFilterOfDate = await filterTransactionsByDate(date);
        const { startDate, endDate } = getFilterOfDate;

        let dateCondition = "";


        if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
            const startDateFormatted = startDate.format('YYYY-MM-DD');
            const endDateFormatted = endDate.format('YYYY-MM-DD');

            if (startDateFormatted === endDateFormatted) {
                dateCondition = `AND transaction_date = '${startDateFormatted}'`;
            } else {
                dateCondition = `AND transaction_date BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'`;
            }
        }
        // now check the first area manager id if AM not then go to else conditions check to supervisor and  endusrs.

        let allUsers = [];

        const isAreaManager = await db.query(`SELECT COUNT(*) as count FROM users WHERE id = ? AND manager_id IS NULL`, [userId]);
        if (isAreaManager[0].count > 0) {
            // If the provided ID belongs to an area manager, fetch all supervisors and end users under them
            const supervisors = await db.query(`SELECT id FROM users WHERE manager_id = ?`, [userId]);
            const endUsers = await db.query(`SELECT id FROM users WHERE supervisor_id IN (SELECT id FROM users WHERE manager_id = ?)`, [userId]);
            allUsers = [userId, ...supervisors.map(s => s.id), ...endUsers.map(e => e.id)];
        } else {
            // If the provided ID belongs to a supervisor, fetch all end users under them
            const supervisorEndUsers = await db.query(`SELECT id FROM users WHERE supervisor_id = ?`, [userId]);
            allUsers = [userId, ...supervisorEndUsers.map(user => user.id)];

            // Check if the provided ID is an end user, if so, add it to the list of users
            const isEndUser = await db.query(`SELECT COUNT(*) as count FROM users WHERE id = ? AND supervisor_id IS NOT NULL`, [userId]);
            if (isEndUser[0].count > 0) {
                allUsers.push(userId);
            }
        }

        // individual transactions showing like area manager, supervisor, and end users

        const selectQuery = `SELECT transactions.*, users.username, users.email, users.mobile, users.employee_id, users.role_id, roles.name as role_name FROM transactions left join users ON transactions.user_id = users.id LEFT JOIN roles ON users.role_id = roles.id LEFT JOIN complaints ON complaints.id =  transactions.complaints_id WHERE transactions.user_id = '${userId}' ${dateCondition} ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;

        // its depend upon the area manager to suppervisor and endusers, supervisor to endusers and endusers itself.
        // const selectQuery = `SELECT transactions.*, users.username, users.email, users.mobile, users.employee_id, users.role_id, roles.name as role_name FROM transactions left join users ON transactions.user_id = users.id LEFT JOIN roles ON users.role_id = roles.id  WHERE transactions.user_id IN (${allUsers.map(userID => `'${userID}'`).join(',')}) ${dateCondition} ${search_value} ORDER BY id DESC LIMIT ${pageFirstResult} , ${pageSize}`;


        const queryResult = await db.query(selectQuery);
        // remove after order by
        const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf("ORDER BY"));
        const totalResult = await db.query(modifiedQueryString);

        if (queryResult.length > process.env.VALUE_ZERO) {

            var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

            for (const row of queryResult) {
                row.status = 'Completed';
                row.transaction_date = moment(row.created_at).format('YYYY-MM-DD');
                row.transaction_time = moment(row.created_at).format('HH:mm:ss A');
                row.complaint_details = await getComplaintUniqueId(row.complaints_id)

            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: queryResult,
                pageDetails: pageDetails
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: 'Data not found',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message })
    }
}

// const getUserWalletDetails = async (req, res) => {
//     try {
//         const userId = req.params.user_id
//         let userCreditLimit;
//         const queryUser = `SELECT * FROM users WHERE id=?`;
//         const getUser = await db.query(queryUser, [userId]);
//         // if user id not exits in users table than it will go inside admin table

//         if (getUser.length === 0) {
//             const queryAdmin = `SELECT * FROM admins WHERE id=?`;
//             const getAdmin = await db.query(queryAdmin, [userId]);

//             if (getAdmin.length > 0) {
//                 userCreditLimit = getAdmin[0].credit_limit
//             }
//         }
//         // if user id exits in users table
//         if (getUser.length > 0) {
//             userCreditLimit = getUser[0].credit_limit
//         }
//         if (!userCreditLimit) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ status: false, message: "User not found." })
//         }

//         // get transfer amount from fund request table 
//         const getTransferAmountQuery = `SELECT SUM(expense_transfer_amounts) AS totalExpenseTransferAmounts FROM fund_requests WHERE request_by =?`;
//         const getTransferAmount = await db.query(getTransferAmountQuery, [userId, process.env.PENDING_STATUS, process.env.VALUE_ZERO]);

//         const totalTransferAmounts = getTransferAmount[0]?.totalExpenseTransferAmounts ?? 0

//         // get user wallet balance  
//         const getWalletBalanceQuery = `SELECT balance FROM user_wallets WHERE user_id =? AND status=?`;
//         const getWalletBalance = await db.query(getWalletBalanceQuery, [userId, process.env.ACTIVE_STATUS]);
//         const userWalletBalance = getWalletBalance[0]?.balance ?? 0

        
//         return res.status(StatusCodes.OK).json({ status: true, data: { userId, userCreditLimit, totalTransferAmounts, userWalletBalance } })
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
//     }

// }


const getUserWalletDetails = async (req, res) => {
    try {
        const userId = req.params.user_id
        let userCreditLimit;
        let userName;
        const queryUser = `SELECT * FROM users WHERE id=? `;
        const getUser = await db.query(queryUser, [userId, process.env.ACTIVE_STATUS, process.env.VALUE_ZERO]);
        // if user id not exits in users table than it will go inside admin table

        if (getUser.length === 0) {
            const getAdmin = await db.query(queryAdmin, [userId, process.env.ACTIVE_STATUS, process.env.VALUE_ZERO]);
            if (getAdmin.length > 0) {
                userName = getAdmin[0].name
                userCreditLimit = getAdmin[0].credit_limit
            }
        }
        // if user id exits in users table
        if (getUser.length > 0) {
            userName = getUser[0].name
            userCreditLimit = getUser[0].credit_limit
        }
        if (!userCreditLimit) {
            return res.status(StatusCodes.OK).json({ status: false, message: "User not found." })
        }
      
        // get transfer amount from fund request table 
        const getTransferAmountQuery = `SELECT SUM(expense_transfer_amounts) AS totalExpenseTransferAmounts FROM fund_requests WHERE request_by =?`;
        const getTransferAmount = await db.query(getTransferAmountQuery, [userId, process.env.PENDING_STATUS, process.env.VALUE_ZERO]);

        const totalTransferAmounts = getTransferAmount[0]?.totalExpenseTransferAmounts ?? 0
        
        // get user wallet balance
        const getWalletBalanceQuery = `SELECT balance FROM user_wallets WHERE user_id =? AND status=?`;
        const getWalletBalance = await db.query(getWalletBalanceQuery, [userId, process.env.ACTIVE_STATUS]);
        const walletBalance = getWalletBalance[0]?.balance ?? 0
        
        const userWalletBalance =  walletBalance - totalTransferAmounts

        return res.status(StatusCodes.OK).json({ status: true, data: { userId, userName, userCreditLimit, totalTransferAmounts, userWalletBalance } })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }

}

module.exports = {
    addAccountDetails, getAllAccountsDetails, accountDetailsbyId, updateAccountDetails, deleteAccountDetails, addAmountToBankAccount, getTransactionByUser, transactionList, getBankBalance, bankAccountNumbertoBalance, getAllTransactionByUsers, getBankToAccount, getBankTransactions, getBankTransactionsForStock, checklastBalanceOfWallets, getUserTransactionHistory, checkLastBalanceOfEmployee, lastBalanceOfEmployeeInExpense, getUserExpenseTransaction, getUserWalletDetails
}
