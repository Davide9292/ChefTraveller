// client/app/components/Navbar.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchWithRefresh } from '../utils/api'; // Import the function

export default function Navbar() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await fetchWithRefresh("/api/users/me", {
                headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include', // Add this line
          });
          const data = await response.json();
          setUserName(`${data.firstName}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    // Add an event listener for storage changes
    const handleStorageChange = () => {
      fetchUserData();
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);   

    };
  }, []);

  return (
    <nav className="navbar">
      <Link href="/" className="logo">
        ChefTraveller
      </Link>
      <div className="user-section">
        {userName ? (
          <Link href="/host-profile" className="user-name">
            {userName}
          </Link>
        ) : (
          <Link href="/login">
            <div className="user-icon">
                <p>Login</p>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}