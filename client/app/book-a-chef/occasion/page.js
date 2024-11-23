'use client';
// client/app/book-a-chef/occasion/page.js
import Link from 'next/link';
import { useState } from 'react';

export default function Occasion() {
  const [occasion, setOccasion] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('occasion', occasion);
  };

  return (
    <main className="booking-container">
      <h2>Book a Chef</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <h3>Step 2: Occasion Type</h3>
        <div className="form-group">
          <select value={occasion} 
          onChange={(e) => {
            setOccasion(e.target.value);
            localStorage.setItem('occasion', e.target.value); // Store in localStorage on change
          }}>
            <option value="">Select Occasion</option>
            <option value="birthday">Birthday</option>
            <option value="wedding">Wedding</option>

            <option value="corporate">Corporate Event</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <Link href={occasion ? '/book-a-chef/location' : ''} legacyBehavior>
          <a className={`next-button ${!occasion ? 'disabled' : ''}`}>Next</a>
        </Link>
      </form>
    </main>
  );
}