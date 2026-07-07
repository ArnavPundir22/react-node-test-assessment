import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, setIsSearching, isSearching }) => {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearching(true);
          }}
        />
        {isSearching && <span className="search-status">Searching...</span>}
      </div>
    </div>
  );
};

export default SearchBar;
