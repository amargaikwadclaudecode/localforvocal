// ===========================
// LOCAL FOR VOCAL — shop-profile.js
// ===========================

// ---- TABS ----
function switchTab(tab, btn) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  // Deactivate all tab buttons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  // Show selected tab
  document.getElementById('tab-' + tab).style.display = 'block';
  btn.classList.add('active');
}

// ---- CHAT ----
function openChat() {
  document.getElementById('chatDrawer').classList.add('open');
  document.getElementById('chatOverlay').classList.add('active');
  document.getElementById('chatInput').focus();
}

function closeChat() {
  document.getElementById('chatDrawer').classList.remove('open');
  document.getElementById('chatOverlay').classList.remove('active');
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const messages = document.getElementById('chatMessages');
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user-msg';
  userMsg.innerHTML = `<p>${msg}</p><span class="msg-time">${now}</span>`;
  messages.appendChild(userMsg);

  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  // Simulate shop reply after 1.5s
  setTimeout(() => {
    const shopMsg = document.createElement('div');
    shopMsg.className = 'chat-msg shop-msg';
    shopMsg.innerHTML = `<p>Thank you for your message! We will get back to you shortly.</p><span class="msg-time">${now}</span>`;
    messages.appendChild(shopMsg);
    messages.scrollTop = messages.scrollHeight;
  }, 1500);
}

function chatEnter(e) {
  if (e.key === 'Enter') sendMessage();
}

function attachPhoto(input) {
  if (input.files && input.files[0]) {
    const messages = document.getElementById('chatMessages');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user-msg';
    userMsg.innerHTML = `<p>📷 Photo sent</p><span class="msg-time">${now}</span>`;
    messages.appendChild(userMsg);
    messages.scrollTop = messages.scrollHeight;
  }
}

// ---- ASK PRODUCT ----
function askProduct() {
  const query = document.getElementById('productQuery').value.trim();
  if (!query) return;
  openChat();
  setTimeout(() => {
    document.getElementById('chatInput').value = query;
    document.getElementById('productQuery').value = '';
  }, 300);
}

// ---- SAVE SHOP ----
let isSaved = false;
function toggleSave() {
  isSaved = !isSaved;
  const btns = document.querySelectorAll('#saveBtn, #saveBtn2');
  btns.forEach(btn => {
    if (isSaved) {
      btn.classList.add('saved');
      btn.innerHTML = btn.tagName === 'BUTTON' && btn.classList.contains('sticky-btn')
        ? '<i class="fas fa-bookmark"></i> Saved'
        : '<i class="fas fa-bookmark"></i> Saved';
    } else {
      btn.classList.remove('saved');
      btn.innerHTML = btn.tagName === 'BUTTON' && btn.classList.contains('sticky-btn')
        ? '<i class="far fa-bookmark"></i> Save'
        : '<i class="far fa-bookmark"></i> Save Shop';
    }
  });
}

// ---- ACTIONS ----
function callShop() {
  window.location.href = 'tel:+919876543210';
}

function getDirections() {
  window.open('https://www.google.com/maps/search/?api=1&query=City+Medical+Store+Pune', '_blank');
}

function openWhatsApp() {
  window.open('https://wa.me/919876543210?text=Hi, I found you on Local4Vocal!', '_blank');
}

function shareShop() {
  if (navigator.share) {
    navigator.share({
      title: 'City Medical Store — Local4Vocal',
      text: 'Check out this shop on Local for Vocal!',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
}

function reportShop() {
  alert('Thank you for reporting. We will review this shop within 24 hours.');
}

// ---- REVIEWS ----
let selectedStars = 0;
function pickStar(n) {
  selectedStars = n;
  document.querySelectorAll('.star-pick').forEach((s, i) => {
    s.className = i < n ? 'fas fa-star star-pick' : 'far fa-star star-pick';
  });
}

function submitReview() {
  if (selectedStars === 0) { alert('Please select a rating first.'); return; }
  const text = document.getElementById('reviewText').value.trim();
  if (!text) { alert('Please write a review.'); return; }
  alert('Review submitted! Thank you for your feedback.');
  document.getElementById('reviewText').value = '';
  selectedStars = 0;
  document.querySelectorAll('.star-pick').forEach(s => s.className = 'far fa-star star-pick');
}
