// src/views/Dashboard/index.js

import React, { useState, useEffect } from 'react';
import { auth, borrowBook } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await res.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };


  const handleBorrow = async (book) => {
    const email = auth.currentUser?.email;
    if (!email) {
      alert("You must be logged in to borrow books.");
      return;
    }

    const bookInfo = {
      title: book.title,
      authors: book.authors || [],
      timestamp: Date.now()
    };

    await borrowBook(bookInfo, email);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Logged out successfully!");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <div className="app">
      <div className="navbar">
        <h2 className="logo">📚 Book Library</h2>

        {!user ? (
          <div className="login-button-container">
            <button className="login-button" onClick={() => navigate("/login")}>Login</button>
            <button className="login-button" onClick={() => navigate("/register")}>Register</button>
          </div>
        ) : (
          <div className="user-dropdown">
            <img
              src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
              alt="User"
              className="user-avatar"
            />
            <div className="dropdown-content">
              <p>{user.displayName || user.email}</p>
              <a href="/profile">Profile</a>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="book-list">
        <h2>Search Results</h2>
        {searchResults.length === 0 ? (
          <p>No results yet.</p>
        ) : (
          searchResults.map((book) => {
            const info = book.volumeInfo;
            const thumbnail = info.imageLinks?.thumbnail;

            return (
              <div key={book.id} className="book-card">
                {thumbnail && <img src={thumbnail} alt={info.title} />}
                <h3>{info.title}</h3>
                <p>{info.authors?.join(', ')}</p>
                <button onClick={() => handleBorrow(info)}>Borrow</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
