import {PrismaClient} from '@prisma/client'
import express from "express"
import bcrypt from "bcrypt";
import { verifyUser } from './middlewares/register.usermiddleware.js';
import { verifyUserDetails } from './middlewares/check.userdetails.js';
import { checkPasswordStrength } from './middlewares/password.strength.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const client = new PrismaClient();
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    methods:['POST','GET','PUT','PATCH','DELETE'],
    credentials:true
  }));

app.post('/auth/register',[verifyUser, verifyUserDetails, checkPasswordStrength ], async (req,res)=>{
    const {firstName,lastName,emailAddress,userName,password} = req.body
    const hashedPassword = await bcrypt.hash(password,12);
   try {
    const user = await client.user.create({
        data: {
            firstName,
            lastName,
            emailAddress,
            userName,
            password:hashedPassword
        }
    })
    res.status(200).json({
        message:"User created successfully",
        status:"Success",
        data:user
    })
    
   } catch (error) {
    res.status(500).json({
        message:"Error creating user",
        status:"Failed",        
    })
   }
    
})


app.post('/auth/login',async(req,res)=>{
    
    const {identifier,password} = req.body
    console.log(identifier,password)
    try {

        const user = await client.user.findFirst({
            where:{
                OR:[
                    {
                        emailAddress:identifier
                    },
                    {
                        userName:identifier
                    }]
            }
        })
        if(!user){
            return res.status(401).json({
                message:"Invalid credentials",
                status:"fail",
            })
        }
        const isPasswordValid= await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(401).json({
                message:"Invalid credentials",
                status:"fail",
            })
        }

        const payload = {
           id: user.id,
           firstName: user.firstName,
           lastName: user.lastName,
           emailAddress: user.emailAddress,
           userName: user.userName

        }

        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{})

        res.status(200).cookie('token',token).json({
            message:"Login successful",
            status:"Success",
            data:user
        })

    } catch (error) {
        
    }

})





app.listen(3000, () => {
    console.log('Server running on port 3000!')
})