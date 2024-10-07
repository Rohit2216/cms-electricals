const jwt = require('jsonwebtoken');


const verifySuperAdminToken = async (req, res, next) => {
    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null)
        {
            return res.status(401).json({
                status: false,
                message: "Super Admin not verified"
            });
            
        }
        else
        {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if(err) return res.status(403).json({status: false, message: err.message});
                
                if(decoded.user_type!= process.env.SUPER_ADMIN_ROLE_ID)
                {
                    return res.status(403).json({status: false, message: "Forbidden access"});
                }
                req.user = decoded
                next();
            })
        }
    } 
    catch (error)
    {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }
}

const verifyContractorToken = async (req, res, next) => {

    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null)
        {
            return res.status(401).json({
                status: false,
                message: "Super Admin not verified"
            });
            
        }
        else
        {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if(err) return res.status(403).json({status: false, message: err.message});
                
                if(decoded.user_type!= process.env.CONTRACTOR_ROLE_ID)
                {
                    return res.status(403).json({status: false, message: "Forbidden access"});
                }
                req.user = decoded
                next();
            })
        }
    } 
    catch (error)
    {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }
}

const verifyDealerToken = async (req, res, next) => {

    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null)
        {
            return res.status(401).json({
                status: false,
                message: "Dealer not verified"
            });
            
        }
        else
        {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if(err) return res.status(403).json({status: false, message: err.message});
                
                if(decoded.user_type!= process.env.DEALER_ROLE_ID)
                {
                    return res.status(403).json({status: false, message: "Forbidden access"});
                }
                req.user = decoded
                next();
            })
        }
    } 
    catch (error)
    {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }
}

const verifyEnergyCompanyToken = async (req, res, next) => {

    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null)
        {
            return res.status(401).json({
                status: false,
                message: "Energy company admin not verified"
            });
            
        }
        else
        {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if(err) return res.status(403).json({status: false, message: err.message});
                
                if(decoded.user_type!= process.env.ENERGY_COMPANY_ROLE_ID)
                {
                    return res.status(403).json({status: false, message: "Forbidden access"});
                }
                req.user = decoded
                next();
            })
        }
    } 
    catch (error)
    {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }
}

const verifySubUserToken = async (req, res, next) => {

    try 
    {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(token == null)
        {
            return res.status(401).json({
                status: false,
                message: "Sub user not verified"
            });
            
        }
        else
        {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if(err) return res.status(403).json({status: false, message: err.message});

                if(decoded.user_type != process.env.SUB_USER_ROLE_ID)
                {
                    return res.status(403).json({status: false, message: "Forbidden access"});
                }
                req.user = decoded
                next();
            })
        }
    } 
    catch (error)
    {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }

}

module.exports = {verifySuperAdminToken, verifyContractorToken, verifyDealerToken, verifyEnergyCompanyToken, verifySubUserToken}