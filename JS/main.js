// ===========================
// LOCAL FOR VOCAL — main.js
// ===========================

// ---- RADIUS SELECTION ----
let selectedRadius = 5;

function selectRadius(btn) {
  document.querySelectorAll('.radius-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedRadius = parseInt(btn.dataset.km);
  console.log('Radius set to:', selectedRadius, 'km');
  // Later: re-fetch shops from Firebase based on new radius
}

// ---- LOCATION DETECTION ----
function detectLocation() {
  const locationText = document.getElementById('locationText');
  const refreshBtn = document.querySelector('.refresh-loc i');

  if (refreshBtn) refreshBtn.style.transform = 'rotate(360deg)';

  if (!navigator.geolocation) {
    locationText.textContent = 'Location not supported';
    return;
  }

  locationText.textContent = 'Detecting...';

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      // Save to session
      sessionStorage.setItem('userLat', latitude);
      sessionStorage.setItem('userLng', longitude);

      // Reverse geocode using free API
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        const area =
          data.address.suburb ||
          data.address.neighbourhood ||
          data.address.city_district ||
          data.address.city ||
          'Your Location';
        locationText.textContent = area;
      } catch {
        locationText.textContent = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
      }
    },
    (error) => {
      locationText.textContent = 'Allow location access';
    }
  );
}

// ---- SEARCH ----
function doSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;
  window.location.href = `explore.html?search=${encodeURIComponent(query)}&radius=${selectedRadius}`;
}

// Allow Enter key in search
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }

  // Auto detect location on load
  detectLocation();
});

// ---- MOBILE MENU ----
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}
