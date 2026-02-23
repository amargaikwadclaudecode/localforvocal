// ===========================
// LOCAL FOR VOCAL — auth.js
// ===========================

let currentMode = 'signin';   // signin | signup
let currentType = 'user';     // user | shop
let otpSent = false;
let timerInterval = null;

// ---- AUTH TYPE (Customer / Shop Owner) ----
function switchAuthType(type, btn) {
  currentType = type;
  document.querySelectorAll('.auth-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const note = document.getElementById('shopOwnerNote');
  if (type === 'shop') {
    note.style.display = 'flex';
  } else {
    note.style.display = 'none';
  }
}

// ---- MODE (Sign In / Sign Up) ----
function switchMode(mode) {
  currentMode = mode;
  document.getElementById('signinForm').style.display = mode === 'signin' ? 'block' : 'none';
  document.getElementById('signupForm').style.display = mode === 'signup' ? 'block' : 'none';
  document.getElementById('signinBtn').classList.toggle('active', mode === 'signin');
  document.getElementById('signupBtn').classList.toggle('active', mode === 'signup');

  // Reset OTP state when switching
  otpSent = false;
  document.getElementById('phoneSection').style.display = 'block';
  document.getElementById('otpSection').style.display = 'none';
  document.getElementById('signinBtnText').textContent = 'Send OTP';
}

// ---- SIGN IN FLOW ----
function handleSignin() {
  if (!otpSent) {
    sendOTP();
  } else {
    verifyOTP();
  }
}

function sendOTP() {
  const phone = document.getElementById('signinPhone').value.trim();
  if (phone.length !== 10) {
    showError('signinPhone', 'Please enter a valid 10 digit phone number');
    return;
  }

  // Show loading
  const btn = document.querySelector('.auth-submit-btn');
  btn.classList.add('loading');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP...';

  // Simulate OTP send (replace with Firebase later)
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.innerHTML = '<span id="signinBtnText">Verify OTP</span> <i class="fas fa-arrow-right"></i>';

    document.getElementById('phoneSection').style.display = 'none';
    document.getElementById('otpSection').style.display = 'block';
    document.getElementById('otpPhone').textContent = phone;

    otpSent = true;
    startTimer();

    // Focus first OTP box
    document.querySelectorAll('.otp-box')[0].focus();
  }, 1500);
}

function verifyOTP() {
  const boxes = document.querySelectorAll('.otp-box');
  let otp = '';
  boxes.forEach(b => otp += b.value);

  if (otp.length < 6) {
    alert('Please enter the complete 6 digit OTP');
    return;
  }

  const btn = document.querySelector('.auth-submit-btn');
  btn.classList.add('loading');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

  // Simulate verify (replace with Firebase later)
  setTimeout(() => {
    btn.classList.remove('loading');
    // On success redirect
    if (currentType === 'shop') {
      window.location.href = 'shop-dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
  }, 1500);
}

function changePhone() {
  otpSent = false;
  document.getElementById('phoneSection').style.display = 'block';
  document.getElementById('otpSection').style.display = 'none';
  document.getElementById('signinBtnText').textContent = 'Send OTP';
  clearInterval(timerInterval);
}

function resendOTP() {
  startTimer();
  document.getElementById('resendBtn').disabled = true;
  // Simulate resend
  console.log('OTP resent');
}

function startTimer() {
  let seconds = 30;
  const timerEl = document.getElementById('timer');
  const resendBtn = document.getElementById('resendBtn');

  resendBtn.disabled = true;
  resendBtn.textContent = `Resend in ${seconds}s`;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds--;
    resendBtn.textContent = `Resend in ${seconds}s`;
    if (seconds <= 0) {
      clearInterval(timerInterval);
      resendBtn.disabled = false;
      resendBtn.textContent = 'Resend OTP';
    }
  }, 1000);
}

// ---- OTP BOX NAVIGATION ----
function otpMove(input, index) {
  // Only allow numbers
  input.value = input.value.replace(/\D/g, '');

  // Move to next box
  if (input.value && index < 6) {
    const boxes = document.querySelectorAll('.otp-box');
    boxes[index].focus();
  }
}

// Handle backspace on OTP boxes
document.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.otp-box');
  boxes.forEach((box, i) => {
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && i > 0) {
        boxes[i - 1].focus();
      }
    });
  });
});

// ---- SIGN UP ----
function handleSignup() {
  const name = document.getElementById('signupName').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const terms = document.getElementById('termsCheck').checked;

  if (!name) { alert('Please enter your name'); return; }
  if (phone.length !== 10) { alert('Please enter a valid phone number'); return; }
  if (!terms) { alert('Please accept the terms and conditions'); return; }

  const btn = document.querySelector('#signupForm .auth-submit-btn');
  btn.classList.add('loading');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

  // Simulate signup (replace with Firebase later)
  setTimeout(() => {
    btn.classList.remove('loading');
    if (currentType === 'shop') {
      window.location.href = 'register-shop.html';
    } else {
      window.location.href = 'index.html';
    }
  }, 1500);
}

// ---- GOOGLE SIGNIN ----
function googleSignin() {
  alert('Google Sign In will be enabled once Firebase is connected.');
  // Replace with: firebase.auth().signInWithPopup(googleProvider)
}

// ---- ERROR HELPER ----
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  input.style.borderColor = '#c62828';
  input.focus();
  setTimeout(() => {
    input.style.borderColor = '';
  }, 3000);
  alert(message);
}
