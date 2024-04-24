const mongoose = require('mongoose');
const KanbanToDo = require('./kanbanTodo');
const Column = require('./column');
const { v4: uuidv4 } = require('uuid');
const cardSchema=new mongoose.Schema({
  title:{
      type:String,
      required:true

  },
  _id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  column_id:{
    type:String,
    ref:Column
  },
  board_id:{
    type:String,
    ref:KanbanToDo
  }
})

const Card=mongoose.model("Card",cardSchema);
module.exports=Card;
