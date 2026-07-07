import React from 'react';
import './App.css';
import useChatState from './hooks/useChatState';

// Components
import ChatHeader from './components/ChatHeader';
import SearchBar from './components/SearchBar';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

function App() {
  const {
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
  } = useChatState();

  return (
    <div className="App">
      <main className="chat-container">
        <ChatHeader />
        
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsSearching={setIsSearching}
          isSearching={isSearching}
        />
        
        <MessageList 
          messages={messages}
          loading={loading}
          currentUser={username}
          onDeleteMessage={handleDeleteMessage}
        />
        
        <ChatInput 
          username={username}
          setUsername={setUsername}
          onSendMessage={handleSendMessage}
          loading={loading}
          error={error}
          setError={setError}
        />
      </main>
    </div>
  );
}

export default App;
