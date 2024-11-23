'use client';
// client/app/book-a-chef/page.js
import Link from 'next/link';
import { useState } from 'react';

export default function BookChef() {
  const [eventDuration, setEventDuration] = useState('');

  const handleDurationChange = (event) => {
    setEventDuration(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('eventDuration', eventDuration);
    console.log('eventDuration stored in localStorage:', eventDuration);
  };

  return (
    <main className="booking-container">
      <h2>Book a Chef</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <h3>Step 1: Event Duration</h3>
        <div className="form-group">
          <input
            type="radio"
            id="one-day"
            name="duration"
            value="one-day"
            checked={eventDuration === 'one-day'}
            onChange={(e) => {
                setEventDuration(e.target.value);
                localStorage.setItem('eventDuration', e.target.value); // Store in localStorage on change
              }}
          />
          <label htmlFor="one-day">One day event</label>
        </div>
        <div className="form-group">
          <input
            type="radio"
            id="multiple-days"
            name="duration"
            value="multiple-days"
            checked={eventDuration === 'multiple-days'}
            onChange={(e) => {
                setEventDuration(e.target.value);
                localStorage.setItem('eventDuration', e.target.value); // Store in localStorage on change
              }}
          />
          <label htmlFor="multiple-days">Several days event</label>
        </div>
        <Link href={eventDuration ? '/book-a-chef/occasion' : ''} legacyBehavior>
          <a className={`next-button ${!eventDuration ? 'disabled' : ''}`}>Next</a>
        </Link>
      </form>
    </main>
  );
}