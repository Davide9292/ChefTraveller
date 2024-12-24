// client/app/chef-profile/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { fetchWithRefresh } from "../../../utils/api";
import Link from 'next/link';
import Image from "next/image";
import Calendar from 'react-calendar';


export default function ChefProfile({ params }) {
  const [chef, setChef] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);

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

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const handleAvailabilityUpdate = async () => {
    const updatedAvailability = {
      location: selectedLocation,
      startDate: selectedDates[0],
      endDate: selectedDates[1],
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetchWithRefresh(
        `/api/chefs/${chef._id}/availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ availability: updatedAvailability }),
        }
      );

      if (response.ok) {
        alert("Availability updated successfully!");
        const updatedChefResponse = await fetchWithRefresh(`/api/chefs/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });
        const updatedChefData = await updatedChefResponse.json();
        setChef(updatedChefData);
      } else {
        const errorData = await response.json();
        console.error(
          "Error updating availability:",
          errorData.error || response.status
        );
      }
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  if (!chef) {
    return <div>Loading...</div>;
  }

  return (
    <main className="profile-container">
      <h2>
        {chef.firstName} {chef.lastName}
      </h2>

      <div className="profile-details">
        <Image
          src={chef.profilePicture}
          alt={`${chef.firstName} ${chef.lastName}`}
          width={200}
          height={200}
        />
        <p>Specialization: {chef.specialization}</p>
        <p>Biography: {chef.biography}</p>
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

      <h3>Availability</h3>
      <div>
        <label htmlFor="location">Location:</label>
        <select
          id="location"
          value={selectedLocation}
          onChange={handleLocationChange}
        >
          <option value="">Select location</option>
          {/* ... populate with available locations ... */}
        </select>
      </div>
      <div>
        <Calendar
          onChange={handleDateChange}
          value={selectedDates}
          selectRange={true} // Enable date range selection
        />
      </div>
      <button onClick={handleAvailabilityUpdate}>Update Availability</button>
    </main>
  );
}