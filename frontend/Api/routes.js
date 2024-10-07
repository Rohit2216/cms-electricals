const express = require('express')
/** * validation helper  */

const { verifySuperAdminToken, verifyContractorToken, verifyEnergyCompanyToken, verifyDealerToken, verifySubUserToken } = require('./helpers/verifyToken')

/** * Super Admin Api Controller and Method  */
const {superAdminLogin, getProfileDetails, updateProfile, changePassword, createEnergyCompany, getAllSubUserForSuperAdmin} = require('./controllers/superAdminController');
const {createRole, getAllRoles, editRole, updateRole, deleteRole} = require('./controllers/roleController')
const {createZone, getAllZones, getAllActiveZones, editZone, updateZone, deleteZone, getEnergyCompanyAssignZones} = require('./controllers/zoneController')
const {createRegionalOffice, getAllRegionalOffices, getRegionalOfficeById, getActiveRegionalOffices, editRegionalOffice, updateRegionalOffice, deleteRegionalOffice, getRegionalOfficesOnZoneId} = require('./controllers/regionalOfficeController')
const {addSalesArea, getSalesArea, getSalesAreaById, getActiveSalesArea, editSalesArea, updateSalesArea, deleteSalesArea, getSaleAreaOnRoId} = require('./controllers/salesAreaController')
const {addDistrict, getDistricts, getDistrictById, getActiveDistricts, editDistrictById, updateDistrictById, removeDistrictById, getAllDistrictBySaleAreaId} = require('./controllers/districtController')
const {addOutlet, getAllOutlet, getOutletById, editOutlet, updateOutlet, removeOutletById} = require('./controllers/outletController')

const {addSaleCompany, getSaleCompanies, getSaleCompanyById, editSalesCompany, updateSalesCompany, removeSalesCompanyById} = require('./controllers/saleCompanyController')
const { addPurchaseCompany, getPurchaseCompany, getPurchaseCompanyById, editPurchaseCompany, updatePurchaseCompanyById, deletePurchaseCompanyById} = require('./controllers/purchaseCompanyController')

const {createCompany, getMyCompany, getMyCompanySingleDetailsById, updateMyCompanyDetails, deleteMyCompany, getCompanyTypes} = require('./controllers/companyController')

const {getAllModule} = require('./controllers/moduleController')
const {getAllSubModule, getSubModuleWithModuleName, getSubModuleByModuleId} = require('./controllers/subModuleController')


const {setPermissionOnRoleBasis, checkPermittedModuleOnRoleBasis, getAllPermittedModuleNameOnRoleBasis, updatePermissionOnRoleBasis} = require('./controllers/permissionController')

const {addComplaintType, getAllComplaintTypes, getComplaintTypeById, updateComplaintType, updateComplaintStatus} = require('./controllers/complaintTypeController')

const {addComplaintSubType, getAllComplaintSubTypes, getComplaintSubTypeById, updateComplaintSubType} = require('./controllers/complaintSubTypeController')

const {createTeam, getParentTeamHead, getTeamDetailsById, updateTeamDetails, getTeamGroup} = require('./controllers/teamController')

const {getAllPendingRequests, viewSinglePendingRequestDetails, approvedSoftwareActivationRequest, rejectedSoftwareActivationRequest, deleteSoftwareActivationRequest, getAllApprovedRequests, getAllRejectedRequests} = require('./controllers/softwareActivationRequestController')

const {getAllFeedbackAndSuggestions} = require('./controllers/feedbackAndSuggestionController')

const {getEnergyCompanies, getEnergyCompaniesContacts, getEnergyCompanyZoneSubUsers, getEnergyCompanyRegionalOfficeSubUsers, getEnergyCompanySaleAreaSubUsers, getEnergyCompanySubUserDetailById, getEnergyCompanyUserDetailsById} = require('./controllers/contactController')

const {createEnergyCompanyUser, createSubUsersForEnergyCompanyZoneUser, createSubUsersForEnergyCompanyRegionalOfficeUser, createSubUsersForEnergyCompanySaleAreaUser, getEnergyCompanyDetailsById, updateEnergyCompanyDetails, updateEnergyCompanyUserDetails, updateEnergyCompanySubUserDetails, deleteEnergyCompany, deleteEnergyCompanyUser, energyCompanyDeleteSubUser, getAllActiveEnergyCompany, getAllCreatedEnergyCompany} = require('./controllers/energyCompanyController');

