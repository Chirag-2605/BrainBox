const express = require('express');
const router = express.Router();
const {Column:columnScehma} = require('../models/user');

// Add a new column
router.post('/columns', async (req, res) => {
  try {
    const { title, headingColor } = req.body;
    const newColumn = new Column({ title, headingColor });
    await newColumn.save();
    res.status(201).json(newColumn);
  } catch (error) {
    console.error("Error adding column:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a column
router.delete('/columns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Column.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting column:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update the title of a column
router.patch('/columns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updatedColumn = await Column.findByIdAndUpdate(id, { title }, { new: true });
    res.status(200).json(updatedColumn);
  } catch (error) {
    console.error("Error updating column title:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;