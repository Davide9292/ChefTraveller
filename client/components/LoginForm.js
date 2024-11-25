import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithRefresh } from '../utils/api'; // Import fetchWithRefresh


export default function LoginForm({onAuthComplete, bookingId}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Add showPassword state
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetchWithRefresh("/api/auth/login", {
            method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ email, password, bookingId }), // Include bookingId in the request body
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Token:', data.accessToken);
        console.log('Login response data:', data); // Add this line
        localStorage.setItem('token', data.accessToken);

        if (onAuthComplete) {
          await onAuthComplete();
        }
  

        // Fetch user data to determine role
        const userResponse = await fetchWithRefresh("/api/users/me", {
            headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
          credentials: 'include', // Add this line
        });
        const userData = await userResponse.json();
        console.log(data)

        // Redirect to profile page based on role
        if (userData.role === 'staff') {
            router.push('/staff/bookings'); // Redirect to staff page
          } else if (userData.role === 'chef') {
            router.push('/chef-profile');
          } else {
            router.push('/host-profile');
          }
        } else {
        // Handle error, e.g., display an error message to the user
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
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
      <button type="submit">Login</button>
    </form>
  );
}