const express = require('express');
const router = express.Router();
const Card=require('../models/card')
const cors = require('cors');
const KanbanToDo = require('../models/kanbanTodo');

// Add a new card
router.post('/', async (req, res) => {
  try {
    const { column_id, title, _id, board_id } = req.body;
    const newCard = new Card({ column_id, title, _id, board_id });
    const board=await KanbanToDo.findById(board_id);
    if(!board){
      return res.json({error:"Board was not found"});
    }
    
    const savedCard = await newCard.save();
    board.cards.push(newCard._id);
    await board.save();
    res.json(savedCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:board_id/:_id', async (req, res) => {
  try {
    console.log("Control reached here");
    const { _id,board_id } = req.params;
    await Card.findByIdAndDelete(_id);
    const board=await KanbanToDo.findById(board_id);
    if(!board){
      console.log("Board not found");
      return res.status(404).json({message:"Board cud not be created"});
    }
    const cardIndex=board.cards.indexOf(_id);
    if(cardIndex===-1){
      board.cards.splice(_id,1);
    }
    await board.save();
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put('/:board_id', async (req, res) => {
  try {
    const { board_id } = req.params;
    const {cards,cardId,columnId} = req.body;
    const board = await KanbanToDo.findById(board_id);
    const updatedCard = await Card.findByIdAndUpdate(cardId, { column_id: columnId }, { new: true });
    await updatedCard.save();
    console.log(cards);
    if (!board) {
      return res.status(404).json({ message: "Kanban Board not found" });
    }
    

    const cardIds = cards.map(card => card._id);
    console.log(cardIds);

    board.cards = cardIds;
    console.log(board.cards);
    await board.save();
    return res.status(204).json("Patched successfully");
  } catch (error) {
    console.error('Error updating card', error);
    console.log(error);
    return res.status(500).json({ message: "Internal error" });
  }
});


router.patch('/:column_id', async (req, res) => {
  const { columnId } = req.params;
  const { cards } = req.body; 
  try {
    await Promise.all(cards.map(async (card, index) => {
      await Card.findByIdAndUpdate(card._id, { order: index }, { new: true });
    }));

    res.status(200).json({ message: 'Card order updated successfully' });
  } catch (error) {
    console.error('Error updating card order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