const {contractorCreate, getContractorById, updateContractorDetailsById, createContractorUser, getAllContractorAndUsers, getContractorAndUsersFullDetailByIdAndType, deleteContractorAndUsers} = require('./controllers/contractorController')

const {createTutorial,  getTutorials, getTutorialByFormat, updateTutorials, deleteTutorialsById} = require('./controllers/tutorialController')
const {createPlan, getAllPlans, getPlanById, updatePlanDetails, deletePlan} = require('./controllers/planController')

const {createNotifications, getNotifications, getLoggedUserNotifications, countLoggedUserUnreadNotifications, markAsReadNotifications} = require('./controllers/notificationController')

const {createItemMaster, getAllItemMasters, getSingleItemMaster, updateItemMaster, deleteItemMaster} = require('./controllers/itemMasterController')

const {createPurposeMaster, getAllPurposeMaster, getSinglePurposeMasterById, updatePurposeMaster, deletePurposeMasterById} = require('./controllers/purposeMasterController')

const {createSurvey, getAllSurvey, getSurveyById, editSurveyDetails, updateSurveyDetails, deleteSurvey, getAssignedSurvey, getRequestedSurvey, getSurveyQuestionResponse} = require('./controllers/surveyController')

const {createDocumentCategory, getAllDocumentCategory, getDocumentCategoryById, updateDocumentCategory, removeDocumentCategoryById, addDocuments, getAllDocuments, viewDocuments, getDocumentOnCategoryById, removeDocumentById} = require('./controllers/documentController')

const {createTask, getAllTaskList, getTaskById, updateTaskDetails, deleteTask, taskDashboard} = require('./controllers/taskManagerController')

const {createTaskCategory, getAllTaskCategory, getSingleTaskCategory, updateTaskCategoryDetails, removeTaskCategoryById} = require('./controllers/taskCategoryController')

const {createTaskComment, updateTaskComment, getTaskCommentDetailsById} = require('./controllers/taskActionController')

//HR Management
const {createHrTeam, getAllHrTeamWithMember, getHrTeamDetailsById, updateHrTeamDetails, deleteHrTeam} = require('./controllers/hrTeamController')

const {getAllStoredEmployeeDetails, getSingleEmployeeDetailById, updateEmployeeDetails, deleteEmployee, getEmployeeTaskById} = require('./controllers/employeeController')

const {clockIn, clockOut, checkClockInToday, startBreak, endBreak, timeSheet} = require('./controllers/attendanceController')

const {createLeaveType, getAllLeaveType, getAllActiveLeaveType, getAllLeaveTypeById, updateLeaveType, deleteLeaveType} = require('./controllers/leaveTypeController')

const {applyLeave, getAllLeaveApplications, updateLeaveApplication, getSingleLeaveApplication, leaveApplicationSoftDelete} = require('./controllers/leaveApplicationController')

const {createUsers, updateUsers, getAllManagerUsers, getEmployeeDocumentsById} = require('./controllers/userController')

const {createTermsAndConditions, getAllCreateTermsAndConditions, getCreateTermsAndConditionsDetailsById, updateTermsConditionsDetails, deleteTermsAndConditions} = require('./controllers/termsAndConditionsController')


/**Admin API Controller and Method */
const {adminLogin, getAdminProfileDetails, updateAdminProfile, adminChangePassword} = require('./controllers/adminController');



const {createDealer, createDealerUser, getDealersAndUsers, getDealerAndUserSingleRecordByIdAndType, updateDealerDetails, deleteDealerAndUsers} = require('./controllers/dealerController')

/** * user controller  */
const { createUser, login, getAllUsers } = require('./controllers/userController');

/** Sub users Controller and method */
const {createSubUser, subUserLoggedIn, getSubUserProfileDetails, updateSubUserProfileDetails, subUserChangePassword} = require('./controllers/subUserController');


const Router = express.Router()

