const Message = require('../models/Message');
const pusherClient = require('../utils/pusher');
const path = require('path');
const fs = require('fs');

const getAllMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
    
    const messages = await Message.getAll(limit, offset);
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
};

const searchMessages = async (req, res) => {
  try {
    const { q, limit = 100 } = req.query;

    if (!q || typeof q !== 'string' || q.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'A valid search term is required' 
      });
    }

    const messages = await Message.search(q.trim(), parseInt(limit, 10));
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error in /search endpoint:', error);
    res.status(500).json({ success: false, error: 'Failed to search messages' });
  }
};

const createMessage = async (req, res) => {
  try {
    const { username, message } = req.body;

    if (!username || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and message are required' 
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message cannot be empty' 
      });
    }

    const newMessage = await Message.create(username, message.trim());

    // Fire and forget real-time event
    pusherClient.trigger('chat', 'new-message', newMessage);

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ success: false, error: 'Failed to create message' });
  }
};

const createMessageWithImage = async (req, res) => {
  try {
    const { username, message } = req.body;

    if (!username) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username is required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image file is required' 
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const messageText = message ? message.trim() : '';

    const newMessage = await Message.create(username, messageText, imageUrl);

    pusherClient.trigger('chat', 'new-message', newMessage);

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error creating message with image:', error);
    
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create message with image' 
    });
  }
};

const getMessageById = async (req, res) => {
  try {
    const message = await Message.getById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        error: 'Message not found' 
      });
    }

    res.json({ success: true, message });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch message' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.delete(req.params.id);
    
    if (!deletedMessage) {
      return res.status(404).json({ 
        success: false, 
        error: 'Message not found' 
      });
    }

    pusherClient.trigger('chat', 'message-deleted', { id: deletedMessage.id });

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, error: 'Failed to delete message' });
  }
};

module.exports = {
  getAllMessages,
  searchMessages,
  createMessage,
  createMessageWithImage,
  getMessageById,
  deleteMessage
};
