// ===========================
// LOCAL FOR VOCAL — register-shop.js
// ===========================

let currentStep = 1;
let addedTags = [];

const subCategories = {
  medical:     ['Pharmacy', 'Clinic / Doctor', 'Dental', 'Eye Care', 'Diagnostic Lab', 'Ayurvedic'],
  food:        ['Restaurant', 'Tiffin Service', 'Cafe', 'Bakery', 'Fast Food', 'Catering'],
  carpenter:   ['Custom Furniture', 'Modular Kitchen', 'Doors & Windows', 'Wood Polish', 'Interior Work'],
  goldsmith:   ['Jewellery Making', 'Repair & Resizing', 'Stone Setting', 'Custom Design'],
  tailor:      ['Ladies Tailor', 'Gents Tailor', 'Boutique', 'Alterations', 'Embroidery'],
  electronics: ['Mobile Repair', 'Laptop Repair', 'TV & AC Repair', 'CCTV', 'New Appliances'],
  salon:       ['Ladies Salon', 'Gents Salon', 'Unisex', 'Spa', 'Bridal Makeup'],
  grocery:     ['General Store', 'Supermarket', 'Organic Store', 'Wholesale'],
  plumber:     ['Plumbing', 'Electrical', 'Both Plumbing & Electrical', 'AC Service'],
  auto:        ['Car Repair', 'Bike Repair', 'Tyre Shop', 'Car Wash', 'Spare Parts'],
  education:   ['School Tuition', 'Coaching Centre', 'Spoken English', 'Computer Classes', 'Music Classes'],
  gym:         ['Gym', 'Yoga', 'Zumba', 'CrossFit', 'Personal Training'],
  hardware:    ['Hardware Store', 'Paint Shop', 'Sanitary', 'Tools'],
  stationery:  ['Stationery', 'Printing', 'Xerox', 'Bookbinding', 'Gift Items'],
  other:       []
};

const suggestedTagsByCategory = {
  medical:     ['Paracetamol', 'BP Medicines', 'Diabetic Supplies', 'Surgical Items', 'Vitamins', 'Baby Products', 'First Aid'],
  food:        ['Veg Thali', 'Non-Veg', 'Home Delivery', 'Parcel Available', 'Breakfast', 'Lunch', 'Dinner'],
  carpenter:   ['Custom Furniture', 'Sofa', 'Wardrobe', 'Study Table', 'Bed', 'Modular Kitchen', 'Doors'],
  goldsmith:   ['Ring Resizing', 'Chain Repair', 'Custom Jewellery', 'Stone Setting', 'Gold Polish'],
  tailor:      ['Blouse Stitching', 'Suit', 'Kurta', 'Dress', 'Alterations', 'School Uniform'],
  electronics: ['Mobile Screen Repair', 'Battery Replacement', 'Laptop Repair', 'TV Repair', 'CCTV Installation'],
  salon:       ['Haircut', 'Facial', 'Waxing', 'Threading', 'Bridal Makeup', 'Mehendi', 'Hair Color'],
  grocery:     ['Daily Grocery', 'Dairy Products', 'Snacks', 'Pulses', 'Oils', 'Home Delivery'],
  plumber:     ['Pipe Repair', 'Leakage Fix', 'Bathroom Fitting', 'Water Tank Cleaning', '24hr Emergency'],
  auto:        ['Car Service', 'Bike Service', 'Oil Change', 'Tyre Puncture', 'Car Wash', 'Denting Painting'],
  education:   ['Maths Tuition', 'Science', 'English', 'CBSE', 'SSC', 'Spoken English', 'Computer Basics'],
  other:       []
};

