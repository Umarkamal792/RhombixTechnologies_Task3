// // src/screen/Profile/index.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getBorrowedBooks, returnBook, auth } from '../../config/firebase';
import './profile.css';

function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const profileData = await getProfile();
    const email = auth.currentUser?.email;
    const currentUserProfile = profileData.find(profile => profile.email === email);
    setUserInfo(currentUserProfile);

    if (email) {
      const borrowed = await getBorrowedBooks(email);
      setBorrowedBooks(borrowed);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReturn = async (title) => {
    const email = auth.currentUser?.email;
    if (!email) return;

    await returnBook(email, title);
    fetchData(); 
    alert("Book returned successfully!");
  };

 
  if (!userInfo) {
    return (
      <div className="loading-screen">
        <img
          src="https://gifdb.com/images/high/buffering-animated-text-icon-loading-u1h739who8u5mtw3.gif"
          alt="Loading..."
          className="loading-gif"
        />
      </div>
    );
  }
  

  return (
    <div className="profile-container">
      <img
        src='https://static-00.iconduck.com/assets.00/circle-arrow-left-icon-512x512-xp8okg5c.png'
        alt="Back to Dashboard"
        className="back-arrow"
        onClick={() => navigate('/')} 
      />
      
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {userInfo.fullname}</p>
      <p><strong>Age:</strong> {userInfo.age}</p>
      <p><strong>Email:</strong> {userInfo.email}</p>
      <p><strong>User ID:</strong> {userInfo.userId}</p>

      <div className="my-library">
        <h2>📕 My Borrowed Books</h2>
        {borrowedBooks.length === 0 ? (
          <p>No books borrowed yet.</p>
        ) : (
          borrowedBooks.map((book, idx) => (
            <div key={idx} className="book-card">
              {book.imageUrl && <img src={book.imageUrl} alt={book.title} className="book-image" />}
              <h3>{book.title}</h3>
              <p>{book.authors?.join(', ')}</p>
              <p><i>Borrowed on:</i> {new Date(book.timestamp).toLocaleDateString()}</p>
              <button onClick={() => handleReturn(book.title)}>Return</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
