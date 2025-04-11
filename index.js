import {PrismaClient} from '@prisma/client'
import express from "express"
import bcrypt from "bcrypt";
import { verifyUser } from './middlewares/register.usermiddleware.js';
import { verifyUserDetails } from './middlewares/check.userdetails.js';
import { checkPasswordStrength } from './middlewares/password.strength.js';
import cors from 'cors';

const app = express();
const client = new PrismaClient();
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    methods:['POST','GET','PUT','PATCH','DELETE'],
    
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






app.listen(3000, () => {
    console.log('Server running on port 3000!')
})