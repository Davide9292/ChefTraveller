// client/utils/api.js
export const fetchWithRefresh = async (url, options) => {
    try {
      console.log('Request headers before refresh:', options.headers); // Add this line
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      } else if (response.status === 401) {
        // Refresh the token
        const refreshResponse = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include", // Include cookies in the request
        });
        if (refreshResponse.ok) {
          const newTokenData = await refreshResponse.json();
          const newToken = newTokenData.accessToken;
          localStorage.setItem("token", newToken);
          // Retry the original request with the new token
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return fetch(url, options);
        } else {
          // Handle refresh token error (e.g., redirect to login)
          console.error("Refresh token error:", refreshResponse.status);
          // Add your logic to redirect to login or handle the error
        }
      } else {
        // Handle other API errors
        console.error("API request error:", response.status);
        // Add your logic to handle the error or display an error message
      }
    } catch (error) {
      // Handle network errors
      console.error("API request error:", error);
      // Add your logic to handle the error or display an error message
    }
  };