'use client';
// client/app/book-a-chef/location/page.js
import Link from 'next/link';
import { useState } from 'react';

export default function Location() {
  const [location, setLocation] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('location', location);
  };

  return (
    <main className="booking-container">
      <h2>Book a Chef</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <h3>Step 3: Location</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => {
                setLocation(e.target.value);
                localStorage.setItem('location', e.target.value); // Store in localStorage on change
              }}
          />
        </div>
        <Link href={location ? '/book-a-chef/guests' : ''} legacyBehavior>
          <a className={`next-button ${!location ? 'disabled' : ''}`}>Next</a>
        </Link>
      </form>
    </main>
  );
}