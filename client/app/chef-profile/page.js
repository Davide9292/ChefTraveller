'use client';
// client/app/chef-profile/page.js
export default function ChefProfile() {
    // Fetch chef data based on the logged-in user (replace with actual data fetching)
    const chefData = {
      firstName: 'John',
      lastName: 'Doe',
      specialization: 'Italian Cuisine',
      biography: 'A passionate chef with 10 years of experience...',
      // ... other chef details
    };
  
    return (
      <main className="profile-container">
        <h2>Chef Profile</h2>
        <div className="profile-details">
          {/* Display chef details */}
          <p>Name: {chefData.firstName} {chefData.lastName}</p>
          <p>Specialization: {chefData.specialization}</p>
          <p>Biography: {chefData.biography}</p>
          {/* ... other details */}
        </div>
        {/* Add edit profile button or section */}
      </main>
    );
  }