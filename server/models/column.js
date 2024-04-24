const mongoose = require('mongoose');
const KanbanToDo = require('./kanbanTodo');
const { v4: uuidv4 } = require('uuid');
const columnSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  headingColor: {
    type: String,
    required: true 
  },
  board_id:{
    type: String,
    ref:KanbanToDo
  }
});


const Column=mongoose.model("Column",columnSchema);
module.exports=Column;