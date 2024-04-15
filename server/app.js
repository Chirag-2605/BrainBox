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
const documentRouter = require('./routes/document.js');

// database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Setting routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/events', eventRoutes);
app.use('api/kanban-todos', kanbanRouter);
app.use('/', documentRouter);

const port = 8080;
app.listen(port, ()=>{console.log('Listening on port 8080')});