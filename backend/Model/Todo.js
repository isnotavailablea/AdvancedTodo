import mongoose from 'mongoose'

const TodoSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        require : true
    },
    header : {
        type : String,
        require : true
    },
    description : {
        type : String,
    },
    status : {
        type : Boolean,
        require : true
    }
})

const Todo = new mongoose.model("Todo" , TodoSchema);

export default Todo;