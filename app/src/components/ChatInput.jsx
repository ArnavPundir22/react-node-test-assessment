import React, { useState, useRef } from 'react';

const ChatInput = ({ username, setUsername, onSendMessage, loading, error, setError }) => {
  const [messageText, setMessageText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSendMessage(messageText, selectedImage);
    if (success) {
      setMessageText('');
      removeImage();
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="input-group">
        <input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
          disabled={loading}
        />
      </div>

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
          <button type="button" onClick={removeImage} className="remove-image-btn">
            ×
          </button>
        </div>
      )}

      <div className="input-group">
        <input
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="message-input"
          disabled={loading}
        />
        <label className="image-upload-label">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={loading}
            style={{ display: 'none' }}
          />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </label>
      </div>

      <button
        type="submit"
        className="send-button"
        disabled={loading || (!messageText.trim() && !selectedImage)}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default ChatInput;
