const express = require('express');
const router = express.Router();
const cors = require('cors');
const Document = require('../models/document.js');

router.use(cors({ origin: 'http://localhost:3000' }));

const defaultValue = "";

const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET','POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers if needed
        credentials: true, // Allow sending credentials if necessary
    },
})

io.on("connection", socket => {
    socket.on("get-document", async (docId, docName, userId) => {
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

async function findOrCreateDocument(id, name, userId) {
    if (id == null) return
    const document = await Document.findById(id)
    if (document) return document;

    return await Document.create({ _id: id, data: defaultValue, name: name, ownerId: userId});
}

router.get('/documents/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if(userId) {
            const documents = await Document.find({ownerId: userId});
            res.json(documents);
        }
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

router.delete('/documents/:docId', async (req,res)=>{
    try {
        const docId = req.params.docId;
        console.log(docId);
        if(docId) {
            const result = await Document.findByIdAndDelete(docId);
            if (result) {
                res.status(200).json({ message: 'Document deleted successfully' });
            } else {
                res.status(404).json({ error: 'Document not found' });
            }
        } else {
            res.status(400).json({ error: 'Invalid document ID' });
        }
    } catch (err) {
        res.status(500).json({err : 'Failed to delete the document'});
    }
}) 

module.exports = router;