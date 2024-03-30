const express = require('express');
const router = express.Router();
const {Card:cardSchema} = require('../models/user');

// Add a new card
router.post('/cards', async (req, res) => {
  try {
    const { title } = req.body;
    const newCard = new Card({ title });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error adding card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a card
router.delete('/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Card.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update the title of a card
router.patch('/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updatedCard = await Card.findByIdAndUpdate(id, { title }, { new: true });
    res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Error updating card title:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
