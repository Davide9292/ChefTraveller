'use client';
// client/app/book-a-chef/date/page.js
import Link from 'next/link';
import { useState } from 'react';

export default function Date() {
  const [date, setDate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('date', date);
  };

  return (
    <main className="booking-container">
      <h2>Book a Chef</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <h3>Step 7: Date</h3>
        <div className="form-group">
          <input type="date" value={date} onChange={(e) => {
                setDate(e.target.value);
                localStorage.setItem('date', e.target.value); // Store in localStorage on change
              }} />
        </div>
        <Link href={date ? '/book-a-chef/auth' : ''} legacyBehavior>
          <a className={`next-button ${!date ? 'disabled' : ''}`}>Next</a>
        </Link>
      </form>
    </main>
  );
}