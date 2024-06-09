import {User} from "../Model/User.js";
import { z } from "zod";
import mongoose from "mongoose";
import jwt from'jsonwebtoken' ;
const userSchema = z.object({
    userName: z.string().min(5 , {message : "UserName have Atleast Five Characters"}).max(8 , {message : "userName have less than 9 characters"}),
    password: z.string().min(5 , {message : "Password have Atleast Five Characters"}).max(8 , {message : "Password have less than 9 characters"})
  });
const signupmiddleware = async (req , res , next)=>{
      let userName = req.body.userName;
      let password = req.body.password;
    //   console.log(typeof(userName) , " ", password)
      const store =  userSchema.safeParse({
        userName , password
      })
      if(!store.success){
        // console.log(store.error.issues)
        res.status(203).send(store.error.issues[0].message)
        // res.status(400).send(store.errors[0].message)
        return;
      }
      try{
        const findExistingUser = await User.findOne({userName});
      if(findExistingUser){
        //  console.log(findExistingUser)
         res.status(203).send(("User Already Exists !"))
         return;
      }
      next();
      }
      catch(err){
        console.log("Error while Finding")
        res.status(400).send("Error while Finding")
      }
}
const userAuth = async (req , res , next) =>{
    let userName = req.body.userName;
    let password = req.body.password;
    console.log((userName) , " ", password)
    const store =  userSchema.safeParse({
      userName , password
    })
    if(!store.success){
      console.log(store.error.issues)
      res.status(203).send(store.error.issues[0].message)
      // res.status(400).send(store.errors[0].message)
      return;
    }
    try{
      const findExistingUser = await User.findOne({userName , password});
    if(!findExistingUser){
    //    console.log(findExistingUser)
       res.status(203).send(("User was Not Found !"))
       return;
    }
    next();
    }catch(err){
      // console.log("error while finding user")
       res.status(400).send("ERROR WHILE FINDING USER")
    }
}
const tokenAuth = async (req , res , next) =>{
    let token = await req.body.token
    // console.log(token)
    try{
        const jsonRet = jwt.verify(token, 'aPrivateKeyOfMine')
        // console.log(jsonRet)
        if(jsonRet){
            const curDateAndTime = new Date().getTime()
            // console.log(curDateAndTime / 1000);
            if(!jsonRet.iat || !(((curDateAndTime / 1000) - jsonRet.iat) <= (10000000))){
              res.status(203).send("Authentication Time Expired Please Try Again By logging Out")
              return;
            }
            const store =  z.object({
              _id : z.string().refine((val) => {
                return mongoose.Types.ObjectId.isValid(val)
              })
            }).safeParse({
                 _id : jsonRet._id
              })
              if(!store.success){
                // console.log(store.error.issues)
                res.status(203).send(store.error.issues[0].message)
                // res.status(400).send(store.errors[0].message)
                return;
              }
              const getUser = await User.findOne({_id : jsonRet._id})
              if(getUser){
                next()
              }
              else{
                res.status(203).send("User Not Found")
                return;
              }
              
        }
    }
    catch(err){
        console.log(err)
        res.status(400).send("Some Error While Authenticating")
    }
}
export {signupmiddleware , userAuth , tokenAuth}