// ---- STEP NAVIGATION ----
function goToStep(step) {
  if (step > currentStep && !validateStep(currentStep)) return;

  // Hide current step
  document.getElementById(`formStep${currentStep}`).style.display = 'none';
  // Update indicator as completed
  if (step > currentStep) {
    document.getElementById(`step-indicator-${currentStep}`).classList.remove('active');
    document.getElementById(`step-indicator-${currentStep}`).classList.add('completed');
    // Color connector
    const connectors = document.querySelectorAll('.step-connector');
    if (connectors[currentStep - 1]) connectors[currentStep - 1].classList.add('done');
  }

  currentStep = step;

  // Show new step
  document.getElementById(`formStep${currentStep}`).style.display = 'block';
  document.getElementById(`step-indicator-${currentStep}`).classList.add('active');
  document.getElementById(`step-indicator-${currentStep}`).classList.remove('completed');

  // Update mobile progress
  updateMobileProgress();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateMobileProgress() {
  const fill = document.getElementById('mobileProgressFill');
  const text = document.getElementById('mobileProgressText');
  fill.style.width = `${currentStep * 25}%`;
  text.textContent = `Step ${currentStep} of 4`;
}

// ---- VALIDATION ----
function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById('shopName').value.trim();
    const cat  = document.getElementById('shopCategory').value;
    const owner= document.getElementById('ownerName').value.trim();
    const phone= document.getElementById('shopPhone').value.trim();

    if (!name)  { highlight('shopName', 'Please enter your shop name'); return false; }
    if (!cat)   { highlight('shopCategory', 'Please select a category'); return false; }
    if (!owner) { highlight('ownerName', 'Please enter owner name'); return false; }
    if (phone.length !== 10) { highlight('shopPhone', 'Please enter a valid 10 digit phone number'); return false; }
  }

  if (step === 2) {
    const address = document.getElementById('shopAddress').value.trim();
    const area    = document.getElementById('shopArea').value.trim();
    const city    = document.getElementById('shopCity').value.trim();
    const pin     = document.getElementById('shopPIN').value.trim();

    if (!address) { highlight('shopAddress', 'Please enter shop address'); return false; }
    if (!area)    { highlight('shopArea', 'Please enter your area'); return false; }
    if (!city)    { highlight('shopCity', 'Please enter your city'); return false; }
    if (pin.length !== 6) { highlight('shopPIN', 'Please enter a valid 6 digit PIN'); return false; }
  }

  if (step === 4) {
    if (addedTags.length === 0) {
      alert('Please add at least one product or service tag');
      return false;
    }
  }

  return true;
}

function highlight(id, msg) {
  const el = document.getElementById(id);
  el.style.borderColor = '#c62828';
  el.focus();
  alert(msg);
  setTimeout(() => el.style.borderColor = '', 3000);
}

// ---- SUB CATEGORY ----
function updateSubCategory() {
  const cat = document.getElementById('shopCategory').value;
  const subGroup = document.getElementById('subCategoryGroup');
  const subSelect = document.getElementById('shopSubCategory');

  if (cat && subCategories[cat] && subCategories[cat].length > 0) {
    subSelect.innerHTML = '<option value="">Select sub category</option>';
    subCategories[cat].forEach(sub => {
      subSelect.innerHTML += `<option value="${sub}">${sub}</option>`;
    });
    subGroup.style.display = 'block';
  } else {
    subGroup.style.display = 'none';
  }

  // Update suggested tags
  updateSuggestedTags(cat);
}

function updateSuggestedTags(cat) {
  const container = document.getElementById('suggestedTags');
  const tags = suggestedTagsByCategory[cat] || [];
  container.innerHTML = '';
  tags.forEach(tag => {
    const el = document.createElement('span');
    el.className = 'suggested-tag';
    el.textContent = tag;
    el.onclick = () => addTagFromSuggestion(tag, el);
    container.appendChild(el);
  });
}

// Reset location detection when address fields change
document.addEventListener('DOMContentLoaded', () => {
  const addressFields = ['shopAddress', 'shopArea', 'shopCity', 'shopPIN'];
  addressFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', resetLocationDetection);
    }
  });
});

