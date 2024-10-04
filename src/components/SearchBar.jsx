import React, { useState, useEffect } from 'react';
import '../styles/search.css';

const SearchBar = ({ onSearchChange, fetchSuggestions, suggestions, setSuggestions }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue) {
        fetchSuggestions(inputValue);
      } else {
        setSuggestions([]);
      }
    }, 300); // Adjust the debounce delay (in milliseconds) as needed

    return () => {
      clearTimeout(handler); // Cleanup function to clear the timeout if inputValue changes
    };
  }, [inputValue, fetchSuggestions, setSuggestions]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onSearchChange({ value: suggestion });
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearchChange({ value: inputValue });
      setSuggestions([]); // Clear suggestions after pressing enter
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Search for a city..."
        className='input'
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
