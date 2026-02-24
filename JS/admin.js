// ===========================
// LOCAL FOR VOCAL — admin.js
// ===========================

const ADMIN_PASSWORD = 'admin123'; // Change this before going live!

// ---- LOGIN ----
function adminLogin() {
  const password = document.getElementById('adminPassword').value;
  if (password === ADMIN_PASSWORD) {
    document.getElementById('adminLoginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    startAdminClock();
  } else {
    const input = document.getElementById('adminPassword');
    input.style.borderColor = '#c62828';
    input.value = '';
    input.placeholder = 'Wrong password. Try again.';
    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = 'Enter admin password';
    }, 2000);
  }
}

function adminLoginEnter(e) {
  if (e.key === 'Enter') adminLogin();
}

function adminLogout() {
  if (confirm('Logout from admin panel?')) {
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminLoginScreen').style.display = 'flex';
    document.getElementById('adminPassword').value = '';
  }
}

// ---- CLOCK ----
function startAdminClock() {
  function updateTime() {
    const now = new Date();
    document.getElementById('adminTime').textContent =
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      ' — ' +
      now.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// ---- TAB SWITCHING ----
function adminSwitchTab(name, navItem) {
  document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));

  const tab = document.getElementById(`adminTab-${name}`);
  if (tab) tab.style.display = 'block';
  if (navItem) navItem.classList.add('active');

  const titles = {
    overview: 'Overview',
    shops: 'Manage Shops',
    users: 'Manage Users',
    requirements: 'All Requirements',
    subscriptions: 'Subscriptions',
    reviews: 'Manage Reviews',
    reports: 'Reports & Complaints',
    categories: 'Manage Categories'
  };

  document.getElementById('adminTopbarTitle').textContent = titles[name] || name;

  // Close mobile sidebar
  document.getElementById('adminSidebar').classList.remove('open');
  document.getElementById('adminOverlay').classList.remove('active');
}

// ---- SIDEBAR TOGGLE ----
function toggleAdminSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
  document.getElementById('adminOverlay').classList.toggle('active');
}

// ---- SHOP ACTIONS ----
function approveShop(btn) {
  const row = btn.closest('tr');
  const shopName = row.querySelector('.shop-cell span:last-child').textContent;
  const statusCell = row.querySelector('.status-badge');

  statusCell.textContent = 'Active';
  statusCell.className = 'status-badge active-status';

  // Replace approve/reject with feature/suspend buttons
  const actionCell = row.querySelector('.action-cell');
  actionCell.innerHTML = `
    <button class="action-icon-btn feature" onclick="toggleFeature(this)" title="Toggle Featured"><i class="fas fa-crown"></i></button>
    <button class="action-icon-btn suspend" onclick="suspendShop(this)" title="Suspend"><i class="fas fa-ban"></i></button>
    <button class="action-icon-btn view" onclick="viewShop(this)" title="View"><i class="fas fa-eye"></i></button>
  `;

  row.dataset.status = 'active';
  adminToast(`✅ ${shopName} approved and is now live!`);
  updatePendingCount(-1);
}

function rejectShop(btn) {
  const row = btn.closest('tr');
  const shopName = row.querySelector('.shop-cell span:last-child').textContent;
  if (confirm(`Reject and remove "${shopName}"?`)) {
    row.style.opacity = '0';
    row.style.transition = 'opacity 0.3s';
    setTimeout(() => row.remove(), 300);
    adminToast(`❌ ${shopName} has been rejected`);
    updatePendingCount(-1);
  }
}

function suspendShop(btn) {
  const row = btn.closest('tr');
  const shopName = row.querySelector('.shop-cell span:last-child').textContent;
  if (confirm(`Suspend "${shopName}"? They will not be visible to customers.`)) {
    row.querySelector('.status-badge').textContent = 'Suspended';
    row.querySelector('.status-badge').className = 'status-badge suspended-status';
    row.dataset.status = 'suspended';
    adminToast(`⛔ ${shopName} has been suspended`);
  }
}

