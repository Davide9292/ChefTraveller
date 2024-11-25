// client/app/components/RegistrationForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithRefresh } from "../utils/api"; // Import fetchWithRefresh


export default function RegistrationForm({ onAuthComplete, bookingId }) { 
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!agreedToPolicies) {
      alert("Please agree to the legal and privacy policies");
      return;
    }

    try {
      const response = await fetchWithRefresh( "/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({   

            firstName,
            lastName,
            email,   

            password,
            role: "host",
            bookingId: bookingId, // Include bookingId in the request body
          }),
        }
      );

      if (response.ok) {
      const data = await response.json();

      // Store the token in localStorage
      localStorage.setItem("token", data.accessToken);

      // Decode the token after it's received
     // const decodedToken = jwt.decode(localStorage.getItem("token"));
     // const userId = decodedToken.userId;

        // Call onAuthComplete before redirecting
        await onAuthComplete();

        router.push("/host-profile");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };
  
    return (
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-password-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
  
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
  
        <div className="form-group">
          <input
            type="checkbox"
            id="agreeToPolicies"
            checked={agreedToPolicies}
            onChange={(e) => setAgreedToPolicies(e.target.checked)} // Fixed to use checked property
            required
          />
          <label htmlFor="agreeToPolicies">
            I agree to the <a href="/legal">Legal</a> and{" "}
            <a href="/privacy">Privacy</a> Policies
          </label>
        </div>
  
        <button type="submit">Confirm Registration</button>
      </form>
    );
  }