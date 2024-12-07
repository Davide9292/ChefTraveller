"use client"
import { useState } from 'react';
import { fetchWithRefresh } from '../utils/api'; // Import fetchWithRefresh

export default function RequestForm({token}) {
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetchWithRefresh("/api/events", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Make sure this header is set correctly
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
        credentials: 'include', // Add this line
        body: JSON.stringify({
          eventType,
          eventDate,
          numberOfGuests,
          location,
          description,
          user: userId, // You'll need to include the user ID here once authentication is implemented
        }),
      });

      if (response.ok) {
        // Handle successful submission (e.g., show a success message)
        console.log('Event request submitted successfully!');
      } else {
        // Handle error (e.g., show an error message)
        console.error('Error submitting event request:', response.status);
      }
    } catch (error) {
      console.error('Error submitting event request:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Fix the comment syntax */}
      {/* Add form fields for event type, date, number of guests, location, description */}
      <button type="submit">Submit Request</button>
    </form>
  );
}