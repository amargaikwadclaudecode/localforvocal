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

  if (name === 'subscriptions') checkSubscriptionExpiry(); 
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

  if (!shopName) { adminToast('Please enter a shop name'); return; }
  if (shopPhone.length !== 10) { adminToast('Please enter valid 10 digit phone number'); return; }
  if (!startDate) { adminToast('Please select a start date'); return; }

  const isMonthly = plan.includes('Monthly');
  const amount = isMonthly ? 499 : 1197;
  const planLabel = isMonthly ? 'Monthly' : 'Quarterly';

  const start = new Date(startDate);
  const expiry = new Date(start);
  if (isMonthly) {
    expiry.setMonth(expiry.getMonth() + 1);
  } else {
    expiry.setMonth(expiry.getMonth() + 3);
  }

  const startStr = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const expiryStr = expiry.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const tbody = document.querySelector('#adminTab-subscriptions .admin-table tbody');
  const newRow = document.createElement('tr');

  const td1 = document.createElement('td');
  td1.innerHTML = '<div class="shop-cell"><span class="shop-emoji">🏪</span><div><span>' + shopName + '</span><small style="color:var(--text-light);display:block">+91 ' + shopPhone + '</small></div></div>';

  const td2 = document.createElement('td');
  td2.textContent = planLabel;

  const td3 = document.createElement('td');
  td3.textContent = '₹' + amount;

  const td4 = document.createElement('td');
  td4.textContent = startStr;

  const td5 = document.createElement('td');
  td5.textContent = expiryStr;

  const td6 = document.createElement('td');
  td6.innerHTML = '<span class="status-badge active-status">Active</span>';

  const td7 = document.createElement('td');
  td7.className = 'action-cell';
  td7.innerHTML = '<button class="action-icon-btn reject" onclick="revokeSubscription(this)" title="Revoke"><i class="fas fa-ban"></i></button>';

  newRow.appendChild(td1);
  newRow.appendChild(td2);
  newRow.appendChild(td3);
  newRow.appendChild(td4);
  newRow.appendChild(td5);
  newRow.appendChild(td6);
  newRow.appendChild(td7);
  tbody.appendChild(newRow);

  const revenueEl = document.querySelectorAll('.sub-stat')[1].querySelector('.sub-stat-val');
  const currentRevenue = parseInt(revenueEl.textContent.replace(/[₹,]/g, '')) || 0;
  revenueEl.textContent = '₹' + (currentRevenue + amount).toLocaleString('en-IN');

  const activeEl = document.querySelectorAll('.sub-stat')[0].querySelector('.sub-stat-val');
  activeEl.textContent = parseInt(activeEl.textContent) + 1;

  inputs[0].value = '';
  inputs[1].value = '';
  inputs[3].value = '';

  adminToast('Subscription added for ' + shopName + ' — ₹' + amount + ' added to revenue!');
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
// ---- REPORTS & INVESTIGATION ----
function investigateReport(id, btn) {
  const box = document.getElementById('investigation-' + id);
  const card = btn.closest('.report-card');
  const badge = document.getElementById('badge-' + id);
  const isOpen = box.style.display !== 'none';

  if (isOpen) {
    box.style.display = 'none';
    btn.innerHTML = '<i class="fas fa-search"></i> Investigate';
    btn.classList.remove('active-inv');
  } else {
    box.style.display = 'block';
    btn.innerHTML = '<i class="fas fa-chevron-up"></i> Close';
    btn.classList.add('active-inv');
    card.classList.add('investigating');

    if (badge && badge.textContent === 'New') {
      badge.textContent = 'Investigating';
      badge.className = 'activity-badge';
      badge.style.background = '#e3f2fd';
      badge.style.color = '#1565c0';
      updateReportStats();
    }
  }
}

function addInvestigationNote(id) {
  const input = document.getElementById('invInput-' + id);
  const note = input.value.trim();
  if (!note) return;

  const timeline = document.getElementById('timeline-' + id);
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const noteEl = document.createElement('div');
  noteEl.className = 'inv-note';
  noteEl.innerHTML =
    '<div class="inv-note-dot"></div>' +
    '<div class="inv-note-body">' +
      '<div class="inv-note-text">' + note + '</div>' +
      '<span class="inv-note-time">Admin — Today ' + now + '</span>' +
    '</div>';

  timeline.appendChild(noteEl);
  input.value = '';
  timeline.scrollTop = timeline.scrollHeight;
  adminToast('Note added to investigation');
}

function suspendFromReport(btn, id) {
  const card = btn.closest('.report-card');
  const badge = document.getElementById('badge-' + id);
  if (confirm('Suspend this shop? It will be hidden from all customers.')) {
    card.classList.remove('investigating');
    card.classList.add('resolved');
    if (badge) {
      badge.textContent = 'Resolved — Suspended';
      badge.className = 'activity-badge';
      badge.style.background = '#ffebee';
      badge.style.color = '#c62828';
    }
    const box = document.getElementById('investigation-' + id);
    if (box) box.style.display = 'none';
    updateReportStats();
    adminToast('Shop suspended and report resolved');
  }
}

