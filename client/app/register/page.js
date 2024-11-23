// app/register/page.js
'use client';

import RegistrationForm from "../../components/RegistrationForm";

export default function Register() {
  // Add a simple function to handle registration completion
  const handleRegistrationComplete = () => {
    console.log('Registration complete!');
    // You can add further logic here, like redirecting to a success page
  };

  return (
    <main className="auth-container">
      <h2>Register</h2>
      <RegistrationForm onAuthComplete={handleRegistrationComplete} /> {/* Pass the function as a prop */}
    </main>
  );
}