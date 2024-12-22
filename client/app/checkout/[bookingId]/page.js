// client/app/checkout/[bookingId]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithRefresh } from '../../../utils/api'; // Import fetchWithRefresh

export default function Checkout({ params }) {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [selectedChef, setSelectedChef] = useState(null);
  //const [paymentIntent, setPaymentIntent] = useState(null); // To store the PaymentIntent from Stripe

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Use fetchWithRefresh for booking data
        const bookingResponse = await fetchWithRefresh(`/api/bookings/${params.bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include', // Add this line
        }); 
        const bookingData = await bookingResponse.json();
        setBooking(bookingData);

        const chefId = localStorage.getItem(`selectedChef-${params.bookingId}`);
        if (chefId) {
          // Use fetchWithRefresh for chef data
          const chefResponse = await fetchWithRefresh(`/api/chefs/${chefId}`); 
          const chefData = await chefResponse.json();
          setSelectedChef(chefData);

          // Use fetchWithRefresh for creating a PaymentIntent (if it requires authentication)
          const paymentIntentResponse = await fetchWithRefresh('/api/create-payment-intent', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Include Authorization header if required
              // Authorization: `Bearer ${token}`, 
            },
            credentials: 'include', // Add this line
            body: JSON.stringify({ 
              amount: calculateTotalPrice(bookingData, chefData),
            }),
          });
          const paymentIntentData = await paymentIntentResponse.json();
          setPaymentIntent(paymentIntentData.clientSecret);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchBookingData();
  }, [params.bookingId]);

  const handleStripeSubmit = async (event) => {
    event.preventDefault();

    // Use the PaymentIntent client secret to confirm the payment
    // ... Stripe.js integration to handle payment confirmation ...

    // If payment is successful, update booking status on the backend
    try {
      const token = localStorage.getItem('token');
      const response = await fetchWithRefresh(`/api/bookings/${params.bookingId}/confirm`, { 
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', // Add this line
      });

      if (response.ok) {
        // Redirect to a success page or update the UI
        router.push('/bookings/success');
      } else {
        // Handle error
        console.error('Error confirming booking');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  if (!booking || !selectedChef) {
    return <div>Loading...</div>;
  }

  return (
    <main className="checkout-container">
      <h2>Checkout</h2>

      <h3>Booking Details</h3>
      <p>Event Type: {booking.eventDuration}</p>
      <p>Occasion: {booking.occasion}</p>
      <p>Location: {booking.location}</p>
      <p>Number of Guests: {booking.guests}</p>
      <p>Meal Type: {booking.meal}</p>
      <p>Food Type: {booking.food}</p>
      <p>Date: {new Date(booking.date).toLocaleDateString()}</p>

      <h3>Selected Chef</h3>
      <p>Name: {selectedChef.firstName} {selectedChef.lastName}</p>
      <p>Specialization: {selectedChef.specialization}</p>
      {/* ... other chef details ... */}

      <h3>Payment Terms</h3>
      <p>You will be charged 20% of the total price now.</p>
      <p>The remaining amount will be automatically charged 2 days before the event.</p>

      <h3>Cancellation Policy</h3>
      <p>
        Cancellations made more than 3 days before the event will be refunded in full.
      </p>
      <p>
        Cancellations made within 3 days of the event will forfeit the 20% upfront payment.
      </p>

      <form onSubmit={handleStripeSubmit}>
        {/* Integrate Stripe.js elements here */}
        <button type="submit" disabled={!clientSecret}>
          Proceed to Payment
        </button>
      </form>
    </main>
  );
}

{/*
// Helper function to calculate the total price
function calculateTotalPrice(booking, chef) {
  // ... calculate total price based on booking and chef details ...
  // This is just an example, adjust the logic as needed
  const basePrice = 100; // Replace with your actual base price
  const pricePerGuest = 20; // Replace with your actual price per guest
  const totalPrice = basePrice + booking.guests * pricePerGuest;
  return totalPrice;
} */}