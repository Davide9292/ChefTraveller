// server/utils/geocoding.js
const { geocode } = require("@opencage/geocode");

const opencage = geocode({ key: "703f08c84835408cb4ae29f95834ab98" }); // Replace with your actual API key

async function geocodeLocation(location) {
  try {
    const result = await opencage.geocode({ q: location });
    const { components, geometry } = result.results[0];
    return {
      country: components.country,
      region: components.state || components.state_district,
      city: components.city || components.town || components.village,
      latitude: geometry.lat,
      longitude: geometry.lng,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

module.exports = { geocodeLocation };