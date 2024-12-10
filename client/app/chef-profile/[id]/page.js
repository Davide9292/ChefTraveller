// client/app/chef-profile/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { fetchWithRefresh } from "../../../utils/api";
import Link from 'next/link';
import Image from "next/image";


export default function ChefProfile({ params }) {
  const [chef, setChef] = useState(null);
  useEffect(() => {
    const fetchChef = async () => {
      try {
        const response = await fetchWithRefresh(`/api/chefs/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });
        const data = await response.json();
        setChef(data);
      } catch (error) {
        console.error("Error fetching chef:", error);
      }
    };

    fetchChef();
  }, [params.id]);

  if (!chef) {
    return <div>Loading...</div>;
  }
  
  return (
    <main className="profile-container">
      <h2>
        {chef.firstName} {chef.lastName}
      </h2>
  
      <div className="profile-details">
        <Image src={chef.profilePicture} alt={`${chef.firstName} ${chef.lastName}`} />
        <p>Specialization: {chef.specialization}</p>
        <p>Biography: {chef.biography}</p>
        {/* ... other chef details ... */}
      </div>
  
      <h3>Confirmed Bookings</h3>
      <ul>
        {chef.bookings.map((booking) => (
          <li key={booking._id}>
            <h4>Booking Details</h4>
            <p>Event Type: {booking.eventDuration}</p>
            <p>Occasion: {booking.occasion}</p>
            <p>Location: {booking.location}</p>
            <p>Number of Guests: {booking.guests}</p>
            <p>Meal Type: {booking.meal}</p>
            <p>Food Type: {booking.food}</p>
            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
            {/* ... other booking details ... */}
          </li>
        ))}
      </ul>
      <h3>Profile Settings</h3>
          <Link href="/change-password">
            <a>
              <h4>Change Password</h4>
              <button>Change</button>
            </a>
          </Link>
    </main>
  );
}