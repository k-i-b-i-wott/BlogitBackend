
import jwt from 'jsonwebtoken'
export const verifyUserInfo=(req,res,next)=>{

    const token = req.cookies.token
    
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            res.status(403).json({
                message:"Please login",
                status:"fail",
            })
        }
        req.user=user
        next()
    })
        
    }    
