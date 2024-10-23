import React from 'react';
import axios from 'axios';

interface HeaderProps {
  Title: string;
  toggleCreateArea: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const handleLogout = async () => {
    try {
      await axios.get('/logout');
      window.location.href = '/home';
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <div className="header">
      <h1>To Do List</h1>
      <h1>{props.Title}</h1>
      <button onClick={props.toggleCreateArea} className="add-button">
        Add
      </button>
      <button
        style={{
          top: '70px',
        }}
        className="add-button"
        onClick={handleLogout} 
      >
        Log out
      </button>
    </div>
  );
}

export default Header;