function deleteShop(btn) {
  const row = btn.closest('tr');
  const shopName = row.querySelector('.shop-cell span:last-child').textContent;
  if (confirm(`Permanently delete "${shopName}"? This cannot be undone.`)) {
    row.style.opacity = '0';
    setTimeout(() => row.remove(), 300);
    adminToast(`🗑️ ${shopName} deleted permanently`);
  }
}

function toggleFeature(btn) {
  const row = btn.closest('tr');
  const shopName = row.querySelector('.shop-cell span:last-child').textContent;
  const subBadge = row.querySelector('.sub-badge');

  if (subBadge.classList.contains('featured-sub')) {
    subBadge.textContent = 'Free';
    subBadge.className = 'sub-badge free-sub';
    adminToast(`⭐ Featured removed from ${shopName}`);
  } else {
    subBadge.textContent = 'Featured ⭐';
    subBadge.className = 'sub-badge featured-sub';
    adminToast(`⭐ ${shopName} is now Featured!`);
  }
}

function viewShop(btn) {
  window.open('../shop-profile.html', '_blank');
}

function updatePendingCount(change) {
  const badge = document.querySelector('.admin-nav-badge.pending');
  if (badge) {
    const current = parseInt(badge.textContent) || 0;
    const newCount = current + change;
    badge.textContent = newCount > 0 ? `${newCount} Pending` : '';
  }
}

// ---- FILTER SHOPS ----
function filterShops() {
  const search = document.getElementById('shopSearchInput').value.toLowerCase();
  const statusFilter = document.getElementById('shopStatusFilter').value;
  const rows = document.querySelectorAll('#shopsTable tbody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const status = row.dataset.status;
    const matchSearch = text.includes(search);
    const matchStatus = statusFilter === 'all' || status === statusFilter;
    row.style.display = matchSearch && matchStatus ? '' : 'none';
  });
}

// ---- USER ACTIONS ----
function suspendUser(btn) {
  const row = btn.closest('tr');
  const name = row.querySelector('.shop-cell span:last-child').textContent;
  if (confirm(`Suspend user "${name}"?`)) {
    row.querySelector('.status-badge').textContent = 'Suspended';
    row.querySelector('.status-badge').className = 'status-badge suspended-status';
    adminToast(`⛔ User ${name} suspended`);
  }
}

// ---- REQUIREMENTS ----
function deleteRequirement(btn) {
  const row = btn.closest('tr');
  if (confirm('Delete this requirement?')) {
    row.style.opacity = '0';
    setTimeout(() => row.remove(), 300);
    adminToast('🗑️ Requirement deleted');
  }
}

// ---- SUBSCRIPTIONS ----
function revokeSubscription(btn) {
  const row = btn.closest('tr');
  const shopName = row.querySelector('.shop-cell span:last-child').textContent;
  if (confirm(`Revoke subscription for "${shopName}"?`)) {
    row.querySelector('.status-badge').textContent = 'Revoked';
    row.querySelector('.status-badge').className = 'status-badge suspended-status';
    adminToast(`⛔ Subscription revoked for ${shopName}`);
  }
}

