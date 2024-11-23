// client/app/book-a-chef/auth/page.js
'use client';

import { useState, useEffect } from "react"; // Ensure useEffect is imported
import { useRouter } from "next/navigation";
import LoginForm from "../../../components/LoginForm";
import RegistrationForm from "../../../components/RegistrationForm";

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

    // Check for existing user session on component mount
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        // User is already logged in, redirect to profile page
        router.push("/thank-you");
      }
    }, [router]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleAuthComplete = async () => {
    console.log(
      "eventDuration from localStorage:",
      localStorage.getItem("eventDuration")
    );
    console.log(
      "occasion from localStorage:",
      localStorage.getItem("occasion")
    );
    console.log(
      "location from localStorage:",
      localStorage.getItem("location")
    );
    console.log("guests from localStorage:", localStorage.getItem("guests"));
    console.log("meal from localStorage:", localStorage.getItem("meal"));
    console.log("food from localStorage:", localStorage.getItem("food"));
    console.log("date from localStorage:", localStorage.getItem("date"));

    // Gather booking data from localStorage
    const bookingData = {
      eventDuration: localStorage.getItem("eventDuration"),
      occasion: localStorage.getItem("occasion"),
      location: localStorage.getItem("location"),
      guests: localStorage.getItem("guests"),
      meal: localStorage.getItem("meal"),
      food: localStorage.getItem("food"),
      date: localStorage.getItem("date"),
    };

    console.log("Booking data before sending:", bookingData);

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Log the token
      console.log("Booking data after sending:", bookingData);

      // Fetch user data to determine role
      const userResponse = await fetch("http://localhost:3001/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User data response:", userResponse); // Log the response object
      const userData = await userResponse.json();
      console.log("User data:", userData); // Log the userData object

      const response = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        console.log("Booking created successfully:", response);

        // Clear booking data from localStorage
        localStorage.removeItem("eventDuration");
        localStorage.removeItem("occasion");
        localStorage.removeItem("location");
        localStorage.removeItem("guests");
        localStorage.removeItem("meal");
        localStorage.removeItem("food");
        localStorage.removeItem("date");

        // Redirect based on role
        if (userData.role === "staff") {
          router.push("/staff/bookings"); // Redirect to staff page
        } else if (userData.role === "chef") {
          router.push("/chef-profile");
        } else {
          router.push("/thank-you");
        }
      } else {
        const errorData = await response.json();
        console.error(
          "Error submitting booking data:",
          errorData.error || response.status
        );
      }
    } catch (error) {
      console.error("Error submitting booking data:", error);
    }
  };


  return (
    <main className="booking-container">
      <h2>Book a Chef</h2>
      <h3>Step 8: Authentication</h3>
      {isLogin ? (
        <LoginForm onAuthComplete={handleAuthComplete} bookingId={localStorage.getItem('bookingId')} /> // Pass bookingId as a prop
      ) : (
        <RegistrationForm onAuthComplete={handleAuthComplete} bookingId={localStorage.getItem('bookingId')} /> // Pass bookingId as a prop
      )}
      <button type="button" onClick={toggleForm}>
        {isLogin ? "Need to register?" : "Already have an account?"}
      </button>
    </main>
  );
}