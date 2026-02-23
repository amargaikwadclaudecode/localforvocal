// ===========================
// LOCAL FOR VOCAL — explore.js
// ===========================

// Read URL params on load
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  // Pre-select category from URL
  const cat = params.get('cat');
  if (cat && cat !== 'all') {
    const radio = document.querySelector(`input[name="category"][value="${cat}"]`);
    if (radio) {
      radio.checked = true;
      updateResultsTitle(cat);
    }
  }

  // Pre-fill search from URL
  const search = params.get('search');
  if (search) {
    const input = document.getElementById('navSearch');
    if (input) input.value = search;
    document.getElementById('resultsTitle').textContent = `Results for "${search}"`;
  }

  // Pre-select radius from URL
  const radius = params.get('radius');
  if (radius) setRadius(parseInt(radius));

  detectLocation();
});

// ---- RADIUS ----
function updateRadius(val) {
  document.getElementById('radiusValue').textContent = val;
  document.getElementById('radiusDisplay').textContent = val;

  // Update slider gradient
  const slider = document.getElementById('radiusSlider');
  const pct = ((val - 1) / 49) * 100;
  slider.style.background = `linear-gradient(to right, var(--green-main) ${pct}%, var(--border) ${pct}%)`;

  // Update active quick button
  document.querySelectorAll('.radius-quick-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === val + 'km');
  });

  // Update filter chip
  const chip = document.getElementById('chip-radius');
  if (chip) chip.innerHTML = `📍 ${val} km <button onclick="setRadius(10)">×</button>`;
}

function setRadius(km) {
  const slider = document.getElementById('radiusSlider');
  slider.value = km;
  updateRadius(km);
}

// ---- SORT ----
function applySort(val) {
  console.log('Sort by:', val);
  // Will sort Firebase results later
}

// ---- FILTERS ----
function applyFilters() {
  const cat = document.querySelector('input[name="category"]:checked')?.value;
  const openNow = document.getElementById('openNowToggle').checked;
  const featured = document.getElementById('featuredToggle').checked;
  const radius = document.getElementById('radiusSlider').value;

  console.log('Filters applied:', { cat, openNow, featured, radius });
  updateResultsTitle(cat);
  // Will filter Firebase results later
}

function updateResultsTitle(cat) {
  const titles = {
    all: 'All Shops Near You',
    medical: '💊 Medical Shops',
    food: '🍽️ Food & Restaurants',
    carpenter: '🪵 Carpenters',
    goldsmith: '💍 Goldsmiths & Jewellers',
    tailor: '🧵 Tailors & Boutiques',
    electronics: '⚡ Electronics Shops',
    salon: '✂️ Salons & Beauty',
    grocery: '🛒 Grocery & Kirana',
    plumber: '🔧 Plumbers & Electricians',
    auto: '🚗 Auto & Vehicle',
    education: '📚 Education & Tuition',
  };
  const el = document.getElementById('resultsTitle');
  if (el) el.textContent = titles[cat] || 'All Shops Near You';
}

function clearFilters() {
  document.querySelector('input[name="category"][value="all"]').checked = true;
  document.getElementById('openNowToggle').checked = false;
  document.getElementById('featuredToggle').checked = false;
  document.getElementById('radiusSlider').value = 10;
  updateRadius(10);
  updateResultsTitle('all');

  document.querySelectorAll('.rating-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
}

// ---- RATING ----
function setRating(val, btn) {
  document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  console.log('Min rating:', val);
}

// ---- VIEW TOGGLE ----
function setView(type) {
  const listView = document.getElementById('listView');
  const mapView = document.getElementById('mapView');
  const listBtn = document.getElementById('listViewBtn');
  const mapBtn = document.getElementById('mapViewBtn');

  if (type === 'list') {
    listView.style.display = 'block';
    mapView.style.display = 'none';
    listBtn.classList.add('active');
    mapBtn.classList.remove('active');
  } else {
    listView.style.display = 'none';
    mapView.style.display = 'block';
    mapBtn.classList.add('active');
    listBtn.classList.remove('active');
  }
}

// ---- SEARCH ----
function applySearch() {
  const query = document.getElementById('navSearch').value.trim();
  if (!query) return;
  const radius = document.getElementById('radiusSlider').value;
  window.location.href = `explore.html?search=${encodeURIComponent(query)}&radius=${radius}`;
}

// Enter key search
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('navSearch');
  if (input) {
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') applySearch();
    });
  }
});

// ---- MOBILE SIDEBAR ----
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

// ---- LOAD MORE ----
function loadMore() {
  console.log('Loading more shops...');
  // Will load next batch from Firebase later
}