/** * Super Admin Routes */
Router.post('/super-admin/login', superAdminLogin)
Router.get('/super-admin/profile', verifySuperAdminToken,getProfileDetails)
Router.post('/super-admin/profile-update', verifySuperAdminToken, updateProfile)
Router.post('/super-admin/change-password', verifySuperAdminToken, changePassword)
Router.post('/super-admin/create-energy-company', verifySuperAdminToken, createEnergyCompany)
Router.get('/super-admin/all-sub-users', verifySuperAdminToken, getAllSubUserForSuperAdmin)
Router.get('/super-admin/roles', verifySuperAdminToken, getAllRoles)
Router.post('/super-admin/create-role', verifySuperAdminToken, createRole)
Router.get('/super-admin/edit-role/:id', verifySuperAdminToken, editRole)
Router.post('/super-admin/update-role', verifySuperAdminToken, updateRole)
Router.delete('/super-admin/delete-role/:id', verifySuperAdminToken, deleteRole)
Router.post('/super-admin/create-zone', verifySuperAdminToken, createZone)
Router.get('/super-admin/all-zone', verifySuperAdminToken, getAllZones)
Router.get('/super-admin/all-active-zone', verifySuperAdminToken, getAllActiveZones)
Router.get('/super-admin/edit-zone/:id', verifySuperAdminToken, editZone)
Router.post('/super-admin/update-zone', verifySuperAdminToken, updateZone)
Router.delete('/super-admin/delete-zone/:id', verifySuperAdminToken, deleteZone)
Router.get('/super-admin/get-energy-company-assign-zones/:id', verifySuperAdminToken, getEnergyCompanyAssignZones)
Router.post('/super-admin/create-regional-office', verifySuperAdminToken, createRegionalOffice)
Router.get('/super-admin/all-regional-offices', verifySuperAdminToken, getAllRegionalOffices)
Router.get('/super-admin/get-regional-office/:id', verifySuperAdminToken, getRegionalOfficeById)
Router.get('/super-admin/active-regional-offices', verifySuperAdminToken, getActiveRegionalOffices)
Router.get('/super-admin/edit-regional-office/:id', verifySuperAdminToken, editRegionalOffice)
Router.post('/super-admin/update-regional-office', verifySuperAdminToken, updateRegionalOffice)
Router.delete('/super-admin/delete-regional-office/:id', verifySuperAdminToken, deleteRegionalOffice)
Router.get('/super-admin/get-all-regional-office-on-zone-id/:id', verifySuperAdminToken, getRegionalOfficesOnZoneId)
Router.post('/super-admin/add-sales-area', verifySuperAdminToken, addSalesArea)
Router.get('/super-admin/sales-area', verifySuperAdminToken, getSalesArea)
Router.get('/super-admin/sales-area-by-id/:id', verifySuperAdminToken, getSalesAreaById)
Router.get('/super-admin/active-sales-area', verifySuperAdminToken, getActiveSalesArea)
Router.get('/super-admin/edit-sales-area/:id', verifySuperAdminToken, editSalesArea)
Router.post('/super-admin/update-sales-area', verifySuperAdminToken, updateSalesArea)
Router.delete('/super-admin/delete-sales-area/:id', verifySuperAdminToken, deleteSalesArea)
Router.get('/super-admin/get-all-sales-area-on-ro-id/:id', verifySuperAdminToken, getSaleAreaOnRoId)
Router.post('/super-admin/add-district', verifySuperAdminToken, addDistrict)
Router.get('/super-admin/all-districts', verifySuperAdminToken, getDistricts)
Router.get('/super-admin/get-district/:id', verifySuperAdminToken, getDistrictById)
Router.get('/super-admin/active-districts', verifySuperAdminToken, getActiveDistricts)
Router.get('/super-admin/edit-district/:id', verifySuperAdminToken, editDistrictById)
Router.post('/super-admin/update-district', verifySuperAdminToken, updateDistrictById)
Router.delete('/super-admin/delete-district/:id', verifySuperAdminToken, removeDistrictById)
Router.get('/super-admin/get-all-district-on-sale-area-id/:id', verifySuperAdminToken, getAllDistrictBySaleAreaId)
Router.post('/super-admin/add-outlet', verifySuperAdminToken, addOutlet)
Router.get('/super-admin/all-outlets', verifySuperAdminToken, getAllOutlet)
Router.get('/super-admin/get-outlet/:id', verifySuperAdminToken, getOutletById)
Router.get('/super-admin/edit-outlet/:id', verifySuperAdminToken, editOutlet)
Router.post('/super-admin/update-outlet', verifySuperAdminToken, updateOutlet)
Router.delete('/super-admin/delete-outlet/:id', verifySuperAdminToken, removeOutletById)
Router.post('/super-admin/add-sale-company', verifySuperAdminToken, addSaleCompany)
Router.get('/super-admin/all-sale-companies', verifySuperAdminToken, getSaleCompanies)
Router.get('/super-admin/get-sale-company/:id', verifySuperAdminToken, getSaleCompanyById)
Router.get('/super-admin/edit-sale-company/:id', verifySuperAdminToken, editSalesCompany)
Router.post('/super-admin/update-sale-company', verifySuperAdminToken, updateSalesCompany)
Router.delete('/super-admin/delete-sale-company/:id', verifySuperAdminToken, removeSalesCompanyById)
Router.post('/super-admin/create-company', verifySuperAdminToken, createCompany)
Router.get('/super-admin/get-my-company-list', verifySuperAdminToken, getMyCompany)
Router.get('/super-admin-get-my-company-single-details/:id', verifySuperAdminToken, getMyCompanySingleDetailsById)
Router.post('/super-admin/update-my-company-details', verifySuperAdminToken, updateMyCompanyDetails)
Router.post('/super-admin/delete-my-company/:id', verifySuperAdminToken, deleteMyCompany)
Router.get('/super-admin/get-company-types', verifySuperAdminToken, getCompanyTypes)
Router.post('/super-admin/add-purchase-company', verifySuperAdminToken, addPurchaseCompany)
Router.get('/super-admin/all-purchase-companies', verifySuperAdminToken, getPurchaseCompany)
Router.get('/super-admin/get-purchase-company/:id', verifySuperAdminToken, getPurchaseCompanyById)
Router.get('/super-admin/edit-purchase-company/:id', verifySuperAdminToken, editPurchaseCompany)
Router.post('/super-admin/update-purchase-company', verifySuperAdminToken, updatePurchaseCompanyById)
Router.delete('/super-admin/delete-purchase-company/:id', verifySuperAdminToken, deletePurchaseCompanyById)
Router.post('/super-admin/create-sub-user', verifySuperAdminToken, createSubUser)
Router.get('/super-admin/get-all-module', verifySuperAdminToken, getAllModule)
Router.get('/super-admin/get-all-sub-module', verifySuperAdminToken, getAllSubModule)
Router.get('/super-admin/get-sub-module-with-module-name', verifySuperAdminToken, getSubModuleWithModuleName)
Router.get('/super-admin/get-sub-module-by-module-id/:id', verifySuperAdminToken, getSubModuleByModuleId)
Router.post('/super-admin/set-permission-on-role-basis', verifySuperAdminToken, setPermissionOnRoleBasis)
Router.post('/super-admin/create-complaint-type', verifySuperAdminToken, addComplaintType)
Router.get('/super-admin/all-complaint-types', verifySuperAdminToken, getAllComplaintTypes)
Router.get('/super-admin/get-complaint-type/:id', verifySuperAdminToken, getComplaintTypeById)
Router.post('/super-admin/update-complaint-type', verifySuperAdminToken, updateComplaintType)
Router.post('/super-admin/update-complaint-status', verifySuperAdminToken, updateComplaintStatus)
Router.post('/super-admin/create-complaint-sub-type', verifySuperAdminToken, addComplaintSubType)
Router.get('/super-admin/get-all-complaints-sub-types', verifySuperAdminToken, getAllComplaintSubTypes)
Router.get('/super-admin/get-single-complaint-sub-type/:id', verifySuperAdminToken, getComplaintSubTypeById)
Router.post('/super-admin/update-complaint-sub-types-details', verifySuperAdminToken, updateComplaintSubType)
Router.post('/super-admin/create-team', verifySuperAdminToken, createTeam)
Router.get('/super-admin/get-parent-team-head', verifySuperAdminToken, getParentTeamHead)
Router.get('/super-admin/get-team-details/:id', verifySuperAdminToken, getTeamDetailsById)
Router.post('/super-admin/update-team-details', verifySuperAdminToken, updateTeamDetails)
Router.get('/super-admin/get-team-group', verifySuperAdminToken, getTeamGroup)
Router.get('/super-admin/pending-software-activation-request', verifySuperAdminToken, getAllPendingRequests)
Router.get('/super-admin/view-pending-request-details/:id', verifySuperAdminToken, viewSinglePendingRequestDetails)
Router.post('/super-admin/approved-software-activation-request/:id', verifySuperAdminToken, approvedSoftwareActivationRequest)
Router.post('/super-admin/rejected-software-activation-request/:id', verifySuperAdminToken, rejectedSoftwareActivationRequest)
Router.delete('/super-admin/delete-software-activation-request/:id', verifySuperAdminToken, deleteSoftwareActivationRequest)
Router.get('/super-admin/get-all-approved-software-activation-requests', verifySuperAdminToken, getAllApprovedRequests)
Router.get('/super-admin/get-all-rejected-software-activation-requests', verifySuperAdminToken, getAllRejectedRequests)
Router.get('/super-admin/feedback-and-suggestions', verifySuperAdminToken, getAllFeedbackAndSuggestions)
Router.get('/super-admin/get-all-energy-companies', verifySuperAdminToken, getEnergyCompanies)
Router.get('/super-admin/energy-companies-contacts-details/:id', verifySuperAdminToken, getEnergyCompaniesContacts)
Router.get('/super-admin/get-energy-company-zone-sub-users/:zone_id/:user_id', verifySuperAdminToken, getEnergyCompanyZoneSubUsers)
Router.get('/super-admin/get-energy-company-regional-office-sub-users/:regional_id/:user_id', verifySuperAdminToken, getEnergyCompanyRegionalOfficeSubUsers)
Router.get('/super-admin/get-energy-company-sale-area-sub-users/:sale_area_id/:user_id', verifySuperAdminToken, getEnergyCompanySaleAreaSubUsers)
Router.get('/super-admin/get-energy-company-user-details/:id', verifySuperAdminToken, getEnergyCompanyUserDetailsById)
Router.get('/super-admin/get-energy-company-sub-user-details/:id', verifySuperAdminToken, getEnergyCompanySubUserDetailById)
Router.get('/super-admin/get-energy-company-details/:id', verifySuperAdminToken, getEnergyCompanyDetailsById)
Router.post('/super-admin/update-energy-company-details', verifySuperAdminToken, updateEnergyCompanyDetails)
Router.post('/super-admin/update-energy-company-user-details', verifySuperAdminToken, updateEnergyCompanyUserDetails)
Router.post('/super-admin/update-energy-company-sub-user-details', verifySuperAdminToken, updateEnergyCompanySubUserDetails)
Router.post('/super-admin/energy-company-delete/:id', verifySuperAdminToken, deleteEnergyCompany)
Router.post('/super-admin/energy-company-delete-user/:id', verifySuperAdminToken, deleteEnergyCompanyUser)
Router.delete('/super-admin/energy-company-delete-sub-user/:id', verifySuperAdminToken, energyCompanyDeleteSubUser)
Router.get('/super-admin/get-active-energy-companies', verifySuperAdminToken, getAllActiveEnergyCompany)
Router.get('/super-admin/get-all-energy-company', verifySuperAdminToken, getAllCreatedEnergyCompany)
Router.post('/super-admin/create-contractor', verifySuperAdminToken, contractorCreate)
Router.get('/super-admin/get-single-contractor-details/:id', verifySuperAdminToken, getContractorById)
Router.post('/super-admin/update-contractor-details', verifySuperAdminToken, updateContractorDetailsById)
Router.post('/super-admin/create-contractor-users', verifySuperAdminToken, createContractorUser)
Router.get('/super-admin/get-all-contractors-and-users', verifySuperAdminToken, getAllContractorAndUsers)
Router.get('/super-admin/get-contractors-and-users-details/:id/:type', verifySuperAdminToken, getContractorAndUsersFullDetailByIdAndType)
Router.post('/super-admin/delete-contractors-and-users/:id/:type', verifySuperAdminToken, deleteContractorAndUsers)
Router.post('/super-admin/create-dealer-account', verifySuperAdminToken, createDealer)
Router.post('/super-admin/create-dealer-users', verifySuperAdminToken, createDealerUser)
Router.get('/super-admin/get-all-dealers-and-users', verifySuperAdminToken, getDealersAndUsers)
Router.get('/super-admin/get-dealers-and-users-details/:id/:type', verifySuperAdminToken, getDealerAndUserSingleRecordByIdAndType)
Router.post('/super-admin/update-dealers-and-users-details', verifySuperAdminToken, updateDealerDetails)
Router.delete('/super-admin/delete-dealer-and-user/:id/:type', verifySuperAdminToken, deleteDealerAndUsers)
Router.post('/super-admin/create-tutorial', verifySuperAdminToken, createTutorial)
Router.get('/super-admin/get-all-tutorials', verifySuperAdminToken, getTutorials)
Router.get('/super-admin/get-single-tutorial-details/:format', verifySuperAdminToken, getTutorialByFormat)
Router.post('/super-admin/update-tutorial-details', verifySuperAdminToken, updateTutorials)
Router.delete('/super-admin/delete-tutorial/:id', verifySuperAdminToken, deleteTutorialsById)
Router.post('/super-admin/create-plan', verifySuperAdminToken, createPlan)
Router.get('/super-admin/get-all-plans', verifySuperAdminToken, getAllPlans)
Router.get('/super-admin/get-plan-details/:id', verifySuperAdminToken, getPlanById)
Router.post('/super-admin/update-plan-details', verifySuperAdminToken, updatePlanDetails)
Router.delete('/super-admin/delete-plan/:id', verifySuperAdminToken, deletePlan)
Router.post('/super-admin/create-notifications', verifySuperAdminToken, createNotifications)
Router. get('/super-admin/get-all-notifications', verifySuperAdminToken, getNotifications)
Router. get('/super-admin/get-logged-user-notifications', verifySuperAdminToken, getLoggedUserNotifications)
Router. get('/super-admin/count-logged-user-unread-notifications', verifySuperAdminToken,countLoggedUserUnreadNotifications)
Router.post('/super-admin/mark-as-read-notifications', verifySuperAdminToken, markAsReadNotifications)
Router.post('/super-admin/create-item-master', verifySuperAdminToken, createItemMaster)
Router.get('/super-admin/get-all-item-masters', verifySuperAdminToken, getAllItemMasters)
Router.get('/super-admin/get-item-master-details/:id', verifySuperAdminToken, getSingleItemMaster)
Router.post('/super-admin/update-item-master-details', verifySuperAdminToken, updateItemMaster)
Router.delete('/super-admin/delete-item-master/:id', verifySuperAdminToken, deleteItemMaster)
Router.post('/super-admin/create-purpose-master', verifySuperAdminToken, createPurposeMaster)
Router.get('/super-admin/get-all-purpose-master', verifySuperAdminToken, getAllPurposeMaster)
Router.get('/super-admin/get-single-purpose-master/:id', verifySuperAdminToken, getSinglePurposeMasterById)
Router.post('/super-admin/update-purpose-master', verifySuperAdminToken, updatePurposeMaster)
Router.delete('/super-admin/delete-purpose-master/:id', verifySuperAdminToken, deletePurposeMasterById)
Router.post('/super-admin/create-survey', verifySuperAdminToken, createSurvey)
Router.get('/super-admin/get-all-surveys', verifySuperAdminToken, getAllSurvey)
Router.get('/super-admin/get-survey-by-id/:id', verifySuperAdminToken, getSurveyById)
Router.get('/super-admin/edit-survey-details/:id', verifySuperAdminToken, editSurveyDetails)
Router.post('/super-admin/update-survey-details', verifySuperAdminToken, updateSurveyDetails)
Router.post('/super-admin/delete-survey-details/:id', verifySuperAdminToken, deleteSurvey)
Router.get('/super-admin/get-assign-survey', verifySuperAdminToken, getAssignedSurvey)
Router.get('/super-admin/get-requested-survey', verifySuperAdminToken, getRequestedSurvey)
Router.get('/super-admin/get-all-survey-response', verifySuperAdminToken, getSurveyQuestionResponse)
Router.post('/super-admin/create-document-category', verifySuperAdminToken, createDocumentCategory)
Router.get('/super-admin/get-all-document-categories', verifySuperAdminToken, getAllDocumentCategory)
Router.get('/super-admin/get-document-category-details/:id', verifySuperAdminToken, getDocumentCategoryById)
Router.post('/super-admin/update-document-category-details', verifySuperAdminToken, updateDocumentCategory)
Router.delete('/super-admin/delete-document-category/:id', verifySuperAdminToken, removeDocumentCategoryById)
Router.post('/super-admin/add-documents', verifySuperAdminToken, addDocuments)
Router.get('/super-admin/get-all-document', verifySuperAdminToken, getAllDocuments)
Router.get('/super-admin/view-document/:id', verifySuperAdminToken, viewDocuments)
Router.get('/super-admin/get-document-on-category-id/:id', verifySuperAdminToken, getDocumentOnCategoryById)
Router.delete('/super-admin/delete-document/:id', verifySuperAdminToken, removeDocumentById) 
Router.post('/super-admin/create-task', verifySuperAdminToken, createTask)
Router.get('/super-admin/get-task-lists', verifySuperAdminToken, getAllTaskList)
Router.get('/super-admin/get-task-single-list/:id', verifySuperAdminToken, getTaskById)
Router.post('/super-admin/update-task-list', verifySuperAdminToken, updateTaskDetails)
Router.delete('/super-admin/delete-task/:id', verifySuperAdminToken, deleteTask)
Router.get('/super-admin/get-task-status-for-dashboard', verifySuperAdminToken, taskDashboard)
Router.post('/super-admin/create-task-category', verifySuperAdminToken, createTaskCategory)
Router.get('/super-admin/get-all-task-category', verifySuperAdminToken, getAllTaskCategory)
Router.get('/super-admin/get-single-task-category/:id', verifySuperAdminToken, getSingleTaskCategory)
Router.post('/super-admin/update-task-category', verifySuperAdminToken, updateTaskCategoryDetails)
Router.delete('/super-admin/delete-task-category/:id', verifySuperAdminToken, removeTaskCategoryById)
Router.post('/super-admin/add-task-comment', verifySuperAdminToken, createTaskComment)
Router.post('/super-admin/update-task-comment', verifySuperAdminToken, updateTaskComment)
Router.get('/super-admin/get-task-comment-details/:id', verifySuperAdminToken, getTaskCommentDetailsById)

