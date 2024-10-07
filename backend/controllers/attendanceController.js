require('dotenv').config();
var moment = require('moment');
const { con, makeDb } = require('../db');
const { promisify } = require('util');
const db = makeDb();
const { checkPositiveInteger } = require('../helpers/validation');
const {
    getDifferenceBetweenTime, getDayNameOnDate, calculateAbsentPercentage, calculateInTimePercentage, calculatePagination } = require('../helpers/general');
const { StatusCodes } = require('http-status-codes');
const requestIp = require('request-ip');
const { insertEmployeeActivityLog } = require('../helpers/activityLog');
const { log } = require('console');
const Joi = require('joi');


const clockIn = async (req, res) => {
    try {
        var response = '';
        const in_time = moment().format('YYYY-MM-DD H:m:s');
        const status = 'incomplete';
        const userId = req.user.user_id;
        const insertQuery = `INSERT INTO attendances(in_time, user_id, status) VALUES(?, ?, ?)`;
        const queryResult = await db.query(insertQuery, [in_time, userId, status]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            response = 'clock in';
            res.status(StatusCodes.OK).json({ status: true, message: response });
        } else {
            response = 'Error in clock in!';
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }
    } catch (error) {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: moment().unix(),
            action: 'clockIn method of attendanceController ',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];
    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const clockOut = async (req, res) => {
    try {
        const out_time = moment().format('YYYY-MM-DD H:m:s');
        const userId = req.user.user_id;
        const today = moment().format('YYYY-MM-DD');
        const status = 'incomplete';
        var response = '';

        const getTodayMarkedBreak = `SELECT * FROM attendances WHERE user_id = ? AND DATE_FORMAT(in_time, '%Y-%m-%d') = ? AND status = ?`;

        const queryResult = await db.query(getTodayMarkedBreak, [userId, today, status]);
        const dbId = queryResult[0].id;

        //update clock out time
        const updateQuery = `UPDATE attendances SET out_time = ? WHERE user_id = ? AND id = ?`;
        const updateQueryResult = await db.query(updateQuery, [out_time, userId, dbId]);

        if (updateQueryResult.affectedRows > process.env.VALUE_ZERO) {
            response = 'Clock out';
            res.status(StatusCodes.OK).json({ status: true, message: response });
        } else {
            response = 'Error! Clock In not ended';
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }
    } catch (error) {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: moment().unix(),
            action: 'clockOut method of attendanceController ',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];
    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const startBreak = async (req, res) => {
    try {
        const { status, break_type } = req.body;
        const in_time = moment().format('YYYY-MM-DD H:m:s');
        const userId = req.user.user_id;
        var response = '';

        const insertQuery = `INSERT INTO attendances(status, break_type, user_id, in_time) VALUES(?, ?, ?, ?)`;
        const queryResult = await db.query(insertQuery, [status, break_type, userId, in_time]);

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            response = 'Break marked';
            res.status(StatusCodes.OK).json({
                status: true,
                message: response,
                breakStartAt: in_time,
            });
        } else {
            response = 'Error! Not marked break';
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }
    } catch (error) {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: moment().unix(),
            action: 'startBreak method of attendanceController ',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];
    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const endBreak = async (req, res) => {
    try {
        const { break_type } = req.body;
        const out_time = moment().format('YYYY-MM-DD H:m:s');
        const userId = req.user.user_id;
        const today = moment().format('YYYY-MM-DD');
        var response = '';

        const getTodayMarkedBreak = `SELECT * FROM attendances WHERE user_id = ? AND DATE_FORMAT(in_time, '%Y-%m-%d') = ? AND break_type = ?`;

        const queryResult = await db.query(getTodayMarkedBreak, [userId, today, break_type]);
        const dbId = queryResult[0].id;

        const updateQuery = `UPDATE attendances SET out_time = ? WHERE user_id = ? AND id = ?`;
        const updateQueryResult = await db.query(updateQuery, [out_time, userId, dbId]);

        if (updateQueryResult.affectedRows > process.env.VALUE_ZERO) {
            response = 'Break ended';
            res.status(StatusCodes.OK).json({ status: true, message: response });
        } else {
            response = 'Error! Break not ended';
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }
    } catch (error) {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: moment().unix(),
            action: 'endBreak method of attendanceController ',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];
    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const checkClockInToday = async (req, res) => {
    try {
        const month = req.query.date || moment().format('YYYY-MM');
        const userId = req.user.user_id;
        const userType = req.user.user_type;

        if (userType == process.env.SUPER_ADMIN_ROLE_ID) {
            var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, admins.name, admins.image, breaks.break_name as break_name FROM attendances LEFT JOIN admins ON admins.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE attendances.user_id= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? ORDER BY attendances.id DESC`;
        } else {
            var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name,users.image, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE attendances.user_id= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? ORDER BY attendances.id DESC`;
        }
        const queryResults = await db.query(selectQuery, [userId, month]);

        if (queryResults.length > process.env.VALUE_ZERO) {
            var values = [];
            var result = [];

            for (const row of queryResults) {
                if (row.status === 'incomplete') {
                    values.push({
                        clockIn: row.in_time
                            ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss A')
                            : '--',
                        clockOut: row.out_time
                            ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss A')
                            : '--',
                        date: row.created_at ? moment(row.created_at).format('YYYY-MM-DD') : '--',
                        user_name: row.name,
                        user_image: row.image,
                    });
                }

                if (row.status === 'Company break') {
                    values.push({
                        break_name: row.status,
                        break_start: row.in_time
                            ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss A')
                            : '--',
                        break_end: row.out_time
                            ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss A')
                            : '--',
                        date: moment(row.created_at).format('YYYY-MM-DD'),
                    });
                }
            }
            const groupedData = values.reduce((acc, curr) => {
                const date = curr.date;
                if (!acc[date]) {
                    acc[date] = { dateArray: [] };
                }
                acc[date].dateArray.push(curr);
                return acc;
            }, {});

            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: groupedData,
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'data not found' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const timeSheet = async (req, res) => {
    try {
        var id = '';

        const date = req.query.date || moment().format('YYYY-MM');
        const today = moment(date).format('YYYY-MM');
        const userId = req.user.user_id;
        var response = '';

        if (req.user.user_type == process.env.SUPER_ADMIN_ROLE_ID || req.user.user_type == process.env.CONTRACTOR_ROLE_ID) {
            id = req.params.id;
            var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE attendances.user_id = ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? AND attendances.status = ? GROUP BY DATE(attendances.in_time) ORDER BY attendances.in_time DESC`;
        } else {
            id = req.user.user_id;
            var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE attendances.user_id= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? AND attendances.status = ? GROUP BY DATE(attendances.in_time) ORDER BY attendances.in_time DESC`;
        }

        const queryResults = await db.query(selectQuery, [id, today, 'incomplete']);

        if (queryResults.length > process.env.VALUE_ZERO) {
            var values = [];
            var outTime = '--';
            var totalWorkDuration = '--';

            for (const row of queryResults) {
                if (row.out_time == null) {
                    outTime, totalWorkDuration;
                } else {
                    totalWorkDuration = await getDifferenceBetweenTime(row.in_time, row.out_time);
                    outTime = moment(row.out_time).format('H:m:s A');
                }

                values.push({
                    id: row.id,
                    name: row.name,
                    image: row.image,
                    date: moment(row.in_time).format('YYYY-MM-DD'),
                    day: await getDayNameOnDate(row.in_time),
                    clockIn: moment(row.in_time).format('H:m:s A'),
                    clockOut: outTime,
                    totalWorkHour: totalWorkDuration,
                });
            }
            response = 'Fetched successfully';
            res.status(StatusCodes.OK).json({ status: true, message: response, data: values });
        } else {
            response = 'Records not found';
            res.status(StatusCodes.OK).json({ status: false, message: response });
        }
    } catch (error) {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: moment().unix(),
            action: 'timeSheet method of attendanceController ',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];
    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const getTimeSheetOfAllUserForSuperAdmin = async (req, res) => {
    try {
        var id = '';

        const date = req.query.date || moment().format('DD-MM-YYYY');
        const today = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        var response = '';

        var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND attendances.status = ? ORDER BY attendances.id DESC`;

        const queryResults = await db.query(selectQuery, [today, 'incomplete']);

        if (queryResults.length > process.env.VALUE_ZERO) {
            var values = [];
            var outTime = '--';
            var totalWorkDuration = '--';

            for (const row of queryResults) {
                if (row.out_time == null) {
                    outTime, totalWorkDuration;
                } else {
                    totalWorkDuration = await getDifferenceBetweenTime(row.in_time, row.out_time);
                    outTime = moment(row.out_time).format('H:m:s A');
                }

                values.push({
                    id: row.id,
                    name: row.name,
                    date: moment(row.created_at).format('YYYY-MM-DD'),
                    day: await getDayNameOnDate(row.in_time),
                    clockIn: moment(row.in_time).format('H:m:s A'),
                    clockOut: outTime,
                    totalWorkHour: totalWorkDuration,
                });
            }
            response = 'Fetched successfully';
            res.status(StatusCodes.OK).json({ status: true, message: response, data: values });
        } else {
            response = 'Records not found';
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: response });
        }
    } catch (error) {
        response = error.message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: response });
    }

    const logData = [
        {
            userId: req.user.userId,
            roleId: req.user.roleId,
            timestamp: moment().unix(),
            action: 'timeSheet method of attendanceController ',
            ipAddress: requestIp.getClientIp(req),
            userAgent: req.useragent.source,
            logResult: response,
        },
    ];
    const userActivityLog = await insertEmployeeActivityLog(logData);
};

const getAttendanceChartById = async (req, res) => {
    try {
        const id = req.params.id;
        const date = req.query.date || moment().format('YYYY-MM');
        var TotalWorkingDays = 0;
        var totalAbsent = 0;
        var totalAbsentPercentage = 0;
        var totalSickLeave = 0;
        var totalOnTimeAttendance = 0;
        var totalOnTimeAttendancePercentage = 0;
        var totalLateTimeAttendance = 0;
        var totalLateTimeAttendancePercentage = 0;
        var onTimeCLockIn = '';
        let totalWorkHoursInMonth = 0;
        let workHourInTIme = [];

        var now = new Date(date) || new Date();

        const totalDayInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        const { error } = checkPositiveInteger.validate({ id });
        if (error)
            return res
                .status(StatusCodes.FORBIDDEN)
                .res.status({ status: false, message: error.message });

        const selectTotalWorkingDaysQuery = `SELECT * FROM attendances WHERE user_id = ? AND break_type IS NULL AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? AND out_time IS NOT NULL`;

        const selectTotalWorkingDaysQueryResult = await db.query(selectTotalWorkingDaysQuery, [
            id,
            date,
        ]);

        if (selectTotalWorkingDaysQueryResult.length > process.env.VALUE_ZERO) {
            for (const row of selectTotalWorkingDaysQueryResult) {
                //total working days count
                if (row.status === 'incomplete') {
                    TotalWorkingDays++;

                    //int ime percentage calculate
                    onTimeCLockIn = moment(row.in_time).format('HH:mm:ss');

                    const timeString = '10:09:59 AM';
                    const timeObj = moment(timeString, 'hh:mm:ss A');
                    const lastTimeForIn = timeObj.format('HH:mm:ss');

                    if (onTimeCLockIn < lastTimeForIn) {
                        totalOnTimeAttendance++;
                    }

                    if (onTimeCLockIn < lastTimeForIn) {
                        totalLateTimeAttendance++;
                    }
                    const workHour = await getDifferenceBetweenTime(row.in_time, row.out_time);
                    workHourInTIme.push(workHour);
                    // Define an array of work hour durations
                }

                //absent count
                if (row.leave_type === 19) {
                    totalAbsent++;
                }
                //sick leave count
                if (row.leave_type === 6) {
                    totalSickLeave++;
                }

                //absent percentage calculate
            }
            if (workHourInTIme.length > process.env.VALUE_ZERO) {
                for (let index = 0; index < workHourInTIme.length; index += 2) {
                    const workHours = [
                        moment.duration(workHourInTIme[index]),
                        moment.duration(workHourInTIme[index + 1]),
                    ];

                    // Add all work hours in the array
                    const totalWorkHours = workHours.reduce(
                        (acc, curr) => acc.add(curr),
                        moment.duration(0)
                    );
                    totalWorkHoursInMonth =
                        totalWorkHours.hours() +
                        ':' +
                        totalWorkHours.minutes() +
                        ':' +
                        totalWorkHours.seconds();
                }
            }

            totalAbsentPercentage = await calculateAbsentPercentage(TotalWorkingDays, totalAbsent);
            totalOnTimeAttendancePercentage = await calculateInTimePercentage(
                TotalWorkingDays,
                totalOnTimeAttendance
            );
            totalLateTimeAttendancePercentage = await calculateInTimePercentage(
                TotalWorkingDays,
                totalLateTimeAttendance
            );

            TotalWorkingDays = TotalWorkingDays + '/' + totalDayInMonth;
        }

        const data = {
            TotalWorkingDays,
            totalAbsent,
            totalSickLeave,
            totalAbsentPercentage,
            totalOnTimeAttendancePercentage,
            totalLateTimeAttendancePercentage,
            totalWorkHoursInMonth,
        };

        res.status(StatusCodes.OK).json({
            status: true,
            message: 'Fetched successfully',
            data: data,
        });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const checkTodayMarkBreakAndAttendance = async (req, res) => {
    try {
        const id = req.user.user_id;
        const today = moment().format('YYYY-MM-DD');
        var loggedIn = false;
        var loggedInTime = '';
        var breakMark = false;
        var breakStartTime = '';

        const { error } = checkPositiveInteger.validate({ id });
        if (error)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: error.message });

        const selectQueryForLoggedIn = `SELECT * FROM attendances WHERE user_id = ? AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND status = ? AND out_time IS NULL`;

        const queryResultForLoggedIn = await db.query(selectQueryForLoggedIn, [
            id,
            today,
            'incomplete',
        ]);

        if (queryResultForLoggedIn.length > process.env.VALUE_ZERO) {
            loggedIn = true;
            loggedInTime = moment(queryResultForLoggedIn[0].in_time).format('HH:mm:ss A');
        }

        const selectQueryForBreakMark = `SELECT * FROM attendances WHERE user_id = ? AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND status = ? AND break_type IS NOT NULL AND out_time IS NULL`;
        const queryResultForBreakMark = await db.query(selectQueryForBreakMark, [
            id,
            today,
            'Company break',
        ]);

        if (queryResultForBreakMark.length > process.env.VALUE_ZERO) {
            breakMark = true;
            breakStartTime = moment(queryResultForBreakMark[0].in_time).format('HH:mm:ss A');
        }

        const data = [
            {
                loggedIn: loggedIn,
                loggedInTime: loggedInTime,
                breakMark: breakMark,
                breakStartTime: breakStartTime,
            },
        ];

        res.status(StatusCodes.OK).json({ status: true, message: null, data: data });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const getMonthsTotalWorkHour = async (req, res) => {
    try {
        const id = req.user.user_id;
        const { error } = checkPositiveInteger.validate({ id });
        if (error)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: error.message });

        const selectQuery = `SELECT user_id, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(out_time, in_time)))) AS total_work_hours FROM attendances WHERE user_id = ? AND status = ? AND MONTH(in_time) = MONTH(CURRENT_DATE()) GROUP BY user_id;`;

        const queryResults = await db.query(selectQuery, [id, 'incomplete']);

        if (queryResults.length > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: queryResults,
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({ status: false, message: 'Data not found' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const checkTotalUsersTimeSheet = async (req, res) => {
    try {
        //const month = req.query.date ||  moment().format('YYYY-MM');
        const currentDate = moment();
        const startDate = req.query.start_date || moment(currentDate).format('DD-MM-YYYY');

        const endDate = req.query.end_date || moment(currentDate).format('DD-MM-YYYY');
        const formattedStartDate = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const formattedEndDate = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        var userId = req.query.user_id;

        //dynamic pagination start

        const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;

        var countSelectQuery = `SELECT COUNT(*) as total FROM attendances WHERE DATE_FORMAT(created_at, '%Y-%m-%d') >= ? AND DATE_FORMAT(created_at, '%Y-%m-%d') <= ? `;

        constTotalLength = await db.query(countSelectQuery, [formattedStartDate, formattedEndDate]);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var queryParams = [pageFirstResult, pageSize];

        if (formattedStartDate != null && formattedEndDate != null) {
            // var selectQuery = `SELECT MAX(attendances.id) as id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image, users.employee_id, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE DATE_FORMAT(attendances.in_time, '%Y-%m-%d') >= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') <= ? GROUP BY attendances.user_id, DATE_FORMAT(attendances.in_time, '%Y-%m-%d') ORDER BY attendances.in_time DESC LIMIT ?, ?`;

            var selectQuery = `SELECT 
    MAX(attendances.id) as id,
    MAX(attendances.status) as status,
    MAX(attendances.break_type) as break_type,
    attendances.user_id,
    MAX(attendances.in_time) as in_time,
    MAX(attendances.out_time) as out_time,
    MAX(attendances.created_at) as created_at,
    users.name,
    users.image,
    users.employee_id,
    MAX(breaks.break_name) as break_name 
FROM attendances 
LEFT JOIN users ON users.id = attendances.user_id 
LEFT JOIN breaks ON breaks.id = attendances.break_type 
WHERE DATE_FORMAT(attendances.in_time, '%Y-%m-%d') >= ? 
  AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') <= ? 
GROUP BY attendances.user_id, DATE_FORMAT(attendances.in_time, '%Y-%m-%d') 
ORDER BY in_time DESC 
LIMIT ?, ?
`

            queryParams.unshift(formattedStartDate, formattedEndDate);
            // res.send({data: selectQuery, queryParams:queryParams})

            console.log('queryParams', queryParams)

            const queryResults = await db.query(selectQuery, queryParams);
            console.log(queryResults)
            if (queryResults.length > process.env.VALUE_ZERO) {
                var values = [];
                var outTime = '--';
                var totalWorkDuration = '--';

                for (const row of queryResults) {
                    if (row.status === 'incomplete') {
                        if (row.out_time == null) {
                            outTime, totalWorkDuration;
                        } else {
                            totalWorkDuration = await getDifferenceBetweenTime(
                                row.in_time,
                                row.out_time
                            );
                            outTime = moment(row.out_time).format('HH:mm:ss A');
                        }

                        values.push({
                            clockIn: row.in_time ? moment(row.in_time).format('HH:mm:ss A') : '--',
                            clockOut: row.out_time
                                ? moment(row.out_time).format('HH:mm:ss A')
                                : '--',
                            date: row.in_time ? moment(row.in_time).format('YYYY-MM-DD') : '--',
                            user_name: row.name,
                            user_image: row.image,
                            user_id: row.user_id,
                            employee_id: row.employee_id,
                            totalWorkDuration: totalWorkDuration,
                        });
                    }

                    if (row.status === 'Company break') {

                        for (const value of values) {
                            value.break_name = row.status;
                            value.break_start = row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss A') : '--';
                            value.break_end = row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss A') : '--';
                        }
                    }
                    else {
                        for (const value of values) {
                            value.break_name = '--';
                            value.break_start = '--';
                            value.break_end = '--';
                        }
                    }
                }



                res.status(StatusCodes.OK).json({
                    status: true,
                    message: 'Fetched successfully',
                    total: values.length,
                    data: values,
                });
            } else {
                res.status(StatusCodes.OK).json({
                    status: false,
                    message: 'data not found',
                });
            }
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: 'Please select date range' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const checkTotalUsersTimeSheetNew = async (req, res) => {
    try {

        const currentDate = moment();
        const startDate = req.query.start_date || moment(currentDate).format('DD-MM-YYYY');

        const endDate = req.query.end_date || moment(currentDate).format('DD-MM-YYYY');
        const formattedStartDate = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        const formattedEndDate = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        var userId = req.query.user_id;

        //dynamic pagination start
        const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        var search_value = '';

        if (searchData != null && searchData != '') {
            search_value += `AND (users.name LIKE '%${searchData}%' OR users.employee_id LIKE '%${searchData}%')`;
        }

        var queryParams = [pageFirstResult, pageSize];

        if (formattedStartDate != null && formattedEndDate != null) {
            var selectQuery = `SELECT MAX(attendances.id) as id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image, users.employee_id, breaks.break_name as break_name FROM attendances LEFT JOIN users ON users.id=attendances.user_id LEFT JOIN breaks ON breaks.id=attendances.break_type WHERE DATE_FORMAT(attendances.in_time, '%Y-%m-%d') >= ? AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') <= ? ${search_value} GROUP BY attendances.user_id, DATE_FORMAT(attendances.in_time, '%Y-%m-%d') ORDER BY attendances.in_time DESC LIMIT ?, ?`;

            queryParams.unshift(formattedStartDate, formattedEndDate);
            const queryResults = await db.query(selectQuery, queryParams);

            // remove group by order by for pagination
            const modifiedQueryString = selectQuery.substring(0, selectQuery.indexOf('ORDER BY'));
            const totalResult = await db.query(modifiedQueryString, [formattedStartDate, formattedEndDate]);

            if (queryResults.length > process.env.VALUE_ZERO) {
                var values = [];
                var outTime = '--';
                var totalWorkDuration = '--';
                var pageDetails = await calculatePagination(totalResult.length, currentPage, pageSize);

                for (const row of queryResults) {
                    if (row.status === 'incomplete') {
                        if (row.out_time == null) {
                            outTime, totalWorkDuration;
                        } else {
                            totalWorkDuration = await getDifferenceBetweenTime(
                                row.in_time,
                                row.out_time
                            );
                            outTime = moment(row.out_time).format('HH:mm:ss A');
                        }

                        values.push({
                            id: row.id,
                            clockIn: row.in_time ? moment(row.in_time).format('HH:mm:ss A') : '--',
                            clockOut: row.out_time
                                ? moment(row.out_time).format('HH:mm:ss A')
                                : '--',
                            date: row.in_time ? moment(row.in_time).format('YYYY-MM-DD') : '--',
                            user_name: row.name,
                            user_image: row.image,
                            user_id: row.user_id,
                            employee_id: row.employee_id,
                            totalWorkDuration: totalWorkDuration,
                        });
                    }

                    if (row.status === 'Company break') {

                        for (const value of values) {
                            value.break_name = row.status;
                            value.break_start = row.in_time ? moment(row.in_time).format('YYYY-MM-DD HH:mm:ss A') : '--';
                            value.break_end = row.out_time ? moment(row.out_time).format('YYYY-MM-DD HH:mm:ss A') : '--';
                        }
                    }
                    else {
                        for (const value of values) {
                            value.break_name = '--';
                            value.break_start = '--';
                            value.break_end = '--';
                        }
                    }
                }

                res.status(StatusCodes.OK).json({
                    status: true,
                    message: 'Fetched successfully',
                    data: values,
                    pageDetails: pageDetails,
                });
            } else {
                res.status(StatusCodes.OK).json({
                    status: false,
                    message: 'data not found',
                });
            }
        } else {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: 'Please select date range' });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const getAllUsersTodayClockIn = async (req, res) => {
    try {
        const currentDate = moment();
        const todayDate = moment(currentDate).format('YYYY-MM-DD');
        const superAdminId = process.env.SUPER_ADMIN_ROLE_ID;

        //dynamic pagination starts here

        const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;

        const countSelectQuery = `SELECT COUNT(*) as total FROM attendances WHERE user_id != ? AND attendances.status = ?  AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND attendances.out_time IS NULL`;

        constTotalLength = await db.query(countSelectQuery, [
            superAdminId,
            'incomplete',
            todayDate,
        ]);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';
        var queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != '') {
            searchDataCondition = 'AND users.name LIKE ? ';
            queryParams.unshift(`%${searchData}%`);
        }

        //pagination ends here
        var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image FROM attendances LEFT JOIN users ON users.id=attendances.user_id WHERE attendances.user_id != ? AND attendances.status = ?  AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND attendances.out_time IS NULL ${searchDataCondition}  ORDER BY attendances.id DESC LIMIT ?, ?`;

        queryParams.unshift(superAdminId, 'incomplete', todayDate);

        const queryResults = await db.query(selectQuery, queryParams);

        if (queryResults.length > process.env.VALUE_ZERO) {
            var values = [];

            for (const row of queryResults) {
                values.push({
                    id: row.id,
                    user_name: row.name,
                    user_image: row.image,
                    date: moment(row.in_time).format('YYYY-MM-DD'),
                    status: 'Clock in at ' + moment(row.in_time).format('HH:mm:ss A'),
                });
            }
            var pageDetails = [];
            pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total });
            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: values,
                pageDetails: pageDetails,
            });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const getAllUsersTodayClockOut = async (req, res) => {
    try {
        const currentDate = moment();
        const todayDate = moment(currentDate).format('YYYY-MM-DD');
        const superAdminId = process.env.SUPER_ADMIN_ROLE_ID;

        //dynamic pagination starts here

        const pageSize = parseInt(req.query.pageSize) || moment().daysInMonth();
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        var totalPages = process.env.VALUE_ZERO;

        const countSelectQuery = `SELECT COUNT(*) as total FROM attendances WHERE user_id != ? AND attendances.status = ?  AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND attendances.out_time IS NULL`;

        constTotalLength = await db.query(countSelectQuery, [
            superAdminId,
            'incomplete',
            todayDate,
        ]);
        totalPages = Math.round(constTotalLength[0].total / pageSize);
        const total = constTotalLength[0].total;
        const pageFirstResult = (currentPage - 1) * pageSize;

        var searchDataCondition = '';
        var queryParams = [pageFirstResult, pageSize];

        if (searchData != null && searchData != '') {
            searchDataCondition = 'AND users.name LIKE ? ';
            queryParams.unshift(`%${searchData}%`);
        }

        //pagination ends here

        var selectQuery = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.created_at, users.name, users.image FROM attendances LEFT JOIN users ON users.id=attendances.user_id WHERE attendances.status = ?  AND DATE_FORMAT(attendances.in_time, '%Y-%m-%d') = ? AND attendances.out_time IS NOT NULL ${searchDataCondition}  ORDER BY attendances.id DESC LIMIT ?, ?`;

        queryParams.unshift('incomplete', todayDate);

        const queryResults = await db.query(selectQuery, queryParams);

        if (queryResults.length > process.env.VALUE_ZERO) {
            var values = [];

            for (const row of queryResults) {
                values.push({
                    id: row.id,
                    user_name: row.name,
                    user_image: row.image,
                    date: moment(row.in_time).format('YYYY-MM-DD'),
                    status: 'Clock out at ' + moment(row.out_time).format('HH:mm:ss A'),
                });
            }
            var pageDetails = [];
            pageDetails.push({ pageSize, currentPage, currentPage, totalPages, total });
            res.status(StatusCodes.OK).json({
                status: true,
                message: 'Fetched successfully',
                data: values,
                pageDetails: pageDetails,
            });
        } else {
            res.status(StatusCodes.OK).json({ status: false, message: 'Data not found' });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const markUserClockInClockOutBySuperAdmin = async (req, res) => {
    try {
        const { id, type } = req.body;
        const currentDate = moment();
        const currentDateTime = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
        const updatedAt = currentDateTime;
        const validation = Joi.object({
            id: Joi.number().required(),
            type: Joi.string().required(),
        });

        const { error } = validation.validate(req.body);
        if (error)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ status: false, message: error.message });

        // get today attendance of users
        const selectQuery = await db.query(`SELECT * FROM attendances WHERE id = ?`, id);
        const lastId = selectQuery[0].id;

        if (type === 'clock in') {
            var updateQuery = `UPDATE attendances SET status = 'incomplete', in_time = ?, out_time = ?, updated_at = ? WHERE id = ?`;
            var queryResult = await db.query(updateQuery, [
                currentDateTime,
                null,
                updatedAt,
                lastId,
            ]);
        } else {
            var updateQuery = `UPDATE attendances SET out_time = ?, updated_at = ? WHERE id = ?`;
            var queryResult = await db.query(updateQuery, [currentDateTime, updatedAt, lastId]);
        }

        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            res.status(StatusCodes.OK).json({
                status: true,
                message: 'User marked ' + type + ' successfully',
            });
        } else {
            res.status(StatusCodes.FORBIDDEN).json({
                status: false,
                message: 'Error! user not marked ' + type,
            });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ status: false, message: error.message });
    }
};

const createManuallyClockInClockOut = async (req, res) => {
    try {
        const { user_ids, in_time, out_time, is_default_time, note, attendance_status } = req.body;
        // Validate input data here

        const validationSchema = Joi.object({
            user_ids: Joi.required(),
            in_time: Joi.required(),
            out_time: Joi.required(),
        }).options({ allowUnknown: true });

        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const in_time_input = is_default_time ? moment(new Date()).format('YYYY-MM-DD') + ' ' + '09:00:00' : in_time;
        const out_time_input = is_default_time ? moment(new Date()).format('YYYY-MM-DD') + ' ' + '18:00:00' : out_time;

        const insertQuery = `INSERT INTO attendances (status, user_id, in_time, out_time, attendance_type, attendance_mark_by, attendance_mark_status, note, attendance_status) VALUES ?`;

        const attendanceDataArray = user_ids.map(user_id => {
            const status = 'incomplete';
            const attendance_type = '2';
            const attendance_mark_by = req.user.user_id;
            const attendance_mark_status = '2';

            return [
                status,
                user_id,
                in_time_input,
                out_time_input,
                attendance_type,
                attendance_mark_by,
                attendance_mark_status,
                note,
                attendance_status,
            ];
        });

        const queryResult = await db.query(insertQuery, [attendanceDataArray]);

        if (queryResult.affectedRows > 0) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Attendance marked successfully',
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: 'Error! Something went wrong, please try again later',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


// mark attendance in bulk;

const parseDateRange = (range, month, year) => {
    const [startDay, endDay] = range.split('-').map(Number);

    // Create start and end dates using moment
    const startDate = moment({ year, month: month - 1, day: startDay }).startOf('day');
    const endDate = moment({ year, month: month - 1, day: endDay }).endOf('day');

    let dates = [];

    // Loop through the dates from startDate to endDate
    for (let d = startDate; d.isSameOrBefore(endDate); d.add(1, 'day')) {
        // Push the date to the array
        dates.push(d.toDate());
    }

    return dates;
};


const markAttendanceInBulk = async (req, res) => {
    try {
        const { user_ids, attendance_status, date, month } = req.body;

        // Validate input data
        const validationSchema = Joi.object({
            user_ids: Joi.array().items(Joi.number()).required(),
            date: Joi.array().items(Joi.string().pattern(/^\d+-\d+$/)).required(),
            month: Joi.number().min(1).max(12).required(),
            attendance_status: Joi.string().required()
        }).options({ allowUnknown: true });

        const { error } = validationSchema.validate(req.body);

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }

        const currentYear = new Date().getFullYear();
        let allDates = [];
        date.forEach(range => {
            allDates = allDates.concat(parseDateRange(range, month, currentYear));
        });

        const attendanceDataArray = [];

        for (const user_id of user_ids) {
            for (const attendanceDate of allDates) {
                // Check if attendance data already exists
                const existingRecord = await db.query(
                    `SELECT 1 FROM attendances WHERE user_id = ? AND DATE(in_time) = ?`,
                    [user_id, attendanceDate]
                );

                if (existingRecord.length > 0) {
                    // Update existing record
                    const updateQuery = `
                        UPDATE attendances 
                        SET attendance_status = ? 
                        WHERE user_id = ? AND DATE(in_time) = ?`;
                    await db.query(updateQuery, [attendance_status, user_id, attendanceDate]);
                } else {
                    // Insert new record
                    const status = 'incomplete';
                    const attendance_type = '2';
                    const attendance_mark_by = req.user.user_id;
                    const attendance_mark_status = '2';

                    attendanceDataArray.push([
                        status,
                        user_id,
                        attendanceDate,
                        attendanceDate,
                        attendance_type,
                        attendance_mark_by,
                        attendance_mark_status,
                        '',
                        attendance_status,
                    ]);
                }
            }
        }

        if (attendanceDataArray.length > 0) {
            const insertQuery = `INSERT INTO attendances (status, user_id, in_time, out_time, attendance_type, attendance_mark_by, attendance_mark_status, note, attendance_status) VALUES ?`;
            const queryResult = await db.query(insertQuery, [attendanceDataArray]);

            if (queryResult.affectedRows > 0) {
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message: 'Attendance marked successfully',
                });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: false,
                    message: 'Error! Something went wrong, please try again later',
                });
            }
        } else {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Attendance updated successfully',
            });
        }
    } catch (error) {
        console.error(error.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};


const markAttendance = async (req, res) => {
    try {
        const { user_id, in_time, out_time, is_default_time, note, attendance_status } = req.body;

        const validationSchema = Joi.object({
            user_id: Joi.number().required(),
            in_time: Joi.required(),
            out_time: Joi.required(),
        }).options({ allowUnknown: true });

        const { error } = validationSchema.validate(req.body);



        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: error.message,
            });
        }
        var in_time_input;
        var out_time_input;
        var todayDate = '';
        if (is_default_time) {
            todayDate = moment(new Date()).format('YYYY-MM-DD');
            in_time_input = todayDate + ' ' + '09:00:00';
            out_time_input = todayDate + ' ' + '18:00:00';
        } else {
            todayDate = moment(in_time).format('YYYY-MM-DD');
            in_time_input = in_time;
            out_time_input = out_time;
        }
        var queryResult = '';


        const selectedData = await db.query(`SELECT * FROM attendances WHERE user_id="${user_id}"  AND date(in_time) = "${todayDate}" ORDER BY attendances.id  ASC LIMIT 1;`);
        const status = 'incomplete';
        const attendance_type = '2';
        const attendance_mark_by = req.user.user_id;
        const attendance_mark_status = '2';


        if (selectedData.length > 0) {

            const updateQuery = `UPDATE attendances SET status='${status}',user_id='${user_id}',in_time='${in_time_input}',out_time='${out_time_input}',attendance_type='${attendance_type}',attendance_mark_by='${attendance_mark_by}',attendance_mark_status='${attendance_mark_status}',attendance_status='${attendance_status}',note='${note}',attendance_status='${attendance_status}' WHERE id='${selectedData[0].id}'`;
            queryResult = await db.query(updateQuery);
        } else {
            const insertQuery = `INSERT INTO attendances (status, user_id, in_time, out_time, attendance_type, attendance_mark_by, attendance_mark_status, note, attendance_status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const insertValues = [
                status,
                user_id,
                in_time_input,
                out_time_input,
                attendance_type,
                attendance_mark_by,
                attendance_mark_status,
                note,
                attendance_status,
            ];

            queryResult = await db.query(insertQuery, insertValues);
        }
        if (queryResult.affectedRows > process.env.VALUE_ZERO) {
            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Attendance marked successfully',
            });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: 'Error! something went wrong, please try again later',
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error,
        });
    }
};

const getAllUserTimeSheetInCalendarView = async (req, res) => {
    try {

        const monthYear = req.query.yearMonth || moment(new Date()).format('YYYY-MM');


        //pagination start here
        const pageSize = parseInt(req.query.pageSize) || process.env.DEFAULT_PAGE_SIZE;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const searchData = req.query.search || '';
        const pageFirstResult = (currentPage - 1) * pageSize;
        const searchColumns = ['name', 'employee_id', 'department'];
        const searchConditions = [];

        if (searchData != null && searchData != '') {
            searchColumns.forEach((column) => {
                searchConditions.push(`${column} LIKE '%${searchData}%'`);
            });
        }

        // get all active users
        const activeUsers = await db.query(`SELECT id, name, image, employee_id, department FROM users WHERE status = ?`, [process.env.ACTIVE_STATUS]);

        if (activeUsers.length > process.env.VALUE_ZERO) {
            // get users daily attendance report of monthly
            for (const user of activeUsers) {
                const attendanceReport = await getUserDailyAttendanceOfMonth(user.id, monthYear);
                user.total_pay_days = attendanceReport.totalPayDays;
                user.attendanceReports = attendanceReport.dayAttendanceStatus;
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: activeUsers
                });
        }



    } catch (error) {
        console.error(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }
};

const getSingleUserAttendanceTimeSheetInCalendarView = async (req, res) => {

    try {

        const id = req.params.id;
        const { error } = checkPositiveInteger.validate({ id });

        if (error) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    status: false,
                    message: error.message
                });
        }

        const monthYear = req.query.yearMonth || moment(new Date()).format('YYYY-MM');

        // get all active users
        const activeUsers = await db.query(`SELECT id, name, employee_id, department FROM users WHERE id = ?`, [id]);

        if (activeUsers.length > process.env.VALUE_ZERO) {
            // get users daily attendance report of monthly
            for (const user of activeUsers) {
                const attendanceReport = await getSingleUserDailyAttendanceOfMonth(user.id, monthYear);
                user.total_pay_days = attendanceReport.totalPayDays;
                user.attendanceReports = attendanceReport.dayAttendanceStatus;
            }

            return res
                .status(StatusCodes.OK)
                .json({
                    status: true,
                    message: "Fetched successfully",
                    data: activeUsers[0]
                });
        }



    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: error.message,
        });
    }

}

async function getUserDailyAttendanceOfMonth(user_id, monthYear) {
    const totalDaysInMonth = moment(monthYear, 'YYYY-MM').daysInMonth();

    // const query = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.attendance_status, attendances.created_at FROM attendances WHERE attendances.user_id = '${user_id}' AND attendances.status = 'incomplete' AND DATE_FORMAT(attendances.in_time, '%Y-%m') = '${monthYear}' GROUP BY DATE(attendances.in_time) ORDER BY DATE(attendances.in_time)`;

    const query = `SELECT 
    MAX(attendances.id) AS id,
    MAX(attendances.status) AS status,
    MAX(attendances.break_type) AS break_type,
    MAX(attendances.user_id) AS user_id,
    MAX(attendances.in_time) AS in_time,
    MAX(attendances.out_time) AS out_time,
    MAX(attendances.attendance_status) AS attendance_status,
    MAX(attendances.created_at) AS created_at
FROM 
    attendances
WHERE 
    attendances.user_id = '${user_id}' 
    AND attendances.status = 'incomplete' 
    AND DATE_FORMAT(attendances.in_time, '%Y-%m') = '${monthYear}'
GROUP BY 
    DATE(attendances.in_time)
ORDER BY 
    DATE(attendances.in_time);
    `
    const queryResult = await db.query(query);

    const dayAttendanceStatus = new Array(totalDaysInMonth).fill('AB');
    let totalPayDays = 0;
    const sundays = [];

    if (queryResult.length > process.env.VALUE_ZERO) {
        //get attendance with status
        for (const row of queryResult) {
            const day = moment(row.in_time).date(); // Get the day of the attendance

            if (row.attendance_status === '1') {
                dayAttendanceStatus[day - 1] = 'AB'; // Subtract 1 as array is 0-indexed
            } else if (row.attendance_status === '2') {
                dayAttendanceStatus[day - 1] = 'P';
                totalPayDays += 1; // Full pay day
            } else {
                dayAttendanceStatus[day - 1] = 'HF';
                totalPayDays += 0.5; // Half pay day
            }

        }

        return { dayAttendanceStatus, totalPayDays };
    }
    else {
        return { dayAttendanceStatus, totalPayDays };
    }
}

async function getSingleUserDailyAttendanceOfMonth(user_id, monthYear) {
    const totalDaysInMonth = moment(monthYear, 'YYYY-MM').daysInMonth();
    const query = `SELECT attendances.id, attendances.status, attendances.break_type, attendances.user_id, attendances.in_time, attendances.out_time, attendances.attendance_status, attendances.created_at FROM attendances WHERE attendances.user_id = ? AND attendances.status = ? AND DATE_FORMAT(attendances.in_time, '%Y-%m') = ? GROUP BY DATE(attendances.in_time) ORDER BY DATE(attendances.in_time)`;

    const queryResult = await db.query(query, [user_id, 'incomplete', monthYear]);

    const dayAttendanceStatus = new Array(totalDaysInMonth).fill('AB');
    let totalPayDays = 0;

    if (queryResult.length > process.env.VALUE_ZERO) {
        for (const row of queryResult) {
            const day = moment(row.in_time).date(); // Get the day of the attendance

            if (row.attendance_status === '1') {
                dayAttendanceStatus[day - 1] = 'AB'; // Subtract 1 as array is 0-indexed
            } else if (row.attendance_status === '2') {
                dayAttendanceStatus[day - 1] = 'P';
                totalPayDays += 1; // Full pay day
            } else {
                dayAttendanceStatus[day - 1] = 'HF';
                totalPayDays += 0.5; // Half pay day
            }
        }
    }

    const attendanceDataWithNumbers = [];

    for (let day = 1; day <= totalDaysInMonth; day++) {
        const fullDate = moment(`${monthYear}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const dayName = moment(fullDate).format('dd');
        attendanceDataWithNumbers.push({ title: dayAttendanceStatus[day - 1], date: fullDate });
    }

    return { dayAttendanceStatus: attendanceDataWithNumbers, totalPayDays };
}



module.exports = {
    clockIn,
    clockOut,
    checkClockInToday,
    startBreak,
    endBreak,
    timeSheet,
    getAttendanceChartById,
    checkTodayMarkBreakAndAttendance,
    getMonthsTotalWorkHour,
    checkTotalUsersTimeSheet,
    checkTotalUsersTimeSheetNew,
    getAllUsersTodayClockIn,
    getAllUsersTodayClockOut,
    markUserClockInClockOutBySuperAdmin,
    createManuallyClockInClockOut,
    getTimeSheetOfAllUserForSuperAdmin,
    markAttendance,
    getAllUserTimeSheetInCalendarView,
    getSingleUserAttendanceTimeSheetInCalendarView,
    markAttendanceInBulk
};
