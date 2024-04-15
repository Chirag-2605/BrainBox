const express = require('express');
const router = express.Router();
const cors = require('cors');
const Document = require('../models/document.js');

router.use(cors({ origin: 'http://localhost:3000' }));

const defaultValue = "";

const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET','POST'],
    },
})

io.on("connection", socket => {
    socket.on("get-document", async (docId, docName) => {
        const userId = socket.handshake.query.userId;
        const document = await findOrCreateDocument(docId, docName, userId);
        socket.join(docId);
        socket.emit('load-document', document.data);

        socket.on("send-changes", delta => {
            socket.broadcast.to(docId).emit("recieve-changes", delta)
        })

        socket.on('save-document', async data => {
            await Document.findByIdAndUpdate(docId, {data});
        })
    })
})

async function findOrCreateDocument(id, name) {
    if (id == null) return
    const document = await Document.findById(id)
    if (document) return document;

    return await Document.create({ _id: id, data: defaultValue, name: name})
}

router.get('/documents', async (req, res) => {
    try {
        const documents = await Document.find();
        res.json(documents);
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

module.exports = router;