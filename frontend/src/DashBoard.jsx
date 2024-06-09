import { AllContexts } from "./App"
import { useContext, useEffect, useState } from "react"
import Axios  from "axios";
function DashBoard() {
  const contextObj = useContext(AllContexts);
  const [todoList , setTodoList] = useState([]);
  const [todoInput , setTodoInput] = useState({
     "token" : contextObj.token,
     "header" : "",
     "description" : ""
  });
  useEffect(()=>{
    fetchTodo();
  },[])
  const AddTodo = async ()=>{
      // console.log(todoInput);
      try{
         const resp = await Axios.post("http://localhost:8000/addTodo" , todoInput)
         if(resp.status === 200){
            // console.log(resp.data)
            fetchTodo();
         }
         else{
            // console.log(resp.data)
            alert("Some Error while fetching")
         }
      }catch(err){
        // console.log(err)
        alert("Unable to Make Request!")
      }
  }
  const fetchTodo = async ()=>{
      try{
        const resp = await Axios.post("http://localhost:8000/todo" , todoInput)
         if(resp.status === 200){
            setTodoList(resp.data)
         }
         else{
            alert("Unable to Fetch")
            // console.log(resp.data)
         }
      }catch(err){
         console.log("Unable to get todos")
      }
  }
  return (
    <div>
        <button onClick={()=>{localStorage.setItem("token" , null); contextObj.setTokenHelp();}}>Logout</button>
        <br/>
        <h3>header</h3>
        <input type = "text"  onChange={(e)=>setTodoInput({token : contextObj.token , header : e.target.value , description: todoInput.description})}/>
        <h3 >Description</h3>
        <textarea onChange={(e)=>setTodoInput({token : contextObj.token , header : todoInput.header , description: e.target.value})}/>
        <br/>
        <button onClick={AddTodo}>Add Todo</button>
        <br/>
        <h2>Todos : </h2>
        {todoList.map((el)=>{
          return <div key = {el._id}>
            <h3>{el.header}</h3>
            <p>{el.description}</p>
          </div>
        })}
    </div>
  )
}

export default DashBoard
