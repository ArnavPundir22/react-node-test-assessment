import React from 'react';
import { getBaseUrl } from '../services/api';

const MessageBubble = ({ msg, currentUser, onDelete }) => {
  // Using trim() ensures trailing spaces in username input don't break the layout
  const isOwnMessage = msg.username.trim() === currentUser.trim() && currentUser.trim() !== '';

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-item ${isOwnMessage ? 'message-own' : 'message-other'}`}>
      <div className="message-content-wrapper">
        <div className="message-header">
          <span className="message-username">{msg.username}</span>
          <span className="message-time">{formatTime(msg.created_at)}</span>
        </div>
        
        {msg.image_url && (
          <div className="message-image">
            <img 
              src={`${getBaseUrl()}${msg.image_url}`} 
              alt="Shared" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
        
        {msg.message && (
          <div className="message-text">{msg.message}</div>
        )}
      </div>
      
      {isOwnMessage && (
        <button
          className="delete-message-btn"
          onClick={() => onDelete(msg.id)}
          title="Delete message"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default MessageBubble;
