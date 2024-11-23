'use client';
// client/app/book-a-chef/meal/page.js
import Link from 'next/link';
import { useState } from 'react';

export default function Meal() {
  const [meal, setMeal] = useState('');

  const handleMealChange = (event) => {
    setMeal(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('meal', meal);
  };

  return (
    <main className="booking-container">
      <h2>Book a Chef</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <h3>Step 5: Meal Type</h3>
        <div className="form-group">
          <input
            type="radio"
            id="dinner"
            name="meal"
            value="dinner"
            checked={meal === 'dinner'}
            onChange={(e) => {
                setMeal(e.target.value);
                localStorage.setItem('meal', e.target.value); // Store in localStorage on change
              }}
          />
          <label htmlFor="dinner">Dinner</label>
        </div>
        <div className="form-group">
          <input
            type="radio"
            id="lunch"
            name="meal"
            value="lunch"
            checked={meal === 'lunch'}
            onChange={(e) => {
              setMeal(e.target.value);
                localStorage.setItem('meal', e.target.value); // Store in localStorage on change
            }}
          />
          <label htmlFor="lunch">Lunch</label>
        </div>
        <Link href={meal ? '/book-a-chef/food' : ''} legacyBehavior>
          <a className={`next-button ${!meal ? 'disabled' : ''}`}>Next</a>
        </Link>
      </form>
    </main>
  );
}