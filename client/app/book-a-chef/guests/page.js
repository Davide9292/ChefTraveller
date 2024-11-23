'use client';
// client/app/book-a-chef/guests/page.js
import Link from 'next/link';
import { useState } from 'react';

export default function Guests() {
  const [guests, setGuests] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('guests', guests);
  };

  return (
    <main className="booking-container">
      <h2>Book a Chef</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <h3>Step 4: Number of Guests</h3>
        <div className="form-group">
          <input
            type="number"
            placeholder="Enter number of guests"
            value={guests}
            onChange={(e) => {
                setGuests(e.target.value);
                localStorage.setItem('guests', e.target.value); // Store in localStorage on change
              }}
          />
        </div>
        <Link href={guests ? '/book-a-chef/meal' : ''} legacyBehavior>
          <a className={`next-button ${!guests ? 'disabled' : ''}`}>Next</a>
        </Link>
      </form>
    </main>
  );
}