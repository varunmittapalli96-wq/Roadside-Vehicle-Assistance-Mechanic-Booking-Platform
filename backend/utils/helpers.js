const R = 6371;

function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateArrivalMinutes(distanceKm) {
  const avgSpeedKmh = 30;
  return Math.max(5, Math.round((distanceKm / avgSpeedKmh) * 60));
}

function getPriceForService(mechanic, serviceType) {
  const map = {
    breakdown_repair: 'breakdownRepair',
    towing: 'towing',
    battery_jump_start: 'batteryJumpStart',
    flat_tire_repair: 'flatTireRepair',
    fuel_delivery: 'fuelDelivery',
  };
  return mechanic.profile?.pricing?.[map[serviceType]] || 500;
}

module.exports = { haversineDistance, estimateArrivalMinutes, getPriceForService };
