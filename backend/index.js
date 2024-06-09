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
import {z} from "zod"
import Todo from "./Model/Todo.js";

try {
  mongoose.connect(process.env.ATLAS_URI);
  console.log('Mongo DB Connected');
} catch (error) {
  console.log(error);
}

const todoSchema = z.object({
    userId : z.string().refine((val) => {
        return mongoose.Types.ObjectId.isValid(val)
      }),
      header : z.string().min(3 , {message : "A todo shall be atleast of length 3"}).max(15 , {message : "Header Should Not exceed length 14"}),
      description : z.string().max(100 , {message : "A todo shall not exceed 100 length Description"}),
      done : z.boolean() 
})


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
    const userH = await User.findOne({userName: req.body.userName , password : req.body.password})
    let token =  jwt.sign({_id : userH._id}, 'aPrivateKeyOfMine');
    res.send(token)
})

const getValFromToken = (token) =>{
    return jwt.verify(token, 'aPrivateKeyOfMine')
}
 
app.post("/todo" , tokenAuth , async (req , res)=>{
    const userInfo = getValFromToken(req.body.token)
    const store =  todoSchema.safeParse({
        userId : userInfo._id , 
        header : req.body.header,
        description : req.body.description,
        done : false
      })
      if(!store.success){
        console.log(store.error.issues)
        res.status(400).send(store.error.issues[0].message)
        // res.status(400).send(store.errors[0].message)
        return;
      }
      const todoTask = await Todo.create({
        userId : userInfo._id,
        header : req.body.header,
        description : req.body.description,
        done : false
      })
      res.send(todoTask)
})

app.get("/todo" , tokenAuth , async (req , res)=>{
    const userInfo = getValFromToken(req.body.token)
    const Alltodos = await Todo.find({
        "userId" : userInfo._id
    })
    res.send(Alltodos)
})

app.delete("/todo" , tokenAuth , async (req , res)=>{
     const remo = await Todo.findOneAndDelete({
        _id : req.body._id
     })
     res.send(remo)
})

app.put("/todo" , tokenAuth , async (req , res)=>{
    const jwtDecode = jwt.verify(req.body.token , 'aPrivateKeyOfMine')
    const check = todoSchema.safeParse({
        userId : jwtDecode._id,
        header : req.body.header,
        description : req.body.description,
        done : req.body.done
    })
    if(!check.success){
        res.status(400).send(check.error.issues[0].message)
        return;
    }
    let doc = await Todo.findOneAndUpdate({
        _id : req.body._id 
    }, {
        header : req.body.header,
        description : req.body.description,
        done : req.body.done
    });
    res.send(doc)
})


app.get("/hi" , tokenAuth , async (req , res)=>{
    let token = await req.body.token
    try{
        const jsonRet = jwt.verify(token, 'aPrivateKeyOfMine')
        const getUser = await User.findOne({_id : jsonRet._id})
        if(getUser){
            res.send(getUser)
        }
        else{
            res.send("No Such user exists")
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