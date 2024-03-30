const express = require('express');
const router = express.Router();
const {kanbanTodoSchema:KanbanTodo} = require('../models/user.js');

// Create a new Kanban Todo
router.post('/api/kanban-todos', async (req, res) => {
    try {
        const { title, columns } = req.body;
        const newKanbanTodo = new KanbanTodo({ title, columns });
        await newKanbanTodo.save();
        res.status(201).json(newKanbanTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all Kanban Todos
router.get('/api/kanban-todos', async (req, res) => {
    try {
        const kanbanTodos = await KanbanTodo.find();
        res.json(kanbanTodos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a Kanban Todo by ID
router.get('/api/kanban-todos/:id', async (req, res) => {
    try {
        const kanbanTodo = await KanbanTodo.findById(req.params.id);
        if (!kanbanTodo) {
            return res.status(404).json({ message: 'Kanban Todo not found' });
        }
        res.json(kanbanTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a Kanban Todo
router.put('/api/kanban-todos/:id', async (req, res) => {
    try {
        const { title, columns } = req.body;
        const updatedKanbanTodo = await KanbanTodo.findByIdAndUpdate(
            req.params.id,
            { title, columns },
            { new: true }
        );
        res.json(updatedKanbanTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a Kanban Todo
router.delete('/api/kanban-todos/:id', async (req, res) => {
    try {
        const deletedKanbanTodo = await KanbanTodo.findByIdAndDelete(req.params.id);
        if (!deletedKanbanTodo) {
            return res.status(404).json({ message: 'Kanban Todo not found' });
        }
        res.json({ message: 'Kanban Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