//HR management
Router.post('/super-admin/create-hr-team', verifySuperAdminToken, createHrTeam)
Router.get('/super-admin/get-all-hr-teams', verifySuperAdminToken, getAllHrTeamWithMember)
Router.get('/super-admin/get-single-hr-team-detail/:id', verifySuperAdminToken, getHrTeamDetailsById)
Router.post('/super-admin/update-hr-team-details', verifySuperAdminToken, updateHrTeamDetails)
Router.delete('/super-admin/delete-hr-team/:team_id', verifySuperAdminToken, deleteHrTeam)

Router.get('/super-admin/get-all-employees', verifySuperAdminToken, getAllStoredEmployeeDetails)
Router.get('/super-admin/get-single-employee-detail/:id', verifySuperAdminToken, getSingleEmployeeDetailById)
Router.post('/super-admin/update-single-employee-detail', verifySuperAdminToken, updateEmployeeDetails)
Router.post('/super-admin/delete-employee/:id', verifySuperAdminToken, deleteEmployee)
Router.get('/super-admin/get-employee-assign-tasks', verifySuperAdminToken, getEmployeeTaskById)

Router.post('/super-admin/create-leave-type', verifySuperAdminToken, createLeaveType)
Router.get('/super-admin/get-all-leave-type', verifySuperAdminToken, getAllLeaveType)
Router.get('/super-admin/get-active-leave-type', verifySuperAdminToken, getAllActiveLeaveType)
Router.get('/super-admin/get-leave-type-by-id/:id', verifySuperAdminToken, getAllLeaveTypeById)
Router.post('/super-admin/update-leave-type-details', verifySuperAdminToken, updateLeaveType)
Router.delete('/super-admin/delete-leave-type/:id', verifySuperAdminToken, deleteLeaveType)

