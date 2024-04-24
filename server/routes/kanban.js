const express = require('express');
const router = express.Router();
const KanbanTodo = require('../models/kanbanTodo');
const Column = require('../models/column');
const Card = require('../models/card');

router.post('/:id', async (req, res) => {
    console.log("Control reached here");
    try {
        const { title, columns, cards } = req.body;
        const boardId = req.params.id;
        
        // Save columns and cards and convert their UUIDs to strings
        const columnInstances = await Promise.all(columns.map(columnData => new Column(columnData).save()));
        const cardInstances = await Promise.all(cards.map(cardData => new Card(cardData).save()));

        // Create a new KanbanTodo instance with string UUIDs for columns and cards
        const newKanbanTodo = new KanbanTodo({
            _id: boardId,
            title,
            columns: columnInstances.map(column => column._id.toString()),
            cards: cardInstances.map(card => card._id.toString())
        });
        // Save the new KanbanTodo instance
        await newKanbanTodo.save();
        
        // Populate columns and cards fields before sending the response
        await KanbanTodo.populate(newKanbanTodo, { path: 'columns cards' });
        
        // Send the response with the new KanbanTodo instance
        res.status(201).json(newKanbanTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const kanbanTodo = await KanbanTodo.findById(id).populate('columns').populate('cards');
        
        if (!kanbanTodo) {
            return res.status(404).json({ message: 'Kanban Todo not found' });
        }
        
        res.json(kanbanTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, columns } = req.body;
        const updatedKanbanTodo = await KanbanTodo.findByIdAndUpdate(
            id,
            { title, columns },
            { new: true }
        );
        if (!updatedKanbanTodo) {
            return res.status(404).json({ message: 'Kanban Todo not found' });
        }
        res.json(updatedKanbanTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedKanbanTodo = await KanbanTodo.findByIdAndDelete(id);
        if (!deletedKanbanTodo) {
            return res.status(404).json({ message: 'Kanban Todo not found' });
        }
        res.json({ message: 'Kanban Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

