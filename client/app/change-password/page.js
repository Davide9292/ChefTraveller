// client/app/change-password/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithRefresh } from '../../utils/api';
import jwt from 'jsonwebtoken'; // Import the jwt module

export default function ChangePassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleStep1Submit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true); // Set loading state

    try {
      const token = localStorage.getItem('token');
      const response = await fetchWithRefresh('/api/users/me/password/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword }),
      });

      if (response.ok) {
        setStep(2);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to verify password');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('Failed to verify password');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleStep2Submit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Password validation (ensure it matches the backend validation)
    if (newPassword.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError('New password must be at least 8 characters long and contain at least one special character and one number.');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetchWithRefresh("/api/users/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        alert("Password changed successfully");

        // Redirect based on user role
        const decodedToken = jwt.decode(token); // Decode the token here
        if (decodedToken.role === "chef") {
          router.push(`/chef-profile/${decodedToken.userId}`);
        } else {
          router.push("/host-profile");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="password-change-container">
      <h2>Change Password</h2>
      {error && <div className="error-message">{error}</div>} {/* Display error message */}
      {step === 1 ? (
        <form onSubmit={handleStep1Submit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Next'} {/* Show loading indicator */}
          </button>
        </form>
      ) : (
        <form onSubmit={handleStep2Submit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Confirm
          {isLoading ? 'Changing...' : 'Confirm'} {/* Show loading indicator */}
          </button>
        </form>
      )}
    </main>
  );
}