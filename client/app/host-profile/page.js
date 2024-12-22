// client/app/host-profile/page.js
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchWithRefresh } from "../../utils/api";

export default function HostProfile() {
  const [hostData, setHostData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedChef, setSelectedChef] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null); // Add state for editing booking


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
          "/api/users/me",
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

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
  };
  const handleSubmitEdit = async (bookingId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchWithRefresh(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        // Booking updated successfully
        // Refresh the host data to reflect the changes
        const response = await fetchWithRefresh(
          "/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        setHostData(data);

        setEditingBooking(null); // Clear the editing state
      } else {
        // Handle error
        const errorData = await response.json();
        console.error(
          "Error updating booking:",
          errorData.error || response.status
        );
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  return (
    <main className="profile-container">
      <h2>Welcome {hostData.firstName}!</h2>
      <h3>Your Bookings</h3>
      <ul>
        {(hostData.bookings || []).map((booking) => (
          <li key={booking._id}>
            {editingBooking && editingBooking._id === booking._id ? ( // Render edit form
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const updatedData = {
                    eventDuration: formData.get("eventDuration"),
                    occasion: formData.get("occasion"),
                    location: formData.get("location"),
                    guests: formData.get("guests"),
                    meal: formData.get("meal"),
                    food: formData.get("food"),
                    date: formData.get("date"),
                    comments: formData.get("comments"),
                  };
                  handleSubmitEdit(booking._id, updatedData);
                }}
              >
                <h4>Edit Booking Details</h4>
                <div>
                  <label htmlFor="eventDuration">Event Type:</label>
                  <select
                    id="eventDuration"
                    name="eventDuration"
                    defaultValue={booking.eventDuration}
                  >
                    <option value="one-day">One-day event</option>
                    <option value="multiple-days">Multiple-days event</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="occasion">Occasion:</label>
                  <input
                    type="text"
                    id="occasion"
                    name="occasion"
                    defaultValue={booking.occasion}
                  />
                </div>
                <div>
                  <label htmlFor="location">Location:</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={booking.location}
                  />
                </div>
                <div>
                  <label htmlFor="guests">Number of Guests:</label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    defaultValue={booking.guests}
                  />
                </div>
                <div>
                  <label htmlFor="meal">Meal Type:</label>
                  <select id="meal" name="meal" defaultValue={booking.meal}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="food">Food Type:</label>
                  <input
                    type="text"
                    id="food"
                    name="food"
                    defaultValue={booking.food}
                  />
                </div>
                <div>
                  <label htmlFor="date">Date:</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    defaultValue={booking.date.split('T')[0]}
                  />
                </div>
                <div>
                  <label htmlFor="comments">Comments:</label>
                  <textarea
                    id="comments"
                    name="comments"
                    defaultValue={booking.comments}
                  />
                </div>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditingBooking(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              // Render booking details
              <div>
                <h4>Booking Details</h4>
                <p>Event Type: {booking.eventDuration}</p>
                <p>Occasion: {booking.occasion}</p>
                <p>Location: {booking.location}</p>
                <p>Number of Guests: {booking.guests}</p>
                <p>Meal Type: {booking.meal}</p>
                <p>Food Type: {booking.food}</p>
                <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                <p>
                  Status:{" "}
                  {booking.proposal
                    ? "Choose your chef"
                    : "Waiting for chef proposals"}
                </p>
                {booking.proposal && (
                  <div>
                    <h4>Chef&aposs Proposal</h4>
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
            {booking.status === 'proposal sent' && ( // Show the button if the status is 'proposal sent'
                <button onClick={() => handleRequestNewProposal(booking._id)}>
                  Request New Proposal
                </button>
              )}
                {localStorage.getItem(`selectedChef-${booking._id}`) && (
                  <Link href={`/checkout/${booking._id}`}>
                    <a>Proceed to Checkout</a>
                  </Link>
                )}
                <button onClick={() => handleEditBooking(booking)}>Edit</button>
              </div>
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