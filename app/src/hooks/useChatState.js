import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import useDebounce from './useDebounce';
import usePusher from './usePusher';

const useChatState = (initialUsername = '') => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(initialUsername);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getMessages();
      setMessages(data.messages || []);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const performSearch = useCallback(async (query) => {
    try {
      setIsSearching(true);
      setError('');
      const data = await api.searchMessages(query);
      setMessages(data.messages || []);
    } catch (err) {
      setError('Failed to search messages');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle Search Execution
  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setIsSearching(false);
      fetchMessages();
      return;
    }
    performSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, fetchMessages, performSearch]);

  // Real-time synchronization
  usePusher('chat', {
    'new-message': (newMessage) => {
      setSearchQuery((currentQuery) => {
        if (!currentQuery.trim()) {
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
        return currentQuery;
      });
    },
    'message-deleted': (data) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== data.id));
    }
  });

  const handleSendMessage = async (messageText, selectedImage) => {
    if (!username.trim()) {
      setError('Please enter your username');
      return false;
    }
    if (!messageText.trim() && !selectedImage) {
      setError('Please enter a message or select an image');
      return false;
    }

    try {
      setLoading(true);
      setError('');
      let createdMessage = null;

      if (selectedImage) {
        const formData = new FormData();
        formData.append('username', username.trim());
        formData.append('message', messageText.trim());
        formData.append('image', selectedImage);
        const data = await api.sendMessageWithImage(formData);
        createdMessage = data?.message;
      } else {
        const data = await api.sendMessage(username.trim(), messageText.trim());
        createdMessage = data?.message;
      }

      if (createdMessage && !debouncedSearchQuery.trim()) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === createdMessage.id)) return prev;
          return [...prev, createdMessage];
        });
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.deleteMessage(messageId);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete message');
      console.error(err);
    }
  };

  return {
    messages,
    username,
    setUsername,
    searchQuery,
    setSearchQuery,
    setIsSearching,
    isSearching,
    loading,
    error,
    setError,
    handleSendMessage,
    handleDeleteMessage,
  };
};

export default useChatState;
