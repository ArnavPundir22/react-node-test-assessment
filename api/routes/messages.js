const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const messageController = require('../controllers/messageController');

// Get all messages
router.get('/', messageController.getAllMessages);

// Search messages (Must be defined before /:id)
router.get('/search', messageController.searchMessages);

// Create a new text message
router.post('/', messageController.createMessage);

// Create a message with image
router.post('/with-image', upload.single('image'), messageController.createMessageWithImage);

// Get a single message by ID
router.get('/:id', messageController.getMessageById);

// Delete a message
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
