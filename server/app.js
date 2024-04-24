require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db');
const mongoose=require('mongoose');
const Column=require('./models/column.js');
// Routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events.js');
const kanbanRouter = require('./routes/kanban.js');
const documentRouter = require('./routes/document.js');
const columnRouter=require('./routes/column.js');
const cardRouter=require('./routes/card.js');
// database connection
connection();

app.use(cors());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Setting routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/kanban-todos', kanbanRouter);
app.use('/api/column', columnRouter);
app.use('/api/card', cardRouter);
app.use('/', documentRouter);

const port = 8080;
app.listen(port, ()=>{console.log('Listening on port 8080')});