function addManualSub() {
 const inputs = document.querySelectorAll('.manual-sub-form .form-input');
const shopName = inputs[0].value.trim();
const shopPhone = inputs[1].value.trim();
const plan = inputs[2].value;
const startDate = inputs[3].value;

if (shopPhone.length !== 10) { adminToast('⚠️ Please enter valid 10 digit phone number'); return; }
  if (!shopName) { adminToast('⚠️ Please enter a shop name'); return; }
  if (!startDate) { adminToast('⚠️ Please select a start date'); return; }

  // Get plan details
  const isMonthly = plan.includes('Monthly');
  const amount = isMonthly ? 499 : 1197;
  const planLabel = isMonthly ? 'Monthly' : 'Quarterly';

  // Calculate expiry date
  const start = new Date(startDate);
  const expiry = new Date(startDate);
  isMonthly ? expiry.setMonth(expiry.getMonth() + 1) : expiry.setMonth(expiry.getMonth() + 3);
  const formatDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Add row to subscriptions table
  const tbody = document.querySelector('#adminTab-subscriptions .admin-table tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><div class="shop-cell"><span class="shop-emoji">🏪</span><span>${shopName}</span></div></td>
    <td>${planLabel}</td>
    <td>₹${amount.toLocaleString()}</td>
    <td>${formatDate(start)}</td>
    <td>${formatDate(expiry)}</td>
    <td><span class="status-badge active-status">Active</span></td>
    <td class="action-cell">
      <button class="action-icon-btn reject" onclick="revokeSubscription(this)" title="Revoke">
        <i class="fas fa-ban"></i>
      </button>
    </td>
  `;
  tbody.appendChild(newRow);

  // Update monthly revenue stat
  const revenueStat = document.querySelector('.sub-stat-val:nth-child(1)');
  const allStats = document.querySelectorAll('.sub-stat-val');
  // Find the revenue stat (₹ sign)
  allStats.forEach(stat => {
    if (stat.textContent.includes('₹')) {
      const current = parseInt(stat.textContent.replace(/[₹,]/g, '')) || 0;
      const newTotal = current + amount;
      stat.textContent = '₹' + newTotal.toLocaleString('en-IN');
    }
  });

  // Update active featured count
  allStats.forEach((stat, index) => {
    if (index === 0 && !stat.textContent.includes('₹')) {
      stat.textContent = parseInt(stat.textContent) + 1;
    }
  });

  // Clear form
  inputs[0].value = '';
  inputs[2].value = '';

  adminToast(`✅ Subscription added for ${shopName} — ₹${amount.toLocaleString()} added to revenue!`);
}

// ---- REVIEWS ----
function deleteReview(btn) {
  const row = btn.closest('tr');
  if (confirm('Delete this review?')) {
    row.style.opacity = '0';
    setTimeout(() => row.remove(), 300);
    adminToast('🗑️ Review deleted');
  }
}

// ---- REPORTS ----
function suspendFromReport(btn) {
  const card = btn.closest('.report-card');
  card.style.opacity = '0.5';
  card.style.pointerEvents = 'none';
  adminToast('⛔ Shop suspended from report!');
}

function deleteReviewFromReport(btn) {
  const card = btn.closest('.report-card');
  card.style.opacity = '0.5';
  card.style.pointerEvents = 'none';
  adminToast('🗑️ Review deleted!');
}

function dismissReport(btn) {
  const card = btn.closest('.report-card');
  card.style.opacity = '0';
  setTimeout(() => card.remove(), 300);
  adminToast('Report dismissed');
}

function addCategory() {
  const name = prompt('Enter new category name:');
  if (!name) return;
  const emoji = prompt('Enter an emoji for this category (e.g. 🏪):') || '🏪';

  const grid = document.querySelector('.categories-manage-grid');
  const addBtn = grid.querySelector('.add-cat-card');

  // Create new category card
  const card = document.createElement('div');
  card.className = 'cat-manage-card';
  card.innerHTML = `
    <span class="cat-emoji">${emoji}</span>
    <span class="cat-name">${name}</span>
    <span class="cat-count">0 shops</span>
    <button class="cat-edit-btn" onclick="editCategory(this)">
      <i class="fas fa-pen"></i>
    </button>
  `;

  // Insert before the Add button
  grid.insertBefore(card, addBtn);
  adminToast(`✅ Category "${name}" added!`);
}

// ---- TOAST ----
function adminToast(message) {
  const existing = document.querySelector('.admin-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #1a1a2e;
    color: white;
    padding: 12px 22px;
    border-radius: 50px;
    font-size: 0.88rem;
    font-weight: 500;
    z-index: 999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    font-family: 'DM Sans', sans-serif;
    animation: slideUp 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
