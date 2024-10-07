var moment = require('moment');
const { con, makeDb } = require("../db");
const db = makeDb();
const { checkPositiveInteger} = require('./validation');


async function getTotalTaskCount()
{
    const sql = `SELECT COUNT(*) as totalTask FROM tasks`
    return await db.query(sql)
}

async function getTotalCompletedTask()
{
    const sql = `SELECT COUNT(*) as totalCompletedTask FROM tasks WHERE status = 'completed'`
    return await db.query(sql)
}

async function getTotalCanceledTask()
{
    const sql = `SELECT COUNT(*) as totalCanceledTask FROM tasks WHERE status = 'canceled'`
    return await db.query(sql)
}

async function getTotalToDoTask()
{
    const sql = `SELECT COUNT(*) as totalToDodTask FROM tasks WHERE status = 'assign'`
    return await db.query(sql)
}

async function getTotalInProgressTask()
{
    const sql = `SELECT COUNT(*) as totalInProgressTask FROM tasks WHERE status = 'in progress'`
    return await db.query(sql)
}

async function getTotalOverDueTask()
{
    const todayDate = moment().format('YYYY-MM-DD');
    const sql = `SELECT COUNT(*) as totalOverDueTask FROM tasks WHERE end_date <='${todayDate}' AND (status='in progress' OR status='assign')`
    return await db.query(sql)
}

async function getTaskCommentDetails(taskId)
{
    const sql = `SELECT remark, status, previous_status FROM task_comments WHERE task_id='${taskId}'`
    return await db.query(sql)
}



module.exports = {getTotalTaskCount, getTotalCompletedTask, getTotalCanceledTask, getTotalToDoTask, getTotalInProgressTask, getTotalOverDueTask, getTaskCommentDetails}