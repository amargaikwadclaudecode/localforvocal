// ===========================
// LOCAL FOR VOCAL — post-requirement.js
// ===========================

let selectedCategory = 'medical';
let selectedUrgency = 'today';

// ---- CATEGORY ----
function pickCategory(el) {
  document.querySelectorAll('.cat-pick').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  selectedCategory = el.dataset.cat;
}

// ---- URGENCY ----
function pickUrgency(el) {
  document.querySelectorAll('.urgency-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  selectedUrgency = el.dataset.urgency;
}

// ---- RADIUS ----
function updateReqRadius(val) {
  document.getElementById('reqRadiusVal').textContent = val;
  const slider = document.getElementById('reqRadius');
  const pct = ((val - 1) / 49) * 100;
  slider.style.background = `linear-gradient(to right, var(--green-main) ${pct}%, var(--border) ${pct}%)`;

  document.querySelectorAll('.radius-quick-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === val + 'km');
  });
}

function setReqRadius(km) {
  document.getElementById('reqRadius').value = km;
  updateReqRadius(km);
}

// ---- DESCRIPTION COUNTER ----
document.addEventListener('DOMContentLoaded', () => {
  const desc = document.getElementById('reqDescription');
  if (desc) {
    desc.addEventListener('input', () => {
      const count = desc.value.length;
      document.getElementById('reqDescCount').textContent = count;
      if (count > 500) desc.value = desc.value.substring(0, 500);
    });
  }
});

// ---- PHOTO PREVIEW ----
function previewReqPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const box = document.getElementById('reqPhotoBox');
      box.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"/><input type="file" id="reqPhotoInput" accept="image/*" style="display:none" onchange="previewReqPhoto(this)"/>`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ---- FILL SAMPLE ----
function fillSample(title, description) {
  document.getElementById('reqTitle').value = title;
  document.getElementById('reqDescription').value = description;
  document.getElementById('reqDescCount').textContent = description.length;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- SUBMIT ----
function submitRequirement() {
  const title = document.getElementById('reqTitle').value.trim();
  const desc  = document.getElementById('reqDescription').value.trim();
  const phone = document.getElementById('reqPhone').value.trim();
  const radius = document.getElementById('reqRadius').value;

  if (!title) { alert('Please enter a requirement title'); return; }
  if (!desc)  { alert('Please describe your requirement'); return; }
  if (phone.length !== 10) { alert('Please enter a valid 10 digit phone number'); return; }

  const btn = document.querySelector('.req-submit-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
  btn.disabled = true;

  // Collect data (will send to Firebase later)
  const requirementData = {
    category: selectedCategory,
    title,
    description: desc,
    urgency: selectedUrgency,
    radius: parseInt(radius),
    phone,
    anonymous: document.getElementById('anonymousCheck').checked,
    budgetMin: document.getElementById('budgetMin').value,
    budgetMax: document.getElementById('budgetMax').value,
    postedAt: new Date().toISOString()
  };

  console.log('Requirement to post:', requirementData);

  // Simulate posting
  setTimeout(() => {
    // Show success
    document.getElementById('reqFormCard').style.display = 'none';
    document.getElementById('reqSuccess').style.display = 'block';
    document.getElementById('notifiedRadius').textContent = radius;

    // Simulate number of shops notified
    const shopCount = Math.floor(Math.random() * 10) + 5;
    document.getElementById('notifiedCount').textContent = shopCount;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 2000);
}

// ---- POST ANOTHER ----
function postAnother() {
  document.getElementById('reqSuccess').style.display = 'none';
  document.getElementById('reqFormCard').style.display = 'block';

  // Reset form
  document.getElementById('reqTitle').value = '';
  document.getElementById('reqDescription').value = '';
  document.getElementById('reqPhone').value = '';
  document.getElementById('reqDescCount').textContent = '0';
  document.getElementById('budgetMin').value = '';
  document.getElementById('budgetMax').value = '';
  document.getElementById('anonymousCheck').checked = false;

  // Reset category
  document.querySelectorAll('.cat-pick').forEach(c => c.classList.remove('active'));
  document.querySelector('.cat-pick[data-cat="medical"]').classList.add('active');
  selectedCategory = 'medical';

  // Reset urgency
  document.querySelectorAll('.urgency-card').forEach(c => c.classList.remove('active'));
  document.querySelector('.urgency-card[data-urgency="today"]').classList.add('active');
  selectedUrgency = 'today';

  // Reset radius
  setReqRadius(10);

  // Reset submit button
  const btn = document.querySelector('.req-submit-btn');
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Post Requirement';
  btn.disabled = false;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