Router.post('/super-admin/leave-application-status-update', verifySuperAdminToken, updateLeaveApplication)
Router.get('/super-admin/get-single-leave-application-details/:id', verifySuperAdminToken, getSingleLeaveApplication)
Router.post('/super-admin/delete-leave-application-details/:id', verifySuperAdminToken, leaveApplicationSoftDelete)
Router.post('/super-admin/create-user', verifySuperAdminToken, createUsers)
Router.post('/super-admin/update-user', verifySuperAdminToken, updateUsers)
Router.get('/super-admin/get-all-managers-users', verifySuperAdminToken, getAllManagerUsers)
Router.get('/super-admin/get-employee-documents/:id', verifySuperAdminToken, getEmployeeDocumentsById)
Router.post('/super-admin/create-terms-and-conditions', verifySuperAdminToken, createTermsAndConditions)
Router.get('/super-admin/get-all-created-terms-and-conditions', verifySuperAdminToken, getAllCreateTermsAndConditions)
Router.get('/super-admin/get-single-created-terms-and-conditions-details/:id', verifySuperAdminToken, getCreateTermsAndConditionsDetailsById)
Router.post('/super-admin/update-terms-and-conditions-details', verifySuperAdminToken, updateTermsConditionsDetails)
Router.delete('/super-admin/delete-terms-and-conditions-details/:id', verifySuperAdminToken, deleteTermsAndConditions)