function deleteReviewFromReport(btn, id) {
  const card = btn.closest('.report-card');
  const badge = document.getElementById('badge-' + id);
  if (confirm('Delete this review? This cannot be undone.')) {
    card.classList.remove('investigating');
    card.classList.add('resolved');
    if (badge) {
      badge.textContent = 'Resolved — Deleted';
      badge.className = 'activity-badge';
      badge.style.background = '#e8f5e9';
      badge.style.color = '#2e7d32';
    }
    const box = document.getElementById('investigation-' + id);
    if (box) box.style.display = 'none';
    updateReportStats();
    adminToast('Review deleted and report resolved');
  }
}

function dismissReport(btn, id) {
  const card = btn.closest('.report-card');
  const badge = document.getElementById('badge-' + id);
  if (confirm('Dismiss this report? No action will be taken.')) {
    card.classList.add('dismissed');
    if (badge) {
      badge.textContent = 'Dismissed';
      badge.className = 'activity-badge';
      badge.style.background = '#f5f5f5';
      badge.style.color = '#888';
    }
    const box = document.getElementById('investigation-' + id);
    if (box) box.style.display = 'none';
    updateReportStats();
    adminToast('Report dismissed');
  }
}

function updateReportStats() {
  const cards = document.querySelectorAll('.report-card');
  let newCount = 0, investigatingCount = 0, resolvedCount = 0, dismissedCount = 0;

  cards.forEach(card => {
    const badge = card.querySelector('.activity-badge');
    if (!badge) return;
    const text = badge.textContent;
    if (text === 'New') newCount++;
    else if (text === 'Investigating') investigatingCount++;
    else if (text.includes('Resolved')) resolvedCount++;
    else if (text === 'Dismissed') dismissedCount++;
  });

  const s1 = document.getElementById('statNew');
  const s2 = document.getElementById('statInvestigating');
  const s3 = document.getElementById('statResolved');
  const s4 = document.getElementById('statDismissed');
  if (s1) s1.textContent = newCount;
  if (s2) s2.textContent = investigatingCount;
  if (s3) s3.textContent = resolvedCount;
  if (s4) s4.textContent = dismissedCount;
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
// ---- AUTO SUBSCRIPTION STATUS CHECK ----
function checkSubscriptionExpiry() {
  const rows = document.querySelectorAll('#adminTab-subscriptions .admin-table tbody tr');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 6) return;

    const expiryText = cells[4].textContent.trim();
    const statusBadge = cells[5].querySelector('.status-badge');
    const actionBtn = row.querySelector('.action-cell button');
    if (!statusBadge || !expiryText) return;

    const expiry = new Date(expiryText.trim());
if (isNaN(expiry.getTime())) return;
    expiry.setHours(0, 0, 0, 0);

    const isExpired = expiry < today;
    const isRevoked = statusBadge.classList.contains('suspended-status') 
                      && statusBadge.textContent.trim() === 'Revoked';

    if (isExpired && !isRevoked) {
      // Auto expire
      statusBadge.textContent = 'Expired';
      statusBadge.className = 'status-badge suspended-status';
      if (actionBtn) {
        actionBtn.title = 'Reactivate';
        actionBtn.innerHTML = '<i class="fas fa-rotate-right"></i>';
        actionBtn.classList.remove('reject');
        actionBtn.classList.add('approve');
      }
    } else if (!isExpired && !isRevoked) {
      // Still active
      statusBadge.textContent = 'Active';
      statusBadge.className = 'status-badge active-status';
      if (actionBtn) {
        actionBtn.title = 'Revoke';
        actionBtn.innerHTML = '<i class="fas fa-ban"></i>';
        actionBtn.classList.remove('approve');
        actionBtn.classList.add('reject');
      }
    }
  });

  updateSubStats();
}

function updateSubStats() {
  const rows = document.querySelectorAll('#adminTab-subscriptions .admin-table tbody tr');
  let activeCount = 0;
  let totalRevenue = 0;
  let expiringCount = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekLater = new Date(today);
  weekLater.setDate(weekLater.getDate() + 7);

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 6) return;

    const statusBadge = cells[5].querySelector('.status-badge');
    const amountText = cells[2].textContent.replace(/[₹,]/g, '').trim();
    const expiryText = cells[4].textContent.trim();
    const amount = parseInt(amountText) || 0;
 const expiry = new Date(expiryText.trim());
if (isNaN(expiry.getTime())) return;

    if (statusBadge && statusBadge.classList.contains('active-status')) {
      activeCount++;
      totalRevenue += amount;

      if (expiry <= weekLater && expiry >= today) {
        expiringCount++;
      }
    }
  });

  const stats = document.querySelectorAll('.sub-stat');
  if (stats[0]) stats[0].querySelector('.sub-stat-val').textContent = activeCount;
  if (stats[1]) stats[1].querySelector('.sub-stat-val').textContent = '₹' + totalRevenue.toLocaleString('en-IN');
  if (stats[2]) stats[2].querySelector('.sub-stat-val').textContent = expiringCount;
}

// Run check every time subscriptions tab is opened
// and every 60 seconds while on page
document.addEventListener('DOMContentLoaded', () => {
  checkSubscriptionExpiry();
  setInterval(checkSubscriptionExpiry, 60000);
  updateReportStats();
});
