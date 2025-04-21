import React from 'react';
import '../styles/SearchBox.css';
import { FiSearch } from 'react-icons/fi'; // 👈 import icon

const SearchBox = ({ placeholder, onChange }) => {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="search-box-input"
      />
      <FiSearch className="search-box-icon" />
    </div>
  );
};

export default SearchBox;
