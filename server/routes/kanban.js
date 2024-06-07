const express = require('express');
const router = express.Router();
const KanbanTodo = require('../models/kanbanTodo');
const Column = require('../models/column');
const Card = require('../models/card');
const { User } = require('../models/user');

// Define routes for handling board creation and fetching
router.route('/:userId/:id')
    .post(async (req, res) => {
        try {
            const { title, columns, cards } = req.body;
            const userId = req.params.userId;
            const boardId = req.params.id;

            // Check if the board already exists
            const existingBoard = await KanbanTodo.findById(boardId);
            if (existingBoard) {
                return res.status(409).json({ message: 'Board with this ID already exists' });
            }

            const columnInstances = await Promise.all(columns.map(columnData => new Column(columnData).save()));
            const cardInstances = await Promise.all(cards.map(cardData => new Card(cardData).save()));

            const newKanbanTodo = new KanbanTodo({
                _id: boardId,
                title,
                columns: columnInstances.map(column => column._id.toString()),
                cards: cardInstances.map(card => card._id.toString())
            });
            await newKanbanTodo.save();
            
            await KanbanTodo.populate(newKanbanTodo, { path: 'columns cards' });
            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ message: "User has not been found" });
            }
            user.kanbanTodos.push(newKanbanTodo);
            await user.save();
            res.status(201).json(newKanbanTodo);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const userId = req.params.userId;
            const id = req.params.id;

            const deletedKanbanTodo = await KanbanTodo.findByIdAndDelete(id);
            if (!deletedKanbanTodo) {
                return res.status(404).json({ message: 'Kanban Todo not found' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User does not exist' });
            }

            // Remove the board ID from the user's kanbanTodos list
            user.kanbanTodos = user.kanbanTodos.filter(todo => todo.toString() !== id);
            await user.save();
            res.json({ message: 'Kanban Todo deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

// Define routes for fetching a single board by ID
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

// Define routes for updating a board by ID
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

module.exports = router;
