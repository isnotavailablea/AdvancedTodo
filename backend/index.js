import  express from "express"
import mongoose  from 'mongoose';
import dotenv  from 'dotenv';
import jwt from'jsonwebtoken' ;
dotenv.config();
// console.log(`Your port is ${process.env.PORT}`);
const app = express()
const port = 8000
app.use(express.json())
import { signupmiddleware , userAuth , tokenAuth } from "./middleware/user.js";
import {User} from "./Model/User.js";


try {
  mongoose.connect(process.env.ATLAS_URI);
  console.log('Mongo DB Connected');
} catch (error) {
  console.log(error);
}


app.post("/signup"  , signupmiddleware , async (req , res)=>{
    const addUser = await User.create({userName : req.body.userName , password : req.body.password})
    if(addUser.userName){
        res.send(addUser)
    }
    else{
        res.status(404).send("Some Unknown Error Occured")
    }
})

app.get("/login" , userAuth , async (req , res)=>{
    let token =  jwt.sign({ userName : req.body.userName , password : req.body.password }, 'aPrivateKeyOfMine');
    // console.log(token)
    res.send(token)
})
app.get("/hi" , tokenAuth , async (req , res)=>{
    let token = await req.body.token
    try{
        const jsonRet = jwt.verify(token, 'aPrivateKeyOfMine')
        const getUser = await User.findOne({userName : jsonRet.userName , password : jsonRet.password})
        if(getUser){
            res.send(getUser)
        }
        else{
            res.send()
        }
    }
    catch(err){
        // console.log(err)
        res.status(400).send("Some Error While Finding User")
    }
})
// console.log(process.env.ATLAS_URI)
app.listen(port , ()=>{
    console.log("Server is active at : " , port);
})