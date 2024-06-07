const express = require('express');
const router = express.Router();
const {User} = require('../models/user'); 

router.get('/:userId', async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id).populate('kanbanTodos');
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const boardIds = user.kanbanTodos;
    res.json(boardIds);
  } catch (error) {
    console.error("Error in fetching user details: " + error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;


