const router = require('express').Router();
const Event = require('../models/event.js');

router.post('/', async (req, res) => {
    try {
        const { title, start, end, priority } = req.body;
        let color;
        if (priority === 'high') color = '#FF2400';
        else if (priority === 'medium') color = '#FFAC33';
        else color = ' #50C878';
        const event = new Event({ title, start, end, priority, color });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Error saving event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const events = await Event.find(); // Example: Fetch events from database
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', async(req,res)=> {
    try {
        const event = await Event.findById(req.params.id);
        res.json(event);
    } catch(err) {
        console.log("error in sending event to update: ", err)
        res.status(500).json({error: 'Backend error'})
    }
})

router.put('/:id', async(req,res)=> {
    const eventId = req.params.id;
    try {
        const updatedEvent =  await Event.findByIdAndUpdate(eventId, req.body, {new:true});
        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        console.log("event resize done");
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/:id', async (req,res)=> {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) {
            return res.status(404).json({error: 'Event not found'});
        }
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
})


module.exports = router;