function resetLocationDetection() {
  // Hide the detected message
  document.getElementById('locationDetected').style.display = 'none';
  // Reset the button
  const btn = document.querySelector('.detect-btn');
  btn.innerHTML = '<i class="fas fa-crosshairs"></i> Detect';
  btn.disabled = false;
  // Clear saved coordinates
  sessionStorage.removeItem('shopLat');
  sessionStorage.removeItem('shopLng');
}

// ---- LOCATION ----
function detectShopLocation() {
  const btn = document.querySelector('.detect-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      btn.innerHTML = '<i class="fas fa-check"></i> Detected!';
      document.getElementById('locationDetected').style.display = 'flex';
      // Save coords for Firebase later
      sessionStorage.setItem('shopLat', pos.coords.latitude);
      sessionStorage.setItem('shopLng', pos.coords.longitude);
    },
    () => {
      btn.innerHTML = '<i class="fas fa-crosshairs"></i> Detect';
      btn.disabled = false;
      alert('Could not detect location. Please allow location access.');
    }
  );
}

function toggleDay(day, checkbox) {
  const openInput = document.getElementById(`open-${day}`);
  const closeInput = document.getElementById(`close-${day}`);
  openInput.disabled = !checkbox.checked;
  closeInput.disabled = !checkbox.checked;
}

// ---- PHOTOS ----
function previewCover(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('coverPlaceholder').style.display = 'none';
      const preview = document.getElementById('coverPreview');
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function previewLogo(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('logoEmoji').style.display = 'none';
      const preview = document.getElementById('logoPreview');
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function previewGallery(input) {
  const grid = document.getElementById('galleryGrid');
  const files = Array.from(input.files).slice(0, 10);

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const item = document.createElement('div');
      item.className = 'gallery-upload-item';
      item.innerHTML = `<img src="${e.target.result}" alt="gallery"/>`;
      // Insert before the add button
      const addBtn = grid.querySelector('.add-photo');
      grid.insertBefore(item, addBtn);
    };
    reader.readAsDataURL(file);
  });
}

// ---- TAGS ----
function tagEnter(e) {
  if (e.key === 'Enter') addTag();
}

function addTag() {
  const input = document.getElementById('tagInput');
  const value = input.value.trim();
  if (!value || addedTags.includes(value)) { input.value = ''; return; }

  addedTags.push(value);
  renderTags();
  input.value = '';
  input.focus();
}

function addTagFromSuggestion(tag, el) {
  if (addedTags.includes(tag)) return;
  addedTags.push(tag);
  el.classList.add('added');
  renderTags();
}

function removeTag(tag) {
  addedTags = addedTags.filter(t => t !== tag);
  // Reset suggested tag if it was from suggestions
  document.querySelectorAll('.suggested-tag').forEach(el => {
    if (el.textContent === tag) el.classList.remove('added');
  });
  renderTags();
}

function renderTags() {
  const display = document.getElementById('tagsDisplay');
  display.innerHTML = '';
  addedTags.forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `${tag} <button onclick="removeTag('${tag}')">×</button>`;
    display.appendChild(chip);
  });
}

// ---- SUBMIT ----
function submitShop() {
  if (!validateStep(4)) return;

  const terms = document.getElementById('shopTerms').checked;
  if (!terms) { alert('Please accept the terms and conditions'); return; }

  const btn = document.querySelector('.submit-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  btn.disabled = true;

  // Collect all data (will send to Firebase later)
  const shopData = {
    name: document.getElementById('shopName').value,
    category: document.getElementById('shopCategory').value,
    owner: document.getElementById('ownerName').value,
    phone: document.getElementById('shopPhone').value,
    address: document.getElementById('shopAddress').value,
    area: document.getElementById('shopArea').value,
    city: document.getElementById('shopCity').value,
    tags: addedTags,
    submittedAt: new Date().toISOString()
  };

  console.log('Shop data to submit:', shopData);

  // Simulate submission
  setTimeout(() => {
    document.getElementById('formStep4').style.display = 'none';
    document.getElementById('formStepSuccess').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 2000);
}
