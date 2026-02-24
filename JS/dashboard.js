// ===========================
// LOCAL FOR VOCAL — dashboard.js
// ===========================

// ---- TAB SWITCHING ----
function switchTab(name, navItem) {
  // Hide all tabs
  document.querySelectorAll('.dash-tab').forEach(t => t.style.display = 'none');
  // Deactivate all nav items
  document.querySelectorAll('.dash-nav-item').forEach(n => n.classList.remove('active'));

  // Show selected tab
  const tab = document.getElementById(`tab-${name}`);
  if (tab) tab.style.display = 'block';

  // Activate nav item
  if (navItem) navItem.classList.add('active');

  // Update topbar title
  const titles = {
    overview: 'Overview',
    messages: 'Messages',
    requirements: 'Requirements',
    profile: 'My Profile',
    offers: 'Offers & Posts',
    subscription: 'Subscription',
    analytics: 'Analytics'
  };
  document.getElementById('topbarTitle').textContent = titles[name] || name;

  // Close sidebar on mobile
  document.getElementById('dashSidebar').classList.remove('open');
  document.getElementById('dashOverlay').classList.remove('active');
}

// ---- SIDEBAR TOGGLE (mobile) ----
function toggleSidebar() {
  document.getElementById('dashSidebar').classList.toggle('open');
  document.getElementById('dashOverlay').classList.toggle('active');
}

// ---- AVAILABILITY ----
function toggleAvailability() {
  const isAvailable = document.getElementById('availabilityToggle').checked;
  const status = document.querySelector('.dash-shop-status');
  if (isAvailable) {
    status.innerHTML = '<i class="fas fa-circle"></i> Active';
    status.className = 'dash-shop-status active-status';
    showToast('Shop marked as Available Today ✅');
  } else {
    status.innerHTML = '<i class="fas fa-circle"></i> Unavailable';
    status.className = 'dash-shop-status';
    status.style.color = '#ef9a9a';
    showToast('Shop marked as Unavailable');
  }
}

// ---- MESSAGES ----
function openConv(el, name, firstMsg) {
  document.querySelectorAll('.conv-item').forEach(c => c.classList.remove('active-conv'));
  el.classList.add('active-conv');

  document.getElementById('msgWindowCustomer').textContent = name;
  document.getElementById('msgWindowBody').innerHTML = `
    <div class="dash-chat-msg customer-msg">
      <p>${firstMsg}</p>
      <span class="msg-time">Just now</span>
    </div>
  `;

  // Remove unread dot
  const dot = el.querySelector('.unread-dot');
  if (dot) dot.remove();
  const avatar = el.querySelector('.conv-avatar');
  if (avatar) avatar.classList.remove('unread-avatar');
}

function sendDashMessage() {
  const input = document.getElementById('dashChatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const body = document.getElementById('msgWindowBody');
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const msgEl = document.createElement('div');
  msgEl.className = 'dash-chat-msg shop-reply-msg';
  msgEl.innerHTML = `<p>${msg}</p><span class="msg-time">${now}</span>`;
  body.appendChild(msgEl);

  input.value = '';
  body.scrollTop = body.scrollHeight;
}

function dashChatEnter(e) {
  if (e.key === 'Enter') sendDashMessage();
}

function callCustomer() {
  showToast('Calling customer...');
}

// ---- REQUIREMENTS ----
function respondToReq(btn) {
  const card = btn.closest('.req-card');
  const title = card.querySelector('.req-card-title').textContent;

  // Switch to messages tab and pre-fill
  switchTab('messages', document.querySelector('[onclick*="messages"]'));

  setTimeout(() => {
    document.getElementById('dashChatInput').value = `Hi! I saw your requirement: "${title}". We have this available. `;
    document.getElementById('dashChatInput').focus();
  }, 300);
}

function ignoreReq(btn) {
  const card = btn.closest('.req-card');
  card.style.opacity = '0.4';
  card.style.pointerEvents = 'none';
  showToast('Requirement ignored');
}

// ---- PROFILE ----
function saveProfile() {
  showToast('Profile saved successfully! ✅');
}

function addEditTag() {
  const tag = prompt('Enter product or service tag:');
  if (!tag) return;
  const tagsContainer = document.querySelector('.edit-tags');
  const addBtn = tagsContainer.querySelector('.add-tag-chip');
  const chip = document.createElement('span');
  chip.className = 'tag-chip';
  chip.innerHTML = `${tag} <button onclick="this.parentElement.remove()">×</button>`;
  tagsContainer.insertBefore(chip, addBtn);
}

// ---- OFFERS ----
function pickOfferType(btn) {
  document.querySelectorAll('.offer-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function postOffer() {
  const title = document.getElementById('offerTitle').value.trim();
  if (!title) { alert('Please enter an offer title'); return; }

  showToast('Offer posted successfully! 🎉');
  document.getElementById('offerTitle').value = '';
  document.getElementById('offerDesc').value = '';
}

function deleteOffer(btn) {
  if (confirm('Delete this offer?')) {
    btn.closest('.offer-item').remove();
    showToast('Offer deleted');
  }
}

// ---- SUBSCRIPTION ----
function upgradePlan() {
  alert('Payment integration coming soon! You will be redirected to the payment page.');
}

// ---- LOGOUT ----
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = 'login.html';
  }
}

// ---- TOAST NOTIFICATION ----
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--green-dark);
    color: white;
    padding: 12px 20px;
    border-radius: 50px;
    font-size: 0.88rem;
    font-weight: 500;
    z-index: 999;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    animation: slideUp 0.3s ease;
    font-family: 'DM Sans', sans-serif;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
