// server/utils/locationMatching.js
const { geocodeLocation } = require('./geocoding');

async function isChefAvailableAtLocation(bookingLocation, chefAvailability) {
  const bookingGeo = await geocodeLocation(bookingLocation);
  if (!bookingGeo) {
    return false; // Geocoding failed
  }

  for (const availability of chefAvailability) {
    const chefGeo = await geocodeLocation(availability.location);
    if (!chefGeo) {
      continue; // Skip this availability if geocoding failed
    }

    if (
      bookingGeo.city === chefGeo.city || // Exact city match
      (bookingGeo.region && bookingGeo.region === chefGeo.region) || // Region match
      (bookingGeo.country && bookingGeo.country === chefGeo.country) // Country match
    ) {
      return true;
    }
  }
  return false;
}

module.exports = { isChefAvailableAtLocation };