require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db');

// Routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events.js');
const kanbanRouter = require('./routes/kanban.js');

// database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Setting routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/events', eventRoutes);
app.use('api/kanban-todos', kanbanRouter)

const port = 8080;
app.listen(port, ()=>{console.log('Listening on port 8080')});