// client/app/staff/bookings/page.js
"use client";

import { useState, useEffect } from "react";
import { fetchWithRefresh } from "../../../utils/api";

export default function StaffBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedChefs, setSelectedChefs] = useState({});
  const [chefPrices, setChefPrices] = useState({});
  const [chefs, setChefs] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showChefDropdown, setShowChefDropdown] = useState({}); // State to control chef dropdowns

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetchWithRefresh("/api/bookings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
  
        if (!response.ok) {
          // Handle API error based on status code
          if (response.status === 401) {
            console.error("Unauthorized to fetch bookings");
            // Redirect to login or show an error message
          } else if (response.status === 403) {
            console.error("Forbidden to fetch bookings");
            // Show an error message or redirect to an unauthorized page
          } else {
            console.error("Error fetching bookings:", response.status);
            // Show a generic error message
          }
          return;
        }
  
        const data = await response.json();
        setBookings(data);
  
        // Fetch chefs for each booking after bookings are fetched
        data.forEach((booking) => {
          fetchChefs(booking.location);
        });
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
  
    const fetchChefs = async (bookingLocation) => {
      try {
        const response = await fetchWithRefresh(
          `/api/chefs?available=${availableOnly}&location=${bookingLocation}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );
  
        if (!response.ok) {
          // Handle API error based on status code
          if (response.status === 401) {
            console.error("Unauthorized to fetch chefs");
            // Redirect to login or show an error message
          } else if (response.status === 403) {
            console.error("Forbidden to fetch chefs");
            // Show an error message or redirect to an unauthorized page
          } else {
            console.error("Error fetching chefs:", response.status);
            // Show a generic error message
          }
          return;
        }
  
        const data = await response.json();
        setChefs(data);
      } catch (error) {
        console.error("Error fetching chefs:", error);
      }
    };
  
    fetchBookings(); // Call fetchBookings to initiate the process
  }, [availableOnly]);

  function isChefAvailableForBooking(bookingStart, bookingEnd, chefAvailability) {
    // Check if the chef has any availability entries that cover the entire booking period
    return chefAvailability.some(availability => {
      const startDate = new Date(availability.startDate);
      const endDate = new Date(availability.endDate);
      return startDate <= bookingStart && endDate >= bookingEnd;
    });
  }


  {/* const handleChefSelection = (bookingId, chefId, isChecked) => {
    setSelectedChefs((prevSelectedChefs) => ({
      ...prevSelectedChefs,
      [bookingId]: {
        ...prevSelectedChefs[bookingId],
        [chefId]: isChecked,
        },
      }));
    }; */}

  const handlePriceChange = (bookingId, chefId, price) => {
    setChefPrices((prevChefPrices) => ({
      ...prevChefPrices,
      [bookingId]: {
        ...prevChefPrices[bookingId],
        [chefId]: price,
      },
    }));
  };

  // const handleFilterChange = (event) => {
  //   setAvailableOnly(event.target.checked);
  // };


  const handleChefDropdownToggle = (bookingId, chefIndex) => {
    setShowChefDropdown((prevShowChefDropdown) => ({
      ...prevShowChefDropdown,
      [bookingId]: {
        ...prevShowChefDropdown[bookingId],
        [chefIndex]: !prevShowChefDropdown[bookingId]?.[chefIndex],
      },
    }));
  };

  const handleChefSelect = (bookingId, chefIndex, chefId) => {
    setSelectedChefs((prevSelectedChefs) => ({
      ...prevSelectedChefs,
      [bookingId]: {
        ...prevSelectedChefs[bookingId],
        [chefIndex]: chefId,
      },
    }));
    handleChefDropdownToggle(bookingId, chefIndex); // Close the dropdown after selection
  };

  const handleChefDelete = (bookingId, chefIndex) => {
    setSelectedChefs((prevSelectedChefs) => ({
      ...prevSelectedChefs,
      [bookingId]: {
        ...prevSelectedChefs[bookingId],
        [chefIndex]: null, // Set the selected chef to null to remove it
      },
    }));

    // Optionally, also clear the price for the deleted chef
    setChefPrices((prevChefPrices) => ({
      ...prevChefPrices,
      [bookingId]: {
        ...prevChefPrices[bookingId],
        [chefIndex]: "",
      },
    }));
  };


  const handleSendProposal = async (bookingId) => {
    if (confirm("Are you sure you want to send this proposal?")) {
      try {
        const token = localStorage.getItem("token");
        const chefs = [
          selectedChefs[bookingId]?.[1],
          selectedChefs[bookingId]?.[2],
          selectedChefs[bookingId]?.[3],
        ].filter((chefId) => chefId); // Filter out null or undefined chef IDs
  
        const prices = [
          chefPrices[bookingId]?.[1],
          chefPrices[bookingId]?.[2],
          chefPrices[bookingId]?.[3],
        ];
  
        const proposalData = {
          bookingId,
          chefs: chefs.map((chefId, index) => ({
            chefId,
            price: prices[index] || 0,
          })),
        };
  
        const response = await fetchWithRefresh(
          "/api/proposals",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify(proposalData),
          }
        );
  
        if (response.ok) {
          console.log("Proposal sent successfully");
          // Refresh the page after sending the proposal
          location.reload(); 
        } else {
          console.error("Error sending proposal");
        }
      } catch (error) {
        console.error("Error sending proposal:", error);
      }
    }
  };

  const handleBookingStatusChange = async (bookingId, status) => {
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
        // Refresh the bookings data to reflect the changes
        const response = await fetchWithRefresh('http://localhost:3001/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });
        const data = await response.json();
        setBookings(data);
      } else {
        // Handle error
        const errorData = await response.json();
        console.error('Error updating booking status:', errorData.error || response.status);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const [messages, setMessages] = useState({}); // State to store messages for each booking
    
  const fetchMessages = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetchWithRefresh(`/api/users/me/messages?bookingId=${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) => ({
          ...prevMessages,
          [bookingId]: data,
        }));
      } else {
        // Handle error
        const errorData = await response.json();
        console.error('Error fetching messages:', errorData.error || response.status);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  return (
    <main className="bookings-container">
      <h2>Staff Bookings</h2>
      <ul>
        {bookings.map((booking) => {
          // Calculate date range for the booking
          const bookingStart = new Date(booking.date);
          const bookingEnd = new Date(booking.date);
          // bookingEnd.setDate(bookingStart.getDate() + (parseInt(booking.eventDuration) - 1)); // Assuming eventDuration is a number of days

          return (
            <li key={booking._id}>
              <h3>Booking Details</h3>
              <p>Status {booking.status === 'additional request' ? 'Waiting for new chefs proposal' : booking.status}</p>
              <p>Event Type: {booking.eventDuration}</p>
              <p>Occasion: {booking.occasion}</p>
              <p>Location: {booking.location}</p>
              <p>Number of Guests: {booking.guests}</p>
              <p>Meal Type: {booking.meal}</p>
              <p>Food Type: {booking.food}</p>
              <p>
                Date: {bookingStart.toLocaleDateString()} - {bookingEnd.toLocaleDateString()}
              </p>
              <p>
                User: {booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'N/A'}
              </p>

              <h3>Select Chefs and Set Prices</h3>
              <div>
                <input
                  type="checkbox"
                  id="availableOnly"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                />
                <label htmlFor="availableOnly">
                  Only show available chefs
                </label>
              </div>

              <h3>Messages</h3>
              <ul>
              {/* Call fetchMessages for each booking */}
              {fetchMessages(booking._id)} 
                {(messages[booking._id] || []).map((message) => (
                  <li key={message._id}>
                    <p>From: {message.sender.firstName} {message.sender.lastName}</p>
                    <p>To: {message.recipient.firstName} {message.recipient.lastName}</p>
                    <p>{message.content}</p>
                  </li>
                ))}
              </ul>

              {/* Conditionally render chef selection or proposal summary */}
              {booking.status === "new request" ||
              booking.status === "additional request" ? (
                // Show chef selection UI if the status is 'new request' or 'additional request'
                [1, 2, 3].map((chefIndex) => (
                  <div key={chefIndex}>
                    <h4>Chef {chefIndex}</h4>
                    {selectedChefs[booking._id]?.[chefIndex] ? (
                      <div>
                        {
                          chefs.find(
                            (chef) =>
                              chef._id ===
                              selectedChefs[booking._id]?.[chefIndex]
                          )?.firstName
                        }{" "}
                        {
                          chefs.find(
                            (chef) =>
                              chef._id ===
                              selectedChefs[booking._id]?.[chefIndex]
                          )?.lastName
                        }
                        <button
                          onClick={() =>
                            handleChefDropdownToggle(booking._id, chefIndex)
                          }
                        >
                          Change Chef
                        </button>
                        <button
                          onClick={() =>
                            handleChefDelete(booking._id, chefIndex)
                          }
                        >
                          Delete Chef
                        </button>
                        <div className="price-input">
                          <span className="euro-symbol">€</span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={
                              chefPrices[booking._id]?.[chefIndex] || ""
                            }
                            onChange={(e) =>
                              handlePriceChange(
                                booking._id,
                                chefIndex,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleChefDropdownToggle(booking._id, chefIndex)
                        }
                      >
                        Select Chef
                      </button>
                    )}
                    {showChefDropdown[booking._id]?.[chefIndex] && (
                      <ul className="chef-dropdown">
                        {chefs
                          .filter((chef) =>
                            availableOnly
                              ? isChefAvailableAtLocation(
                                  booking.location,
                                  chef.availability
                                )
                              : true
                          )
                          .map((chef) => (
                            <li key={chef._id}>
                              <button
                                onClick={() =>
                                  handleChefSelect(
                                    booking._id,
                                    chefIndex,
                                    chef._id
                                  )
                                }
                              >
                                {chef.firstName} {chef.lastName} -{" "}
                                {isChefAvailableForBooking(
                                  bookingStart,
                                  bookingEnd,
                                  chef.availability
                                )
                                  ? "Available"
                                  : "Not Available"}
                              </button>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                // Show proposal summary for all other statuses
                <div>
                  <h4>Proposed Chefs</h4>
                  <ul>
                    {booking.proposal.chefs.map((chef, index) => (
                      <li key={index}>
                        <p>
                          Chef {index + 1}: {chef.chef.firstName}{" "}
                          {chef.chef.lastName} - Price: €{chef.price}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p>Proposal sent, waiting for host`&apos;` response</p>
                </div>
              )}

              {/* Conditionally render the Send Proposal button */}
              {(booking.status === "new request" ||
                booking.status === "additional request") && (
                <button onClick={() => handleSendProposal(booking._id)}>
                  Send Proposal
                </button>
              )}

              {/* Add buttons to update booking status */}
              {booking.status === "proposal sent" && (
                <div>
                  <button
                    onClick={() =>
                      handleBookingStatusChange(
                        booking._id,
                        "additional request"
                      )
                    }
                  >
                    Additional Request
                  </button>
                  <button
                    onClick={() =>
                      handleBookingStatusChange(
                        booking._id,
                        "proposal rejected"
                      )
                    }
                  >
                    Reject Proposal
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}