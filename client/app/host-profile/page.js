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
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [messageContent, setMessageContent] = useState('');

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


  const handleRequestNewProposal = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchWithRefresh(
        `/api/bookings/${bookingId}/new-proposal`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        // Proposal request sent successfully
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
      } else {
        // Handle error
        const errorData = await response.json();
        console.error(
          "Error requesting new proposal:",
          errorData.error || response.status
        );
      }
    } catch (error) {
      console.error("Error requesting new proposal:", error);
    }
  };

  const handleProposalResponse = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetchWithRefresh(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Booking status updated successfully
        // Refresh the host data to reflect the changes
        const response = await fetchWithRefresh('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });
        const data = await response.json();
        setHostData(data);
      } else {
        // Handle error
        const errorData = await response.json();
        console.error('Error updating booking status:', errorData.error || response.status);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };


  const handleSendMessageClick = (booking) => {
    setSelectedBooking(booking);
    setShowSendMessageModal(true);
  };

  const handleSendMessageModalClose = () => {
    setShowSendMessageModal(false);
    setSelectedBooking(null);
    setMessageRecipient('');
    setMessageContent('');
  };

  const handleSubmitMessage = async (bookingId, content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetchWithRefresh('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ recipientId, bookingId, content }),
      });

      if (response.ok) {
        // Message sent successfully
        alert('Message sent successfully!');
        handleSendMessageModalClose();
      } else {
        // Handle error
        const errorData = await response.json();
        console.error('Error sending message:', errorData.error || response.status);
      }
    } catch (error) {
      console.error('Error sending message:', error);
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
                  Status: {
                    booking.status === 'additional request' ? 'Waiting for new chefs proposal' : 
                    (booking.proposal ? 'Choose your chef' : 'Waiting for chef proposals')
                  }
                </p>
                {booking.proposal && (
                  <div>
                    <h4>Che&aposs Proposal</h4>
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
                    {booking.status === "proposal sent" && (
                      <div>
                        <button
                          onClick={() =>
                            handleProposalResponse(
                              booking._id,
                              "proposal accepted"
                            )
                          }
                        >
                          Accept Proposal
                        </button>
                        <button
                          onClick={() =>
                            handleProposalResponse(
                              booking._id,
                              "proposal rejected"
                            )
                          }
                        >
                          Reject Proposal
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {localStorage.getItem(`selectedChef-${booking._id}`) && (
                  <Link href={`/checkout/${booking._id}`}>
                    <a>Proceed to Checkout</a>
                  </Link>
                )}
                <button onClick={() => handleEditBooking(booking)}>
                  Edit
                </button>
                {booking.status === "proposal sent" && (
                  <button
                    onClick={() => handleRequestNewProposal(booking._id)}
                  >
                    Request New Proposal
                  </button>
                )}
              </div>
            )}
            <button onClick={() => handleSendMessageClick(booking)}>Send Message</button>
          </li>
        ))}
      </ul>

   {/* Modal for sending messages */}
   {showSendMessageModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Send Message</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitMessage(selectedBooking._id, messageContent);
              }}
            >
              <div>
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Send</button>
              <button type="button" onClick={handleSendMessageModalClose}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}


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