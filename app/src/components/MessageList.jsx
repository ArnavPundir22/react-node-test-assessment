import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, loading, currentUser, onDeleteMessage }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Loading messages...</span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="no-messages">
        <div className="empty-state-icon">💭</div>
        <p>No messages yet.</p>
        <p className="sub-text">Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="chat-messages" id="messages-container">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          msg={msg}
          currentUser={currentUser}
          onDelete={onDeleteMessage}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
