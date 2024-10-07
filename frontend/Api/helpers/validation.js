const Joi = require("joi");
var moment = require('moment');

const checkPositiveInteger = Joi.object({
    id: Joi.number().integer().positive().required(),
});

const outletFormValidation = Joi.object({
    energy_company_id: Joi.number().required(),
    zone_id: Joi.number().required(),
    regional_id: Joi.number().required(),
    sales_area_id: Joi.number().required(),
    district_id: Joi.number().required(),
    outlet_name: Joi.string().required(),
    outlet_conatct_number: Joi.number().required(),
    customer_code: Joi.string().required(),
    outlet_category: Joi.string().required(),
    outlet_ccnoms: Joi.string().required(),
    outlet_ccnohsd: Joi.string().required(),

}).options({ allowUnknown: true });


const saleCompanyFiledValidated = Joi.object({

    name: Joi.string().required(),
    contact: Joi.string().required(),
    mobile: Joi.number().required(),
    address: Joi.string().required(),
    primary_contact_person: Joi.string().required(),
    primary_contact_mobile: Joi.number().required(),
    gst_treatment_type: Joi.string().required(),
    business_legal_name:Joi.string().required(),
    billing_address: Joi.string().required(),

}).options({ allowUnknown: true });

const purchaseCompany = Joi.object({

    company_name: Joi.string().required(),
    company_contact: Joi.string().required(), 
    company_mobile: Joi.number().required(),
    company_address: Joi.string().required(),
    company_contact_person: Joi.string().required(),
    primary_contact_number: Joi.number().required(),
    gst_treatment_type: Joi.string().required(),
    business_legal_name: Joi.string().required(),
    billings_address: Joi.string().required(),
}).options({ allowUnknown: true });


const companyValidation = Joi.object({

    company_name: Joi.string().required(),
    company_contact: Joi.string().required(), 
    company_mobile: Joi.number().required(),
    company_address: Joi.string().required(),
    company_contact_person: Joi.string().required(),
    primary_contact_number: Joi.number().required(),
    gst_treatment_type: Joi.string().required(),
    business_legal_name: Joi.string().required(),
}).options({ allowUnknown: true });


const adminCreateValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
}).options({ allowUnknown: true });


const loginValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
}).options({ allowUnknown: true });

const subUserFormValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    joining_date: Joi.date().raw().required(),
}).options({ allowUnknown: true });

const subUserProfileUpdateValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.number().required(),
}).options({ allowUnknown: true });

const changePasswordValidation = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required()
}).options({ allowUnknown: true });


const validatePermissionOnRoleBassi = Joi.object({
    module_id: Joi.number().positive().required(),
    role_id: Joi.number().positive().required()
}).options({ allowUnknown: true });


const complaintTypeValidations = Joi.object({
    energy_company_id: Joi.number().positive().required(),
    complaint_type: Joi.string().required()
}).options({ allowUnknown: true });

const teamValidations = Joi.object({
    team_head: Joi.number().required(),
    team_name: Joi.string().required(),
    team_short_description: Joi.string().required()
    
}).options({ allowUnknown: true });

const energyCompanyValidations = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    contact_no: Joi.number().required(),
});

const contractorValidations = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    contact_no: Joi.number().required(),
})

const tutorialValidations = Joi.object({
    user_type: Joi.number().required(), 
    application_type: Joi.string().required(), 
    module_type: Joi.string().required(), 
    tutorial_format: Joi.string().required(), 
    description: Joi.string().required()
})

const planValidations = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    duration: Joi.string().required(),
    description: Joi.string().required()
})

const notificationCreateValidations = Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
})

const surveyValidations = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    format: Joi.string().required(),
})

const addDocumentValidations = Joi.object({
    category_id: Joi.number().required(),
    user_type: Joi.number().required(),
    user_id: Joi.number().required(),
    // images: Joi.string().required(),
    remarks: Joi.string().required(),
})

const tasksManagerValidations = Joi.object({
    title: Joi.string().required(),
    start_date: Joi.date().raw().required(),
    end_date: Joi.date().raw().required(),
    assign_to: Joi.number().required(),
    project_name: Joi.string().required(),
    category_id: Joi.number().required(),
    status: Joi.string().required()
})

const changePasswordValidations = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required()
})

const hrTeamValidations = Joi.object({
    manager_id: Joi.number().required(),
    team_name: Joi.string().required()
})

const profileValidations = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.number().required(),
    joining_date: Joi.string().required(), 
})

const userActivityLogValidations = Joi.object({
    userId: Joi.number().integer().positive().required(), 
    roleId: Joi.number().integer().positive().required, 
    timestamp: Joi.number().integer().positive().required, 
    action: Joi.string().required(), 
    ipAddress: Joi.required(), 
    userAgent: Joi.string().required(), 
    result: Joi.string().required()
}).options({allowUnknown: true});

const termsAndConditionsValidation = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(), 
    status: Joi.number().required()
}).options({allowUnknown: true})

const userCreateValidations = Joi.object({
    name : Joi.string().required(), 
    email: Joi.string().required(), 
    password: Joi.string().required(), 
    mobile: Joi.string().required(), 
    joining_date: Joi.string().required(), 
    role_id: Joi.string().required()
}).options({allowUnknown: true});



module.exports = { checkPositiveInteger, outletFormValidation, saleCompanyFiledValidated, purchaseCompany, adminCreateValidation, companyValidation, loginValidation, subUserFormValidation, subUserProfileUpdateValidation, changePasswordValidation, validatePermissionOnRoleBassi, complaintTypeValidations, teamValidations, energyCompanyValidations, contractorValidations, tutorialValidations, planValidations, notificationCreateValidations, surveyValidations, addDocumentValidations, tasksManagerValidations, changePasswordValidations, hrTeamValidations, profileValidations, userActivityLogValidations, termsAndConditionsValidation, userCreateValidations};