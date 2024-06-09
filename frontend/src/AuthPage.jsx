import  Axios  from "axios"
import { AllContexts } from "./App"
import { useState } from "react"
import { useContext } from "react"
function AuthPage() {
    const contextObj = useContext(AllContexts)
    const [loginOrSignUp , setLoginOrSignUp] = useState(0)
    const [formData , setFormData] = useState({
        userName : "",
        password : ""
    })
    const HandleSubmit = async ()=>{
        if(!loginOrSignUp){
            try{
                const resp = await Axios.post("http://localhost:8000/login" , formData)
                if(resp.status === 203){
                    console.log(formData)
                    alert(resp.data)
                }
                else{
                    console.log("success")
                    console.log(resp.data)
                    localStorage.setItem("token" , resp.data);
                    contextObj.setTokenHelp()
                }
            }catch(err){
                console.log("network Failure")
                console.log(err)
            }
        }
        else{
            try{
                const resp = await Axios.post("http://localhost:8000/signup" , formData)
                if(resp.status === 203){
                    console.log("failure")
                    alert(resp.data)
                }
                else{
                    console.log("success")
                    console.log(resp.data)
                }
            }catch(err){
                console.log("network Failure")
                console.log(err)
            }
        }
    }
  return (
    <div>
       <button onClick={()=>{setLoginOrSignUp(!loginOrSignUp)}}>
          {loginOrSignUp ? "login" : "signup"}
       </button>
       <br/>
        <input type="text" onChange={(e)=>{
            setFormData({
                password:formData.password,
                userName : e.target.value
            })
        }}/>
        <br/>
        <input type="text" onChange={(e)=>{
            setFormData({
                password:e.target.value,
                userName : formData.userName
            })
        }}/>
        <br/>
        <button onClick={HandleSubmit}>Submit</button>
    </div>
  )
}

export default AuthPage
