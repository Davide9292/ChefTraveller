'use client';
// client/app/book-a-chef/food/page.js
import Link from 'next/link';
import { useState } from 'react';

export default function Food() {
  const [food, setFood] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('food', food);
  };

  return (
    <main className="booking-container">
      <h2>Book a Chef</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <h3>Step 6: Type of Food</h3>
        <div className="form-group">
          <select value={food} onChange={(e) => {
                setFood(e.target.value);
                localStorage.setItem('food', e.target.value); // Store in localStorage on change
              }}>
            <option value="">Select Food Type</option>
            <option value="italian">Italian</option>
            <option value="french">French</option>
            <option value="asian">Asian</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <Link href={food ? '/book-a-chef/date' : ''} legacyBehavior>
          <a className={`next-button ${!food ? 'disabled' : ''}`}>Next</a>
        </Link>
      </form>
    </main>
  );
}