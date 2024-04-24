const express = require('express');
const router = express.Router();
const Column = require('../models/column');
const mongoose=require('mongoose');
const KanbanTodo = require('../models/kanbanTodo')
const Card=require('../models/card');
// Add a new column
router.post('/', async (req, res) => {
  try {
    const { _id, title, headingColor, board_id } = req.body;

    const newColumn = new Column({ _id, title, headingColor, board_id }); 
    await newColumn.save();

    const board = await KanbanTodo.findById(board_id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    board.columns.push(newColumn._id);
    await board.save();

    res.status(201).json(newColumn);
  } catch (error) {
    console.error("Error adding column:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete a column
router.delete('/:column_id', async (req, res) => {
  try {
    const { column_id } = req.params;
    console.log("Deleting column with ID:", column_id);

    const column = await Column.findById(column_id);
    if (!column) {
      console.log("Column not found");
      return res.status(404).json({ error: 'Column not found' });
    }
    const board=await KanbanTodo.findById(column.board_id);
    if(!board){
      console.log("Board not found");
      return res.status(404).json({ error: 'Board not found' });
    }
  const cardsToDelete = await Card.find({ column_id: column_id });
  console.log(cardsToDelete);

  for (const cardToDelete of cardsToDelete) {
    const cardIndex = board.cards.indexOf(cardToDelete._id);
    if (cardIndex !== -1) {
      console.log("Removing card with id",cardIndex);
      board.cards.splice(cardIndex, 1);
    }
    await Card.findByIdAndDelete(cardToDelete._id);
  }
const columnIndex = board.columns.indexOf(column_id);
if (columnIndex === -1) {
  return res.status(404).json({ error: 'Column not found in board' });
}
board.columns.splice(columnIndex, 1);

await board.save();

await Column.findByIdAndDelete(column_id);

res.status(204).end();
  } catch (error) {
    console.error("Error deleting column:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.patch('/:column_id', async (req, res) => {
  try {
    const { column_id } = req.params;
    const { title } = req.body;
    const existingColumn = await Column.findByIdAndUpdate(column_id , { title }, { new: true });
    if (!existingColumn) {
      return res.status(404).json({ error: 'Column not found' });
      
    }
    res.status(200).json(existingColumn);
  } catch (error) {
    console.error("Error updating column title:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