/*** Admins Route */

Router.post('/admin/login-admin', adminLogin)
Router.get('/admin/get-profile-details', verifyEnergyCompanyToken, getAdminProfileDetails)
Router.post('/admin/update-admin-profile-details', verifyEnergyCompanyToken, updateAdminProfile)
Router.post('/admin/admin-change-password', verifyEnergyCompanyToken, adminChangePassword)
Router.post('/energy-company/create-zone-user', verifyEnergyCompanyToken, createEnergyCompanyUser)
Router.post('/energy-company/create-sub_user-for-energy-company-zone-user', verifyEnergyCompanyToken, createSubUsersForEnergyCompanyZoneUser)
Router.post('/energy-company/create-sub_user-for-energy-company-regional-user', verifyEnergyCompanyToken, createSubUsersForEnergyCompanyRegionalOfficeUser)
Router.post('/energy-company/create-sub_user-for-energy-company-sale-area-user', verifyEnergyCompanyToken, createSubUsersForEnergyCompanySaleAreaUser)

/** * Sub User Routes */
Router.post('/sub-user/login', subUserLoggedIn)
Router.get('/sub-user/profile-details', verifySubUserToken, getSubUserProfileDetails)
Router.post('/sub-user/profile-update', verifySubUserToken, updateSubUserProfileDetails)
Router.post('/sub-user/changed-password', verifySubUserToken, subUserChangePassword)
Router.get('/sub-user/get-permissions-on-role-basis', verifySubUserToken, checkPermittedModuleOnRoleBasis)
Router.get('/sub-user/get-permitted-module-name-on-role-basis', verifySubUserToken, getAllPermittedModuleNameOnRoleBasis)
Router.post('/sub-user/update-permissions-on-role-basis', verifySubUserToken, updatePermissionOnRoleBasis)

//HR management
Router.post('/sub-user/mark-attendance', verifySubUserToken, clockIn)
Router.post('/sub-user/clock-out', verifySubUserToken, clockOut)
Router.get('/sub-user/check-today-clock-in', verifySubUserToken, checkClockInToday)
Router.post('/sub-user/mark-break', verifySubUserToken, startBreak)
Router.post('/sub-user/break-end', verifySubUserToken, endBreak)
Router.get('/sub-user/get-user-time-sheet', verifySubUserToken, timeSheet)
Router.post('/sub-user/apply-leave', verifySubUserToken, applyLeave)
Router.get('/sub-user/all-apply-leave', verifySubUserToken, getAllLeaveApplications)


module.exports = Router;