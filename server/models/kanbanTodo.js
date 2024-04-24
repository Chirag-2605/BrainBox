const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const kanbanTodoSchema=new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  title:{
      type:String,
      required:true
  },
  columns: [{
    type:String,
    ref:"Column"
  }],
  cards:[{
    type:String,
    ref:"Card"}]
})

const KanbanToDo = mongoose.model("KanbanToDo",kanbanTodoSchema);
module.exports = KanbanToDo;