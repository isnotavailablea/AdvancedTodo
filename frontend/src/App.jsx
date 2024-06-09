import {useState,createContext, useEffect} from 'react'
import dotenv  from 'dotenv';
import Axios from "axios"
import './App.css'
import AuthPage from './AuthPage';
import DashBoard from './DashBoard';
// dotenv.config()
export const AllContexts=createContext();
function App() {
  const [token , setToken] = useState(((localStorage.getItem("token") === "null") ? null : localStorage.getItem("token")));
  const [loggedIn , setLoggedIn] = useState(false)
  const setTokenHelp = ()=>{
      setToken(((localStorage.getItem("token") === "null") ? null : localStorage.getItem("token")))
  }
  const getHii = async ()=>{
    if(token){
      console.log(token)
       try{
        const res = await Axios.post("http://localhost:8000/hi" , {
          token 
        })
        console.log(res.data)
        if(res.status === 200){
            setLoggedIn(true);
        }
        else{
          localStorage.setItem("token" , null);
        }
       }
       catch(err){
          console.log("Not Found");
       }
    }
  }
   useEffect( ()=>{getHii()}, [token]);
  return (
    <>
    <AllContexts.Provider value={{token , setTokenHelp }}>
      {token ? <DashBoard/> : <AuthPage/>}
      </AllContexts.Provider>
    </>
  )
}

export default App
