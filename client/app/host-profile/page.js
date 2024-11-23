// client/app/host-profile/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchWithRefresh } from "../../utils/api";

export default function HostProfile() {
  const [hostData, setHostData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedChef, setSelectedChef] = useState(null);

  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // If no token, redirect to login or handle unauthorized access
          console.error("Unauthorized: Missing token");
          return;
        }

        const response = await fetchWithRefresh(
          "http://localhost:3001/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "Error fetching host data:",
            errorData.error || response.status
          );
          return;
        }

        const data = await response.json();
        setHostData(data);
      } catch (error) {
        console.error("Error fetching host data:", error);
      }
    };

    fetchHostData();
  }, []);

  if (!hostData) {
    return <div>Loading...</div>;
  }

  const handleChefSelection = (bookingId, chefId) => {
    localStorage.setItem(`selectedChef-${bookingId}`, chefId);
  };

  const handleChefDetailsClick = (chef) => {
    setSelectedChef(chef);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <main className="profile-container">
      <h2>Welcome {hostData.firstName}!</h2>
      <h3>Your Bookings</h3>
      <ul>
        {(hostData.bookings || []).map((booking) => (
          <li key={booking._id}>
            <h4>Booking Details</h4>
            <p>Event Type: {booking.eventDuration}</p>
            <p>Occasion: {booking.occasion}</p>
            <p>Location: {booking.location}</p>
            <p>Number of Guests: {booking.guests}</p>
            <p>Meal Type: {booking.meal}</p>
            <p>Food Type: {booking.food}</p>
            <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
            <p>Status:{" "}{booking.proposal ? "Choose your chef" : "Waiting for chef proposals"}</p>
            {booking.proposal && (
              <div>
                <h4>Chef's Proposal</h4>
                <ul>
                  {booking.proposal.chefs.map((proposedChef, index) => {
                    const chef = proposedChef.chef;
                    return (
                      <li key={chef._id}>
                        <p>
                          Chef {index + 1}: {chef.firstName} {chef.lastName}
                        </p>
                        <p>Specialization: {chef.specialization}</p>
                        <p>Price: €{proposedChef.price}</p>
                        <button onClick={() => handleChefDetailsClick(chef)}>
                          Chef Details
                        </button>
                        <button
                          onClick={() =>
                            handleChefSelection(booking._id, chef._id)
                          }
                        >
                          Select Chef
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {localStorage.getItem(`selectedChef-${booking._id}`) && (
              <Link href={`/checkout/${booking._id}`}>
                Proceed to Checkout
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Modal for chef details */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {/* Display chef details */}
            {selectedChef && (
              <div>
                <h3>
                  {selectedChef.firstName} {selectedChef.lastName}
                </h3>
                {/* Add other chef details here */}
                <p>Specialization: {selectedChef.specialization}</p>
                {/* ... other details ... */}
              </div>
            )}
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}