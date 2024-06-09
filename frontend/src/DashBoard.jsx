import { AllContexts } from "./App"
import { useContext, useEffect, useState } from "react"
import Axios  from "axios";
import "./DashBoard.css"
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
  const DeleteEntry = async (id)=>{
      try{
         const Del = await Axios.delete("http://localhost:8000/todo" , {data:{_id: id , token : contextObj.token}})
         if(Del.status === 200){
            console.log("Entry Deleted")
            fetchTodo()
         }
     }catch(err){
         console.log("Some Error Occured")
     }
  }
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
  const updateTodo = async (obj)=>{
      try{
         const upd = await Axios.put("http://localhost:8000/todo" , obj)
         if(upd.status === 203){
             console.log("Could Not Update")
         }
         else{
            console.log("Updated")
            fetchTodo()
         }
      }catch(err){
         console.log("Some Error Occured Data May Not be upto Date")
      }
  }
  return (
    <div>
       <div className="DashBoard-Header">
           <div style={{
            color: "white",
            padding : "8px",
            fontFamily :"fantasy"
           }}>
               Track-Todos
           </div>
            <button onClick={()=>{localStorage.setItem("token" , null); contextObj.setTokenHelp();}}>Logout</button>
       </div>

        <br/>
        <div className="DashBoard-form">
        <h3>header</h3>
        <input type = "text"  onChange={(e)=>setTodoInput({token : contextObj.token , header : e.target.value , description: todoInput.description})}/>
        <h3 >Description</h3>
        <textarea onChange={(e)=>setTodoInput({token : contextObj.token , header : todoInput.header , description: e.target.value})}/>
        <br/>
        <button onClick={AddTodo}>Add Todo</button>
        <br/>
        </div>
        <div className="DashBoard-showTodo">
        {todoList.map((el)=>{
          return <div key = {el._id}>
            <h3 style={{color : el.done ? "green" : "red"}}>{el.header}</h3>
            <p>{el.description}</p>
            <div>
                  <p style={{backgroundColor: el.done ? "red" : "green"}} onClick={()=>{
                     updateTodo({
                        token : contextObj.token,
                        _id : el._id,
                        header : el.header,
                        description : el.description,
                        done : !el.done
                     })
                  }}>
                  </p>
                  <button onClick={()=>DeleteEntry(el._id)}>Delete</button>
            </div>
          </div>
        })}
        </div>
    </div>
  )
}

export default DashBoard
