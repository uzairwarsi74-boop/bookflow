// ================================================================
// BookFlow — Adaptive Appointment Scheduler
// Self-contained SaaS. Each business installs their own copy.
// All data stored in localStorage — persists across sessions.
// ================================================================

// ── NICHE DEFINITIONS ─────────────────────────────────────────
const NICHES = {
  'Salon':       { emoji:'💈', color:'#7C3AED', staff:'Stylists',     staffS:'Stylist',     cust:'Clients',   custS:'Client',   svcs:'Beauty Services', svcS:'Service',      appt:'Salon Booking',         role:'Senior Stylist',     cat:'Hair & Beauty', welcome:'Book your beauty appointment',      ai:'beauty salon' },
  'Clinic':      { emoji:'🏥', color:'#0891B2', staff:'Doctors',      staffS:'Doctor',      cust:'Patients',  custS:'Patient',  svcs:'Consultations',   svcS:'Consultation', appt:'Patient Booking',       role:'Senior Consultant',  cat:'Medical',       welcome:'Book your medical appointment',     ai:'medical clinic' },
  'Dental Clinic':{ emoji:'🦷', color:'#0D9488', staff:'Dentists',     staffS:'Dentist',     cust:'Patients',  custS:'Patient',  svcs:'Dental Services', svcS:'Treatment',    appt:'Dental Appointment',    role:'Lead Dentist',       cat:'Dental',        welcome:'Book your dental appointment',      ai:'dental clinic' },
  'Gym':         { emoji:'💪', color:'#DC2626', staff:'Trainers',     staffS:'Trainer',     cust:'Members',   custS:'Member',   svcs:'Training Programs',svcS:'Session',     appt:'Training Session',      role:'Head Trainer',       cat:'Fitness',       welcome:'Book your fitness session',         ai:'gym & fitness center' },
  'Tutor Center':{ emoji:'📚', color:'#059669', staff:'Tutors',       staffS:'Tutor',       cust:'Students',  custS:'Student',  svcs:'Courses',         svcS:'Session',      appt:'Tutoring Session',      role:'Senior Tutor',       cat:'Academic',      welcome:'Book your tutoring session',        ai:'tutor center' },
  'Law Office':  { emoji:'⚖️', color:'#92400E', staff:'Lawyers',      staffS:'Lawyer',      cust:'Clients',   custS:'Client',   svcs:'Legal Services',  svcS:'Consultation', appt:'Legal Consultation',    role:'Senior Partner',     cat:'Legal',         welcome:'Schedule a legal consultation',     ai:'law office' },
  'Spa':         { emoji:'🧖', color:'#BE185D', staff:'Therapists',   staffS:'Therapist',   cust:'Guests',    custS:'Guest',    svcs:'Spa Treatments',  svcS:'Treatment',    appt:'Spa Booking',           role:'Senior Therapist',   cat:'Wellness',      welcome:'Book your spa experience',          ai:'spa & wellness center' },
  'Consultant':  { emoji:'🏢', color:'#4F46E5', staff:'Consultants',  staffS:'Consultant',  cust:'Clients',   custS:'Client',   svcs:'Consulting Services',svcS:'Session',   appt:'Consulting Session',    role:'Senior Consultant',  cat:'Business',      welcome:'Schedule a consultation',           ai:'consulting firm' },
  'Repair Shop': { emoji:'🔧', color:'#374151', staff:'Technicians',  staffS:'Technician',  cust:'Customers', custS:'Customer', svcs:'Repair Services', svcS:'Job',          appt:'Repair Job',            role:'Lead Technician',    cat:'Repair',        welcome:'Book a repair appointment',         ai:'repair shop' },
  'Custom':      { emoji:'🏢', color:'#6366F1', staff:'Staff',        staffS:'Staff Member',cust:'Customers', custS:'Customer', svcs:'Services',        svcS:'Service',      appt:'Appointment',           role:'Staff Member',       cat:'General',       welcome:'Book your appointment',             ai:'business' }
};

const DEFAULT_SERVICES = {
  'Salon':        [{name:'Haircut',price:800,dur:45},{name:'Hair Color',price:2500,dur:120},{name:'Facial',price:1200,dur:60},{name:'Manicure',price:600,dur:45},{name:'Pedicure',price:700,dur:45}],
  'Clinic':       [{name:'General Consultation',price:800,dur:30},{name:'Specialist Consultation',price:1500,dur:45},{name:'Follow-up Visit',price:500,dur:20},{name:'Health Checkup',price:2000,dur:60}],
  'Dental Clinic':[{name:'Regular Checkup',price:500,dur:30},{name:'Teeth Cleaning',price:1500,dur:45},{name:'Filling',price:2000,dur:60},{name:'Root Canal',price:8000,dur:90}],
  'Gym':          [{name:'Personal Training',price:1500,dur:60},{name:'Group Class',price:500,dur:45},{name:'Nutrition Consult',price:1000,dur:30},{name:'Yoga Session',price:800,dur:60}],
  'Tutor Center': [{name:'Math Tutoring',price:600,dur:60},{name:'Science Session',price:600,dur:60},{name:'English Class',price:500,dur:60},{name:'O/A Levels Prep',price:1200,dur:90}],
  'Law Office':   [{name:'Initial Consultation',price:3000,dur:60},{name:'Contract Review',price:5000,dur:90},{name:'Document Drafting',price:4000,dur:60}],
  'Spa':          [{name:'Full Body Massage',price:2500,dur:60},{name:'Facial Treatment',price:1800,dur:45},{name:'Body Scrub',price:2000,dur:60},{name:'Hot Stone Therapy',price:3000,dur:75}],
  'Consultant':   [{name:'Strategy Session',price:5000,dur:60},{name:'Financial Review',price:4000,dur:90},{name:'HR Consulting',price:3000,dur:60}],
  'Repair Shop':  [{name:'Phone Screen Repair',price:2500,dur:60},{name:'Laptop Repair',price:3000,dur:120},{name:'AC Service',price:1500,dur:90}],
  'Custom':       [{name:'Standard Service',price:1000,dur:60},{name:'Premium Service',price:2000,dur:90}]
};

const BRAND_COLORS = ['#7C3AED','#2563EB','#0891B2','#DC2626','#059669','#D97706','#374151','#92400E','#0D9488','#DB2777','#0EA5E9','#F59E0B'];
const EMOJIS       = ['💈','🏥','🦷','💪','📚','⚖️','🧖','🔧','🏢','🌟','💼','🎨','🍕','🚗','✂️'];
const CURRENCIES   = [{s:'PKR',l:'🇵🇰 PKR'},{s:'$',l:'🇺🇸 USD'},{s:'£',l:'🇬🇧 GBP'},{s:'€',l:'🇪🇺 EUR'},{s:'AED',l:'🇦🇪 AED'},{s:'₹',l:'🇮🇳 INR'},{s:'SAR',l:'🇸🇦 SAR'},{s:'RM',l:'🇲🇾 MYR'},{s:'₦',l:'🇳🇬 NGN'},{s:'EGP',l:'🇪🇬 EGP'}];
const DAYS         = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const TIME_SLOTS   = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];

// ── APP STATE ─────────────────────────────────────────────────
let S           = {}; // loaded from Firebase
let currentRole = null; // 'owner' | 'staff'
let loginTab    = 'owner';
let calYear     = new Date().getFullYear();
let calMonth    = new Date().getMonth();
let apptFilters = { search:'', status:'', branch:'' };
let bkSel       = { serviceId:null, staffId:null, branchId:null, time:null };
let wizardStep  = 1;
let wizardData  = {};

// ── STORAGE — FIREBASE FIRESTORE ─────────────────────────────
// Replaces localStorage completely.
// Data is stored in Firebase Firestore and works on ALL devices.
// No "Coming Soon" on new phones. No localStorage dependency.

// Current biz ID (set after owner logs in or from URL param for customers)
let _bizId = null;

// isSetupDone checks in-memory S object
function isSetupDone() { return !!(S && S.setup_done); }

// save() — writes full S to Firestore (owner use only)
async function save() {
  if (!_bizId) { console.warn('save(): no bizId set'); return; }
  try {
    await fbSave(S);
  } catch(e) {
    console.error('save() error:', e);
    showToast('Save failed. Check internet connection.', 'error');
  }
}

// saveSync() — fire-and-forget wrapper for inline calls like
// onclick handlers that cannot await
function saveSync() {
  save().catch(e => console.error('saveSync error:', e));
}

// load() — async, loads owner data from Firestore by UID
async function loadOwnerData() {
  try {
    // Sign in anonymously to get stable UID
    await fbSignIn();
    _uid  = auth.currentUser?.uid;
    _bizId = _uid; // owner bizId = their Firebase UID

    const data = await fbLoad();
    if (data && data.setup_done) {
      S = data;
      // Sync appointments and customers from subcollections
      S.appointments = await fbLoadAppointments(_bizId);
      S.customers    = await fbLoadCustomers(_bizId);
      return true;
    }
    return false;
  } catch(e) {
    console.error('loadOwnerData error:', e);
    return false;
  }
}

// loadPublicData() — loads public business data for customer portal
// Uses bizId from URL: yoursite.com/?biz=BIZID
async function loadPublicData(bizId) {
  try {
    _bizId = bizId;
    const data = await fbLoadPublic(bizId);
    if (data && data.setup_done) {
      S = data;
      // Load appointments for slot-blocking (read-only for customers)
      S.appointments = await fbLoadAppointments(bizId);
      S.customers    = S.customers || [];
      return true;
    }
    return false;
  } catch(e) {
    console.error('loadPublicData error:', e);
    return false;
  }
}

// ── CURRENCY ──────────────────────────────────────────────────
function fmt(amount) {
  const sym = S.currency?.symbol || 'PKR';
  const pos = S.currency?.position || 'before';
  const n   = Number(amount || 0).toLocaleString();
  return pos === 'before' ? `${sym} ${n}` : `${n} ${sym}`;
}

// ── NICHE ─────────────────────────────────────────────────────
function N() { return NICHES[S.business?.type] || NICHES['Salon']; }

// ── LABEL (custom or niche default) ──────────────────────────
function L(key) { return (S.labels && S.labels[key]) || N()[key] || key; }

// ── DOM HELPERS ───────────────────────────────────────────────
function show(id)  { const e = document.getElementById(id); if(e) e.style.display=''; }
function hide(id)  { const e = document.getElementById(id); if(e) e.style.display='none'; }
function val(id)   { const e = document.getElementById(id); return e ? e.value.trim() : ''; }
function setVal(id,v){ const e = document.getElementById(id); if(e) e.value = v||''; }
function setText(id,t){ const e = document.getElementById(id); if(e) e.textContent = t||''; }

// ── SCREEN MANAGER ────────────────────────────────────────────
function showScreen(name) {
  ['screen-setup','screen-login','screen-app','screen-booking'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  const el = document.getElementById('screen-' + name);
  if (el) el.style.display = (name === 'setup' || name === 'login') ? 'flex' : 'block';
}

// ── BOOT ──────────────────────────────────────────────────────
window.onload = async function() {
  // ── FIREBASE BOOT LOGIC ───────────────────────────────────────
  // 1. Read URL to determine who is visiting
  // 2. Customer: load public data by bizId in URL → show booking portal
  // 3. Owner:    load private data by Firebase UID → show login
  // 4. If no setup at all → show wizard
  // Works on ALL devices, ALL browsers, incognito — no localStorage
  // ─────────────────────────────────────────────────────────────

  const hash   = window.location.hash.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const bizId  = params.get('biz');

  // Use startsWith so #admin?biz=abc123 is correctly detected as admin route
  const isAdminRoute = hash.startsWith('#admin') || hash.startsWith('#login') || hash.startsWith('#dashboard');
  const isSetupRoute = hash.startsWith('#setup');

  // Show loading indicator
  document.body.style.opacity = '0';

  if (isSetupRoute) {
    document.body.style.opacity = '1';
    initWizardData();
    showScreen('setup');
    renderWizardStep();

  } else if (isAdminRoute) {
    // Owner / Staff login flow
    // Extract bizId from hash query string e.g. #admin?biz=abc123
    let adminBizId = null;
    if (window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1] || '';
      adminBizId = new URLSearchParams(hashQuery).get('biz') || null;
    }

    // Try 1: Load via anonymous UID (works on owner's original device)
    let loaded = await loadOwnerData();

    // Try 2: bizId from URL hash e.g. #admin?biz=abc123
    if (!loaded && adminBizId) {
      const pubData = await fbLoadPublic(adminBizId);
      if (pubData && pubData.setup_done) {
        S = pubData;
        _bizId = adminBizId;
        S.appointments = await fbLoadAppointments(adminBizId);
        S.customers    = await fbLoadCustomers(adminBizId);
        loaded = true;
      }
    }

    // Try 3: Read bizId from Firebase meta/config document
    // This works on ANY device, ANY browser, ANY phone
    // No URL param needed, no file download needed
    // meta/config is written every time data is saved
    if (!loaded) {
      const configBizId = await fbLoadConfig();
      if (configBizId) {
        const pubData3 = await fbLoadPublic(configBizId);
        if (pubData3 && pubData3.setup_done) {
          S = pubData3;
          _bizId = configBizId;
          S.appointments = await fbLoadAppointments(_bizId);
          S.customers    = await fbLoadCustomers(_bizId);
          loaded = true;
        }
      }
    }

    document.body.style.opacity = '1';
    if (loaded && isSetupDone()) {
      showScreen('login');
      renderLoginScreen();
    } else {
      // Truly no business found anywhere — show setup wizard
      initWizardData();
      showScreen('setup');
      renderWizardStep();
    }

  } else if (bizId) {
    // Customer visiting with ?biz= param — always load booking portal
    const loaded = await loadPublicData(bizId);
    document.body.style.opacity = '1';
    if (loaded) {
      showScreen('booking');
      initBookingPortal();
    } else {
      showScreen('booking');
      showNotConfigured();
    }

  } else {
    // Plain URL — customer or owner visiting without ?biz= or #admin
    // Try 1: owner's own device via anonymous UID
    let loaded = await loadOwnerData();

    // Try 2: get bizId from Firebase meta/config (works on any device)
    if (!loaded) {
      const cfgBizId = await fbLoadConfig();
      if (cfgBizId) {
        loaded = await loadPublicData(cfgBizId);
      }
    }

    document.body.style.opacity = '1';
    if (loaded && isSetupDone()) {
      showScreen('booking');
      initBookingPortal();
    } else {
      showScreen('booking');
      showNotConfigured();
    }
  }
};

// Fade in effect
document.addEventListener('DOMContentLoaded', function() {
  document.body.style.transition = 'opacity 0.3s ease';
});

// Show a friendly message when business hasn't set up yet
function showNotConfigured() {
  var bkNav = document.getElementById('bk-nav-icon');
  if(bkNav) bkNav.textContent = '📅';
  var bkName = document.getElementById('bk-nav-name');
  if(bkName) bkName.textContent = 'Appointment Booking';
  var sidebar = document.getElementById('bk-sidebar');
  if(sidebar) {
    sidebar.innerHTML =
      '<div style="padding:32px 20px;text-align:center;">' +
      '<div style="font-size:48px;margin-bottom:16px">📅</div>' +
      '<div style="font-family:serif;font-size:22px;margin-bottom:8px;color:white">Coming Soon</div>' +
      '<div style="font-size:14px;opacity:0.75;color:white">This booking system is being set up.<br>Please check back soon.</div>' +
      '</div>';
  }
  var main = document.getElementById('bk-s1');
  if(main) {
    main.innerHTML =
      '<div style="text-align:center;padding:60px 24px;">' +
      '<div style="font-size:56px;margin-bottom:20px">🚧</div>' +
      '<h2 style="font-size:22px;font-weight:700;margin-bottom:10px;color:var(--text)">Not Yet Configured</h2>' +
      '<p style="color:var(--text2);font-size:15px;max-width:380px;margin:0 auto;">The business owner has not completed setup yet. Please contact them directly.</p>' +
      '</div>';
  }
}

// Listen for hash changes
window.addEventListener('hashchange', async function() {
  const hash = window.location.hash.toLowerCase();
  if (hash.startsWith('#admin') || hash.startsWith('#login')) {
    // Extract bizId from hash if present e.g. #admin?biz=abc123
    let adminBizId2 = null;
    if (window.location.hash.includes('?')) {
      const hq2 = window.location.hash.split('?')[1] || '';
      adminBizId2 = new URLSearchParams(hq2).get('biz') || null;
    }
    let loaded2 = await loadOwnerData();
    if (!loaded2 && adminBizId2) {
      const pd2 = await fbLoadPublic(adminBizId2);
      if (pd2 && pd2.setup_done) {
        S = pd2; _bizId = adminBizId2;
        S.appointments = await fbLoadAppointments(adminBizId2);
        S.customers    = await fbLoadCustomers(adminBizId2);
        loaded2 = true;
      }
    }
    if (!loaded2) {
      const cfgId2 = await fbLoadConfig();
      if (cfgId2) {
        const pd3 = await fbLoadPublic(cfgId2);
        if (pd3 && pd3.setup_done) {
          S = pd3; _bizId = cfgId2;
          S.appointments = await fbLoadAppointments(_bizId);
          S.customers    = await fbLoadCustomers(_bizId);
          loaded2 = true;
        }
      }
    }
    if (loaded2 && isSetupDone()) {
      showScreen('login');
      renderLoginScreen();
    } else {
      initWizardData();
      showScreen('setup');
      renderWizardStep();
    }
  } else if (hash.startsWith('#setup')) {
    initWizardData();
    showScreen('setup');
    renderWizardStep();
  }
});


// ================================================================
// SETUP WIZARD — runs only first time
// ================================================================
const WIZARD_TITLES = [
  'What type of business are you?',
  'Business Name & Details',
  'Your Branding',
  'Add Your Staff',
  'Add Your Services & Prices',
  'Set Your Working Hours',
  'Set Access Passwords'
];
const WIZARD_SUBS = [
  'Choose the type that best matches your business',
  'This appears on your booking page and dashboard',
  'Your colors and icon — make it yours',
  'You can always add more later',
  'Set prices in your local currency',
  'Customers can only book during these hours',
  'Owner gets full access. Staff gets limited access.'
];

function initWizardData() {
  wizardData = {
    type: 'Salon', name: '', address: '', whatsapp: '', email: '',
    color: '#7C3AED', emoji: '💈',
    staff: [{name:'',role:''}],
    services: JSON.parse(JSON.stringify(DEFAULT_SERVICES['Salon'])),
    days: [true,true,true,true,true,false,true],
    openTime: '09:00', closeTime: '20:00',
    ownerPass: '', staffPass: '',
    currency: { symbol:'PKR', position:'before' }
  };
}

function renderWizardStep() {
  const total = 7;
  const s     = wizardStep;
  let html    = '';

  // Step bar
  html += `<div class="step-bar">`;
  for (let i=1; i<=total; i++) {
    const cls = i<s?'done':i===s?'active':'pend';
    html += `<div class="step-dot ${cls}">${i<s?'✓':i}</div>`;
    if (i<total) html += `<div class="step-line ${i<s?'done':''}"></div>`;
  }
  html += `</div>`;

  html += `<div class="setup-step-title">${WIZARD_TITLES[s-1]}</div>`;
  html += `<div class="setup-step-sub">${WIZARD_SUBS[s-1]}</div>`;
  html += `<div id="wz-body">${getWizardBody(s)}</div>`;

  // Navigation
  html += `<div class="setup-actions">`;
  if (s > 1) html += `<button class="btn btn-ghost" onclick="wzBack()">← Back</button>`;
  else html += `<div></div>`;
  if (s < total) html += `<button class="btn btn-primary" onclick="wzNext()">Continue →</button>`;
  else html += `<button class="btn btn-primary" onclick="wzFinish()">🚀 Launch My Business!</button>`;
  html += `</div>`;

  document.getElementById('setup-box').innerHTML = html;
}

function getWizardBody(s) {
  if (s === 1) {
    return `<div class="niche-grid-setup">${Object.entries(NICHES).map(([k,n]) =>
      `<div class="niche-card ${wizardData.type===k?'sel':''}" onclick="wzSelectType('${k}',this)">
        <div class="ne">${n.emoji}</div><div class="nl">${k}</div>
      </div>`).join('')}</div>`;
  }
  if (s === 2) {
    return `
      <div class="field-group"><label class="field-label">Business Name *</label>
        <input class="field-input" id="wz-bname" value="${wizardData.name}" placeholder="e.g. Glamour Studio, City Clinic, PowerFit Gym"></div>
      <div class="field-group"><label class="field-label">Address</label>
        <input class="field-input" id="wz-addr" value="${wizardData.address}" placeholder="Full business address"></div>
      <div class="form-row">
        <div class="field-group"><label class="field-label">WhatsApp Number</label>
          <input class="field-input" id="wz-wa" value="${wizardData.whatsapp}" placeholder="+92 300 0000000"></div>
        <div class="field-group"><label class="field-label">Email</label>
          <input class="field-input" id="wz-email" type="email" value="${wizardData.email}" placeholder="you@business.com"></div>
      </div>`;
  }
  if (s === 3) {
    const colorHtml = BRAND_COLORS.map(c =>
      `<div class="color-chip ${wizardData.color===c?'sel':''}" style="background:${c}" onclick="wzSetColor('${c}',this)"></div>`).join('');
    const emojiHtml = EMOJIS.map(e =>
      `<span class="ep ${wizardData.emoji===e?'sel':''}" onclick="wzSetEmoji('${e}',this)">${e}</span>`).join('');
    const logoPreviewHtml = wizardData.logoData
      ? `<img src="${wizardData.logoData}" style="width:60px;height:60px;object-fit:contain;border-radius:8px;border:2px solid var(--brand);">`
      : `<span style="font-size:36px">${wizardData.emoji}</span>`;
    return `
      <div class="field-group">
        <label class="field-label">Business Logo (Optional)</label>
        <div class="logo-upload-area">
          <div class="logo-preview-box">
            <div id="wz-logo-preview">${logoPreviewHtml}</div>
          </div>
          <div class="logo-upload-controls">
            <p style="font-size:13px;color:var(--text2);margin-bottom:10px">Upload your salon, clinic or business logo (PNG/JPG, max 500KB).<br>Skip this to use an icon instead.</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <label class="btn btn-primary btn-sm" style="cursor:pointer">
                📁 Upload Logo
                <input type="file" accept="image/*" style="display:none" onchange="wzHandleLogo(this)">
              </label>
              <button class="btn btn-outline btn-sm" onclick="wzRemoveLogo()">✕ Remove</button>
            </div>
          </div>
        </div>
      </div>
      <div class="logo-or-divider"><span>or use an icon instead</span></div>
      <div class="field-group"><label class="field-label">Business Icon</label>
        <div class="emoji-picker">${emojiHtml}</div>
      </div>
      <div class="field-group"><label class="field-label">Brand Color</label>
        <div class="color-swatches">${colorHtml}</div>
        <div style="margin-top:8px;display:flex;align-items:center;gap:8px">
          <input type="color" id="wz-custom-color" value="${wizardData.color}" style="width:40px;height:32px;border:1px solid var(--border);border-radius:6px;cursor:pointer" onchange="wzSetColor(this.value)">
          <span style="font-size:12px;color:var(--text3)">Or pick any custom color</span>
        </div>
      </div>`;
  }
  if (s === 4) {
    const n = NICHES[wizardData.type];
    const rows = wizardData.staff.map((st,i) =>
      `<div class="setup-row">
        <span>${n.emoji}</span>
        <input value="${st.name}" placeholder="${n.staffS} name" onchange="wizardData.staff[${i}].name=this.value">
        <input value="${st.role}" placeholder="Role / title" onchange="wizardData.staff[${i}].role=this.value" style="max-width:160px">
        <button class="icon-btn" onclick="wzRemStaff(${i})">×</button>
      </div>`).join('');
    return `<div class="staff-setup-list" id="wz-staff-list">${rows}</div>
      <button class="add-row-btn" onclick="wzAddStaff()">+ Add ${n.staffS}</button>`;
  }
  if (s === 5) {
    const rows = wizardData.services.map((sv,i) =>
      `<div class="setup-row">
        <input value="${sv.name}" placeholder="Service name" onchange="wizardData.services[${i}].name=this.value" style="flex:2">
        <input class="price-in" type="number" value="${sv.price}" placeholder="Price" onchange="wizardData.services[${i}].price=parseInt(this.value)||0">
        <input class="price-in" type="number" value="${sv.dur}" placeholder="Mins" onchange="wizardData.services[${i}].dur=parseInt(this.value)||60" style="width:60px">
        <button class="icon-btn" onclick="wzRemSvc(${i})">×</button>
      </div>`).join('');
    return `<div class="svc-setup-list" id="wz-svc-list">${rows}</div>
      <button class="add-row-btn" onclick="wzAddSvc()">+ Add Service</button>`;
  }
  if (s === 6) {
    const dayHtml = DAYS.map((d,i) =>
      `<div class="day-tog ${wizardData.days[i]?'on':''}" onclick="wizardData.days[${i}]=!wizardData.days[${i}];this.classList.toggle('on')">
        <div class="dn">${d.slice(0,3)}</div><div class="dc">✓</div>
      </div>`).join('');
    return `
      <div class="day-grid" style="margin-bottom:18px">${dayHtml}</div>
      <div class="form-row">
        <div class="field-group"><label class="field-label">Opening Time</label>
          <input class="field-input" id="wz-open" type="time" value="${wizardData.openTime}" onchange="wizardData.openTime=this.value"></div>
        <div class="field-group"><label class="field-label">Closing Time</label>
          <input class="field-input" id="wz-close" type="time" value="${wizardData.closeTime}" onchange="wizardData.closeTime=this.value"></div>
      </div>`;
  }
  if (s === 7) {
    return `
      <div class="pw-info">🔐 <strong>Important:</strong> Set a strong password. You can change it anytime from Settings → Passwords.</div>
      <div class="form-row">
        <div class="field-group"><label class="field-label">Owner Password *</label>
          <input class="field-input" id="wz-owner-pw" type="password" placeholder="Your admin password" value="${wizardData.ownerPass}"></div>
        <div class="field-group"><label class="field-label">Staff Password</label>
          <input class="field-input" id="wz-staff-pw" type="password" placeholder="Password for your staff" value="${wizardData.staffPass}"></div>
      </div>
      <div class="field-group">
        <label class="field-label">Currency</label>
        <div class="currency-presets">${CURRENCIES.map(c =>
          `<span class="cur-preset" onclick="wizardData.currency.symbol='${c.s}';showToast('Currency set to ${c.s}','success')">${c.l}</span>`).join('')}
        </div>
      </div>`;
  }
  return '';
}

// Wizard actions
function wzSelectType(type, el) {
  wizardData.type   = type;
  const n           = NICHES[type];
  wizardData.color  = n.color;
  wizardData.emoji  = n.emoji;
  wizardData.services = JSON.parse(JSON.stringify(DEFAULT_SERVICES[type] || DEFAULT_SERVICES['Custom']));
  document.querySelectorAll('.niche-card').forEach(c => c.classList.remove('sel'));
  if (el) el.classList.add('sel');
}
function wzSetColor(c, el) {
  wizardData.color = c;
  document.querySelectorAll('.color-chip').forEach(e => e.classList.remove('sel'));
  if (el) el.classList.add('sel');
  document.documentElement.style.setProperty('--brand', c);
}
function wzSetEmoji(e, el) {
  wizardData.emoji = e;
  document.querySelectorAll('.ep').forEach(x => x.classList.remove('sel'));
  if (el) el.classList.add('sel');
}
function wzHandleLogo(input){
  var file = input.files[0];
  if(!file) return;
  if(file.size > 500000){ showToast('Logo too large. Max 500KB.','error'); return; }
  var reader = new FileReader();
  reader.onload = function(e){
    wizardData.logoData = e.target.result;
    var prev = document.getElementById('wz-logo-preview');
    if(prev) prev.innerHTML = '<img src="'+e.target.result+'" style="width:60px;height:60px;object-fit:contain;border-radius:8px;border:2px solid var(--brand);">';
    showToast('Logo uploaded!','success');
  };
  reader.readAsDataURL(file);
}
function wzRemoveLogo(){
  wizardData.logoData = null;
  var prev = document.getElementById('wz-logo-preview');
  if(prev) prev.innerHTML = '<span style="font-size:36px">'+wizardData.emoji+'</span>';
}
function wzAddStaff() { wizardData.staff.push({name:'',role:''}); renderWizardStep(); }
function wzRemStaff(i){ wizardData.staff.splice(i,1); renderWizardStep(); }
function wzAddSvc()   { wizardData.services.push({name:'',price:500,dur:60}); renderWizardStep(); }
function wzRemSvc(i)  { wizardData.services.splice(i,1); renderWizardStep(); }

function wzSaveCurrentStep() {
  const s = wizardStep;
  if (s===2) { wizardData.name=val('wz-bname'); wizardData.address=val('wz-addr'); wizardData.whatsapp=val('wz-wa'); wizardData.email=val('wz-email'); }
  if (s===7) { wizardData.ownerPass=val('wz-owner-pw'); wizardData.staffPass=val('wz-staff-pw'); }
}
function wzValidate() {
  if (wizardStep===2 && !wizardData.name) { showToast('Please enter your business name','error'); return false; }
  if (wizardStep===7 && !wizardData.ownerPass) { showToast('Owner password is required','error'); return false; }
  return true;
}
function wzNext() { wzSaveCurrentStep(); if (!wzValidate()) return; wizardStep++; renderWizardStep(); }
function wzBack() { wzSaveCurrentStep(); wizardStep--; renderWizardStep(); }

async function wzFinish() {
  wzSaveCurrentStep();
  if (!wizardData.ownerPass) { showToast('Owner password is required','error'); return; }
  const n   = NICHES[wizardData.type];
  const now = Date.now();
  S = {
    setup_done: true,
    business: {
      type: wizardData.type, name: wizardData.name || `My ${wizardData.type}`, logoData: wizardData.logoData || null,
      address: wizardData.address, whatsapp: wizardData.whatsapp, email: wizardData.email,
      color: wizardData.color, emoji: wizardData.emoji
    },
    passwords: { owner: wizardData.ownerPass, staff: wizardData.staffPass || wizardData.ownerPass },
    currency: wizardData.currency || { symbol:'PKR', position:'before' },
    labels: {},
    hours: { days: wizardData.days, open: wizardData.openTime, close: wizardData.closeTime },
    staff: wizardData.staff.filter(st => st.name).map((st,i) => ({
      id: now+i, name: st.name, role: st.role || n.role, phone:'', active:true, branchId:1
    })),
    services: wizardData.services.filter(sv => sv.name).map((sv,i) => ({
      id: now+100+i, name: sv.name, price: sv.price||0, dur: sv.dur||60,
      active:true, category: n.cat
    })),
    branches: [{
      id:1, name:'Main Branch', address: wizardData.address,
      phone: wizardData.whatsapp, whatsapp: wizardData.whatsapp,
      manager:'Owner', managerPhone: wizardData.whatsapp,
      openTime: wizardData.openTime, closeTime: wizardData.closeTime, isMain:true
    }],
    appointments: [],
    customers: [],
    authorisedUsers: [],
    holidays: []
  };
  // Assign bizId = Firebase UID before first save
  _bizId = _uid || ('biz_' + Date.now());
  S.business.bizId = _bizId;

  await save();

  // Firebase meta/config is already saved inside fbSave above.
  // No file download needed. Any device can now open #admin and login.

  // After setup is complete, show the owner their two important links
  showScreen('booking');
  showSetupSuccess();
}


function showSetupSuccess() {
  var baseUrl    = window.location.origin + window.location.pathname;
  baseUrl        = baseUrl.split('#')[0].split('?')[0];
  var bizId      = _bizId || 'YOUR_BIZ_ID';
  var customerUrl = baseUrl + '?biz=' + bizId;
  var adminUrl    = baseUrl + '#admin?biz=' + bizId; // includes bizId so it works on any device

  var main = document.getElementById('bk-s1');
  if(main) {
    main.innerHTML =
      '<div style="text-align:center;padding:40px 24px;">' +
      '<div style="font-size:52px;margin-bottom:16px">🎉</div>' +
      '<h2 style="font-size:22px;font-weight:700;margin-bottom:8px;color:var(--text)">' + S.business.name + ' is Live!</h2>' +
      '<p style="color:var(--text2);margin-bottom:28px;font-size:14px">Your data is saved to Firebase. Works on all devices instantly — no downloads needed.</p>' +

      '<div style="background:var(--bg3);border-radius:10px;padding:18px;margin-bottom:14px;text-align:left;">' +
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:6px">📅 Customer Booking Link — Share this with your customers</div>' +
      '<div style="background:white;border:1.5px solid var(--brand);border-radius:6px;padding:10px 12px;font-size:13px;font-family:monospace;word-break:break-all;color:var(--brand)">' + customerUrl + '</div>' +
      '<div style="font-size:12px;color:var(--text3);margin-top:6px">Customers open this link to book appointments — works on any device</div>' +
      '</div>' +

      '<div style="background:var(--bg3);border-radius:10px;padding:18px;margin-bottom:24px;text-align:left;">' +
      '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);margin-bottom:6px">🔐 Your Admin Dashboard — Keep this private</div>' +
      '<div style="background:white;border:1.5px solid #374151;border-radius:6px;padding:10px 12px;font-size:13px;font-family:monospace;word-break:break-all;color:#374151">' + adminUrl + '</div>' +
      '<div style="font-size:12px;color:var(--text3);margin-top:6px">Only you and your staff use this link</div>' +
      '</div>' +

      '<div style="background:#DCFCE7;border:1px solid #86EFAC;border-radius:10px;padding:14px;margin-bottom:20px;text-align:left;">' +
      '<div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:6px">✅ Firebase Active — Works on All Devices</div>' +
      '<div style="font-size:13px;color:#166534;line-height:1.8;">' +
        'Your data is saved to Firebase. <strong>No extra steps needed.</strong><br>' +
        'The admin link works on every phone, every device, every browser automatically.' +
      '</div>' +
      '</div>' +

      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">' +
      '<button class="btn btn-primary" onclick="goToAdmin()" style="padding:12px 24px;font-size:15px;">🔐 Go to Admin Login</button>' +
      '<button class="btn btn-outline" onclick="goToBooking()" style="padding:12px 20px">📅 View Booking Page</button>' +
      '</div>' +
      '</div>';
  }

  var sidebar = document.getElementById('bk-sidebar');
  if(sidebar) {
    var b = S.business;
    sidebar.style.background = b.color;
    var logoHtml = b.logoData
      ? '<img src="'+b.logoData+'" style="width:60px;height:60px;object-fit:contain;border-radius:10px;margin-bottom:12px;" alt="logo">'
      : '<div style="font-size:48px;margin-bottom:8px">'+b.emoji+'</div>';
    sidebar.innerHTML =
      '<div style="text-align:center;padding:32px 20px;">' +
      logoHtml +
      '<div style="font-family:serif;font-size:22px;color:white;margin-bottom:6px">'+b.name+'</div>' +
      '<div style="font-size:13px;opacity:0.75;color:white">'+b.type+'</div>' +
      '</div>';
  }
}


function goToAdmin(){
  window.location.hash = '#admin';
  var exists = load();
  if(exists && isSetupDone()){
    showScreen('login');
    renderLoginScreen();
  }
}

// ── PUBLISH (Firebase version — no download needed) ──────────
// With Firebase, all changes are live instantly on all devices.
// No need to download or re-upload any file.
function downloadAndDeploy(){
  showToast('✅ All changes are live! Firebase syncs to all devices automatically.', 'success');
}

function goToBooking(){
  var baseUrl = window.location.origin + window.location.pathname;
  baseUrl = baseUrl.split('#')[0].split('?')[0];
  window.location.href = baseUrl + '?biz=' + (_bizId || 'setup');
}

// ================================================================
// LOGIN SCREEN
// ================================================================
function renderLoginScreen() {
  const b = S.business;
  setText('login-biz-name', b.name);
  setText('login-biz-type', b.type);
  // Login logo — image or emoji
  var llEl = document.getElementById('login-logo');
  if(b.logoData){
    llEl.innerHTML = '<img src="'+b.logoData+'" style="width:56px;height:56px;object-fit:contain;border-radius:8px;" alt="logo">';
  } else {
    llEl.textContent = b.emoji;
  }
  document.documentElement.style.setProperty('--brand', b.color);
  document.documentElement.style.setProperty('--brand-l', b.color+'18');
}

function switchLoginTab(role) {
  loginTab = role;
  document.getElementById('ltab-owner').classList.toggle('active', role==='owner');
  document.getElementById('ltab-staff').classList.toggle('active', role==='staff');
  hide('login-err');
}

async function doLogin() {
  const pw = val('login-pass');
  if (!pw) { show('login-err'); return; }

  // S.passwords may be missing on a new device (loaded from public collection)
  // In that case fetch passwords from meta/auth in Firebase
  let passwords = S.passwords;
  if (!passwords || (!passwords.owner && !passwords.staff)) {
    passwords = await fbLoadAuth();
  }

  const stored = loginTab === 'owner' ? passwords?.owner : passwords?.staff;

  if (stored && pw === stored) {
    currentRole = loginTab;
    // Store passwords in S for future use in this session
    S.passwords = passwords;
    hide('login-err');
    document.getElementById('login-pass').value = '';
    // Reload fresh data from Firebase
    if (_bizId) {
      S.appointments = await fbLoadAppointments(_bizId);
      S.customers    = await fbLoadCustomers(_bizId);
    }
    showScreen('app');
    initApp();
    navigate('dashboard', null);
  } else {
    show('login-err');
  }
}

function gotoBooking() {
  var baseUrl = window.location.origin + window.location.pathname;
  baseUrl = baseUrl.split('#')[0].split('?')[0];
  window.location.href = baseUrl + '?biz=' + (_bizId || '');
}

function logout() {
  currentRole = null;
  var baseUrl = window.location.origin + window.location.pathname;
  baseUrl = baseUrl.split('#')[0].split('?')[0];
  window.location.href = baseUrl + '?biz=' + (_bizId || '');
}

// ================================================================
// DASHBOARD APP
// ================================================================
function initApp() {
  const b = S.business;
  const n = N();
  // Apply brand
  document.documentElement.style.setProperty('--brand', b.color);
  document.documentElement.style.setProperty('--brand-d', adjustColor(b.color,-18));
  document.documentElement.style.setProperty('--brand-l', b.color+'18');
  // Sidebar — show logo image if uploaded, else emoji
  var sbLogo = document.getElementById('sb-logo');
  if(b.logoData){
    sbLogo.innerHTML = '<img src="'+b.logoData+'" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" alt="logo">';
    sbLogo.style.background = 'transparent';
  } else {
    sbLogo.innerHTML = b.emoji;
    sbLogo.style.background = b.color;
  }
  setText('sb-biz-name', b.name);
  setText('sb-biz-type', b.type);
  document.title = b.name + ' — Dashboard';
  // Topbar
  const av = document.getElementById('topbar-avatar');
  if (av) { av.textContent = b.name[0]?.toUpperCase()||'B'; av.style.background = b.color; }
  setText('role-pill', currentRole==='owner'?'👑 Owner':'👤 Staff');
  document.getElementById('role-pill').style.background = b.color+'22';
  document.getElementById('role-pill').style.color = b.color;
  // Apply all niche labels
  applyLabels();
  // Role-based nav visibility
  document.querySelectorAll('.owner-only').forEach(el => {
    el.style.display = currentRole==='owner' ? '' : 'none';
  });
}

function applyLabels() {
  const n = N();
  // Sidebar labels
  setAllText('.lbl-bookings', L('appt')+'s');
  setAllText('.lbl-staff', L('staff'));
  setAllText('.lbl-customers', L('cust'));
  setAllText('.lbl-services', L('svcs'));
  // Page labels
  setAllText('.lbl-new-booking', 'New '+L('appt'));
  setAllText('.lbl-today-title', "Today's "+L('appt')+'s');
  setAllText('.lbl-cust-name', L('custS')+' Name');
  setAllText('.lbl-service', L('svcS'));
  setAllText('.lbl-staff-single', L('staffS'));
  setAllText('.lbl-staff-mgmt', L('staff')+' Management');
  setAllText('.lbl-cust-mgmt', L('cust'));
  setAllText('.lbl-svc-mgmt', L('svcs'));
  setAllText('.lbl-add-staff', 'Add '+L('staffS'));
  setAllText('.lbl-add-service', 'Add '+L('svcS'));
  setAllText('.lbl-customer-h', L('custS'));
  setAllText('.lbl-staff-h', L('staffS'));
  setAllText('.lbl-choose-staff', 'Choose Your '+L('staffS'));
}

function setAllText(sel, txt) {
  document.querySelectorAll(sel).forEach(el => el.textContent = txt);
}

function adjustColor(hex, amt) {
  try {
    const n = parseInt(hex.replace('#',''),16);
    const r = Math.max(0,Math.min(255,(n>>16)+amt));
    const g = Math.max(0,Math.min(255,((n>>8)&0xFF)+amt));
    const b = Math.max(0,Math.min(255,(n&0xFF)+amt));
    return '#'+(0x1000000+(r<<16)+(g<<8)+b).toString(16).slice(1);
  } catch(e) { return hex; }
}

// ── NAVIGATE ──────────────────────────────────────────────────
function navigate(page, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  else { const it = document.querySelector(`.nav-item[data-page="${page}"]`); if(it) it.classList.add('active'); }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-'+page);
  if (pg) pg.classList.add('active');
  const titles = {dashboard:'Dashboard',appointments:L('appt')+'s',calendar:'Calendar','new-booking':'New '+L('appt'),staff:L('staff'),customers:L('cust'),services:L('svcs'),branches:'Branches',analytics:'Analytics',settings:'Settings'};
  setText('topbar-title', titles[page]||page);
  const fns = {dashboard:renderDashboard,appointments:renderAppointments,calendar:renderCalendar,'new-booking':renderNewBooking,staff:renderStaff,customers:renderCustomers,services:renderServices,branches:renderBranches,analytics:renderAnalytics,settings:renderSettings};
  if (fns[page]) fns[page]();
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

// ── DASHBOARD ─────────────────────────────────────────────────
function renderDashboard() {
  const today    = new Date().toISOString().split('T')[0];
  const todayA   = S.appointments.filter(a => a.date===today);
  const confirmed= S.appointments.filter(a => a.status==='confirmed');
  const noShows  = S.appointments.filter(a => a.status==='no-show').length;
  const revenue  = confirmed.reduce((s,a) => s+a.price, 0);
  const n        = N();

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card"><div class="stat-lbl">Total Bookings</div><div class="stat-val">${S.appointments.length}</div><div class="stat-ch">↑ All time</div></div>
    <div class="stat-card"><div class="stat-lbl">Confirmed</div><div class="stat-val">${confirmed.length}</div><div class="stat-ch">Active</div></div>
    <div class="stat-card"><div class="stat-lbl">Total ${n.cust}</div><div class="stat-val">${S.customers.length}</div><div class="stat-ch">↑ Growing</div></div>
    <div class="stat-card"><div class="stat-lbl">Revenue</div><div class="stat-val" style="font-size:18px">${fmt(revenue)}</div><div class="stat-ch">Confirmed only</div></div>
    <div class="stat-card"><div class="stat-lbl">No-shows</div><div class="stat-val">${noShows}</div><div class="stat-ch ${noShows>2?'down':''}">Track & follow up</div></div>`;

  setText('today-badge', todayA.length+' today');
  document.getElementById('today-list').innerHTML = todayA.length
    ? todayA.map(a=>`<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)"><div><div style="font-weight:600;font-size:13px">${a.customer}</div><div style="font-size:12px;color:var(--text3)">${a.service} · ${a.staff}</div></div><div style="text-align:right"><div style="font-weight:700">${a.time}</div><span class="badge ${statusBadge(a.status)}">${a.status}</span></div></div>`).join('')
    : '<div class="empty-state">📅<br>No appointments today</div>';

  renderMiniCal();
}

function statusBadge(st) {
  return {confirmed:'badge-success',pending:'badge-warning',cancelled:'badge-danger','no-show':'badge-gray'}[st]||'badge-gray';
}

function renderMiniCal() {
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const today=new Date(), y=calYear, m=calMonth;
  const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
  let html=`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
    <button class="cal-btn" onclick="calPrev()">‹</button>
    <span style="font-size:13px;font-weight:700">${months[m]} ${y}</span>
    <button class="cal-btn" onclick="calNext()">›</button>
  </div>
  <div class="cal-day-names">${['S','M','T','W','T','F','S'].map(d=>`<div class="cal-dn">${d}</div>`).join('')}</div>
  <div class="cal-grid">`;
  for(let i=0;i<first;i++) html+=`<div class="cal-cell other"></div>`;
  for(let d=1;d<=days;d++){
    const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isT=y===today.getFullYear()&&m===today.getMonth()&&d===today.getDate();
    const has=S.appointments.some(a=>a.date===ds);
    html+=`<div class="cal-cell ${isT?'today':''}"><div class="cal-num">${d}</div>${has?`<div class="cal-dot"></div>`:''}</div>`;
  }
  html+=`</div>`;
  document.getElementById('mini-cal').innerHTML=html;
}

function calPrev(){ if(calMonth===0){calMonth=11;calYear--;}else calMonth--; renderMiniCal(); if(document.getElementById('page-calendar').classList.contains('active'))renderCalendar(); }
function calNext(){ if(calMonth===11){calMonth=0;calYear++;}else calMonth++; renderMiniCal(); if(document.getElementById('page-calendar').classList.contains('active'))renderCalendar(); }

// ── APPOINTMENTS ──────────────────────────────────────────────
function renderAppointments() {
  populateBranchFilter('filter-branch');
  renderApptTable();
}

function populateBranchFilter(selId) {
  const sel = document.getElementById(selId);
  if (!sel) return;
  sel.innerHTML = `<option value="">All Branches</option>` + S.branches.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
}

function filterAppts(v, type) { apptFilters[type]=v; renderApptTable(); }

function renderApptTable() {
  let list = [...S.appointments];
  if (apptFilters.search) list=list.filter(a=>a.customer.toLowerCase().includes(apptFilters.search.toLowerCase())||a.service.toLowerCase().includes(apptFilters.search.toLowerCase()));
  if (apptFilters.status) list=list.filter(a=>a.status===apptFilters.status);
  if (apptFilters.branch) list=list.filter(a=>String(a.branchId)===String(apptFilters.branch));
  list.sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('appts-body').innerHTML = list.length
    ? list.map(a=>`<tr>
      <td><div style="font-weight:600">${a.customer}</div><div style="font-size:11px;color:var(--text3)">${a.phone||''}</div></td>
      <td>${a.service}</td><td>${a.staff}</td>
      <td><span class="tag">${a.branchName||'—'}</span></td>
      <td><div style="font-weight:600">${a.date}</div><div style="font-size:11px;color:var(--text3)">${a.time}</div></td>
      <td style="font-weight:700">${fmt(a.price)}</td>
      <td><span class="badge ${statusBadge(a.status)}">${a.status}</span></td>
      <td><div style="display:flex;gap:5px">
        <button class="icon-btn" title="Confirm" onclick="setApptStatus(${a.id},'confirmed')">✓</button>
        <button class="icon-btn" title="No-show" onclick="setApptStatus(${a.id},'no-show')">✗</button>
        <button class="icon-btn" title="Delete" onclick="deleteAppt(${a.id})">🗑</button>
      </div></td>
    </tr>`).join('')
    : `<tr><td colspan="8"><div class="empty-state">📭<br>No bookings found</div></td></tr>`;
}

function setApptStatus(id, status) {
  const a=S.appointments.find(x=>x.id===id); if(!a) return;
  a.status=status;
  // Update in Firebase
  if(_bizId) fbUpdateAppointmentStatus(_bizId, id, status).catch(console.error);
  renderApptTable();
  showToast('Marked as '+status,'success');
}
function deleteAppt(id) {
  S.appointments=S.appointments.filter(x=>x.id!==id);
  if(_bizId) fbDeleteAppointment(_bizId, id).catch(console.error);
  renderApptTable();
  showToast('Booking deleted');
}

// ── CALENDAR ─────────────────────────────────────────────────
function renderCalendar() {
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const today=new Date(), y=calYear, m=calMonth;
  const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
  setText('cal-title',`${months[m]} ${y}`);
  document.getElementById('cal-day-names').innerHTML=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="cal-dn">${d}</div>`).join('');
  let html='';
  for(let i=0;i<first;i++) html+=`<div class="cal-cell other"><div class="cal-num"></div></div>`;
  for(let d=1;d<=days;d++){
    const ds=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isT=y===today.getFullYear()&&m===today.getMonth()&&d===today.getDate();
    const cnt=S.appointments.filter(a=>a.date===ds).length;
    html+=`<div class="cal-cell ${isT?'today':''}" onclick="showDayAppts('${ds}')">
      <div class="cal-num">${d}</div>${cnt?`<div class="cal-dot"></div>`:''}
    </div>`;
  }
  document.getElementById('cal-grid').innerHTML=html;
}

function showDayAppts(date) {
  setText('cal-day-title','Bookings for '+date);
  const list=S.appointments.filter(a=>a.date===date);
  document.getElementById('cal-day-list').innerHTML=list.length
    ?list.map(a=>`<div style="display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--border)"><div><div style="font-weight:600">${a.customer}</div><div style="font-size:12px;color:var(--text3)">${a.service} · ${a.staff} · ${a.branchName||''}</div></div><div style="text-align:right"><div style="font-weight:700">${a.time}</div><span class="badge ${statusBadge(a.status)}">${a.status}</span></div></div>`).join('')
    :'<div class="empty-state">No bookings on this day</div>';
}

// ── NEW BOOKING ───────────────────────────────────────────────
function renderNewBooking() {
  const brSel=document.getElementById('nb-branch');
  if(brSel) brSel.innerHTML=S.branches.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
  nbUpdateStaff();
  document.getElementById('nb-service').innerHTML=S.services.filter(s=>s.active).map(s=>`<option value="${s.id}">${s.name} — ${fmt(s.price)}</option>`).join('');
  document.getElementById('nb-time').innerHTML=TIME_SLOTS.map(t=>`<option value="${t}">${t}</option>`).join('');
  const today=new Date().toISOString().split('T')[0];
  setVal('nb-date',today);
  document.getElementById('nb-date').min=today;
}

function nbUpdateStaff() {
  const brId = parseInt(val('nb-branch')) || S.branches[0]?.id;
  let list = S.staff.filter(s => s.active);

  if(S.branches.length > 1){
    // Multi-branch: strictly show only staff assigned to selected branch
    const branchStaff = list.filter(s => s.branchId === brId);
    list = branchStaff; // even if empty — show no staff rather than wrong staff
  }
  // Single branch: show all active staff

  const sel = document.getElementById('nb-staff');
  if(list.length === 0){
    sel.innerHTML = '<option value="">— No staff assigned to this branch —</option>';
  } else {
    sel.innerHTML = list.map(s=>`<option value="${s.id}">${s.name} — ${s.role}</option>`).join('');
  }
}

function saveNewBooking() {
  const name=val('nb-name'); if(!name){showToast('Enter customer name','error');return;}
  const svcId=parseInt(val('nb-service')), staffId=parseInt(val('nb-staff')), brId=parseInt(val('nb-branch'))||S.branches[0]?.id;
  const svc=S.services.find(s=>s.id===svcId), stf=S.staff.find(s=>s.id===staffId), br=S.branches.find(b=>b.id===brId)||S.branches[0];
  const date=val('nb-date'), time=val('nb-time');
  if(!date||!time){showToast('Select date and time','error');return;}
  const appt={id:Date.now(),customer:name,phone:val('nb-phone'),email:val('nb-email'),service:svc?.name||'Service',staff:stf?.name||'Staff',price:svc?.price||0,date,time,status:'confirmed',notes:val('nb-notes'),branchId:br?.id||1,branchName:br?.name||'Main'};
  S.appointments.push(appt);
  // Add/update customer
  let cust=S.customers.find(c=>c.name.toLowerCase()===name.toLowerCase());
  if(!cust){cust={id:Date.now()+1,name,phone:val('nb-phone'),email:val('nb-email'),bookings:0,lastVisit:date,noShows:0};S.customers.push(cust);}
  cust.bookings++;cust.lastVisit=date;
  // Save appointment and customer to Firebase
  if(_bizId){
    fbSaveAppointment(_bizId, appt).catch(console.error);
    fbSaveCustomer(_bizId, cust).catch(console.error);
  }
  showToast('✓ Booking confirmed for '+name,'success');
  navigate('appointments',null);
}

// ── STAFF ─────────────────────────────────────────────────────
function renderStaff() {
  const n=N();
  // Build branch options html once for reuse
  const branchOpts = S.branches.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
  // Show branch assignment banner only when >1 branch exists
  const banner = document.getElementById('branch-assign-banner');
  if(banner) banner.style.display = S.branches.length > 1 ? 'block' : 'none';

  document.getElementById('staff-cards').innerHTML=S.staff.map(s=>{
    const br=S.branches.find(b=>b.id===s.branchId);
    const logoHtml = s.photoData
      ? `<img src="${s.photoData}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${s.name}">`
      : (s.name[0]||'?');

    // Build per-day schedule — migrate old format if needed
    const allDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    if (!s.daySchedule) {
      // Migrate old format or create default
      const oldSch = s.schedule || {};
      const oldDays = oldSch.days || allDays;
      s.daySchedule = {};
      allDays.forEach(d => {
        s.daySchedule[d] = {
          on:    oldDays.includes(d),
          start: oldSch.startTime || '09:00',
          end:   oldSch.endTime   || '20:00'
        };
      });
    }

    // Build per-day rows
    const dayRows = allDays.map(d => {
      const ds = s.daySchedule[d] || { on:false, start:'09:00', end:'20:00' };
      return `<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--border)">
        <button onclick="toggleStaffDay(${s.id},'${d}')" style="width:38px;padding:3px 0;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;border:1.5px solid ${ds.on?'var(--brand)':'var(--border)'};background:${ds.on?'var(--brand)':'var(--bg2)'};color:${ds.on?'white':'var(--text3)'}">${d}</button>
        <input type="time" value="${ds.start||'09:00'}" ${!ds.on?'disabled':''} style="width:82px;padding:3px 5px;border:1px solid ${ds.on?'var(--border)':'var(--bg3)'};border-radius:4px;font-size:11px;font-family:var(--font);background:${ds.on?'white':'var(--bg3)'};" onchange="setStaffDayTime(${s.id},'${d}','start',this.value)">
        <span style="font-size:10px;color:var(--text3)">to</span>
        <input type="time" value="${ds.end||'20:00'}" ${!ds.on?'disabled':''} style="width:82px;padding:3px 5px;border:1px solid ${ds.on?'var(--border)':'var(--bg3)'};border-radius:4px;font-size:11px;font-family:var(--font);background:${ds.on?'white':'var(--bg3)'};" onchange="setStaffDayTime(${s.id},'${d}','end',this.value)">
      </div>`;
    }).join('');

    return `<div class="staff-card">
      <div class="sc-avatar" style="background:${s.photoData?'transparent':S.business.color};overflow:hidden">${logoHtml}</div>
      <div class="sc-name">${s.name}</div>
      <div class="sc-role">${s.role}</div>

      <!-- Branch assignment -->
      <div style="margin-top:10px;margin-bottom:8px">
        <label style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--text3);display:block;margin-bottom:4px">Assigned Branch</label>
        <select class="field-input field-select" style="font-size:12px;padding:6px 28px 6px 10px"
          onchange="assignStaffBranch(${s.id}, parseInt(this.value))">
          ${S.branches.map(b=>`<option value="${b.id}" ${s.branchId===b.id?'selected':''}>${b.name}</option>`).join('')}
        </select>
      </div>

      <!-- Per-Day Schedule -->
      <div style="margin-bottom:8px">
        <label style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--text3);display:block;margin-bottom:6px">Weekly Schedule</label>
        <div style="font-size:10px;color:var(--text3);margin-bottom:6px">Toggle day ON/OFF · Set different times per day</div>
        <div style="border:1px solid var(--border);border-radius:6px;padding:6px 8px;">${dayRows}</div>
      </div>

      <div style="margin-bottom:8px"><span class="badge ${s.active?'badge-success':'badge-gray'}">${s.active?'Active':'Inactive'}</span></div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:10px">${S.appointments.filter(a=>a.staff===s.name).length} bookings</div>
      <div class="sc-actions">
        <button class="btn btn-outline btn-sm" onclick="toggleStaff(${s.id})">${s.active?'Deactivate':'Activate'}</button>
        <button class="btn btn-danger btn-sm" onclick="removeStaff(${s.id})">Remove</button>
      </div>
    </div>`;
  }).join('') || '<div class="empty-state">No staff added yet</div>';
}

function assignStaffBranch(staffId, branchId){
  // Owner/staff can reassign any staff member to a different branch
  var s = S.staff.find(function(x){ return x.id === staffId; });
  if(!s) return;
  s.branchId = branchId;
  saveSync();
  var br = S.branches.find(function(b){ return b.id === branchId; });
  showToast(s.name + ' moved to ' + (br ? br.name : 'branch'), 'success');
  // No full re-render needed — dropdown already reflects new value
}

// Toggle a specific day on/off in per-day schedule
function toggleStaffDay(staffId, day) {
  var s = S.staff.find(function(x){ return x.id === staffId; });
  if (!s) return;
  if (!s.daySchedule) s.daySchedule = {};
  if (!s.daySchedule[day]) s.daySchedule[day] = { on:true, start:'09:00', end:'20:00' };
  s.daySchedule[day].on = !s.daySchedule[day].on;
  saveSync();
  renderStaff();
}

// Set start or end time for a specific day
function setStaffDayTime(staffId, day, field, value) {
  var s = S.staff.find(function(x){ return x.id === staffId; });
  if (!s) return;
  if (!s.daySchedule) s.daySchedule = {};
  if (!s.daySchedule[day]) s.daySchedule[day] = { on:true, start:'09:00', end:'20:00' };
  s.daySchedule[day][field] = value;
  saveSync();
  // No re-render needed — input already shows new value
}

// Legacy setStaffTime — kept for compatibility
function setStaffTime(staffId, field, value) {
  setStaffDayTime(staffId, 'Mon', field, value);
}

// Get day name from date string e.g. "2025-06-15" → "Sun"
function getDayName(dateStr) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return days[new Date(dateStr).getDay()];
}

// Check if staff member is available on a given date based on their schedule
function isStaffAvailableOnDate(staff, dateStr) {
  var dayName = getDayName(dateStr);
  // New per-day schedule format
  if (staff.daySchedule) {
    var ds = staff.daySchedule[dayName];
    if (!ds) return true; // day not configured — assume available
    return ds.on === true;
  }
  // Legacy format fallback
  if (staff.schedule && staff.schedule.days) {
    return staff.schedule.days.includes(dayName);
  }
  return true; // no schedule = always available
}

// Get staff start/end time for a specific date
function getStaffTimesForDate(staff, dateStr) {
  var dayName = getDayName(dateStr);
  if (staff.daySchedule && staff.daySchedule[dayName]) {
    var ds = staff.daySchedule[dayName];
    return { start: ds.start || '09:00', end: ds.end || '20:00' };
  }
  // Legacy format
  if (staff.schedule) {
    return { start: staff.schedule.startTime || '09:00', end: staff.schedule.endTime || '20:00' };
  }
  return { start: '09:00', end: '20:00' };
}

function toggleStaff(id){const s=S.staff.find(x=>x.id===id);if(s){s.active=!s.active;saveSync();renderStaff();}}
function removeStaff(id){S.staff=S.staff.filter(x=>x.id!==id);saveSync();renderStaff();showToast('Staff removed');}

function openModal(id) {
  // Populate branch selects
  const opts=S.branches.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
  ['ms-branch','auth-branch'].forEach(sid=>{const el=document.getElementById(sid);if(el)el.innerHTML=opts;});
  document.getElementById(id).classList.add('open');
}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.addEventListener('click',e=>{if(e.target?.classList.contains('modal-overlay'))e.target.classList.remove('open');});

function saveStaff(){
  const name=val('ms-name');if(!name){showToast('Enter a name','error');return;}
  S.staff.push({
    id:Date.now(),name,role:val('ms-role')||N().role,phone:val('ms-phone'),
    active:true,branchId:parseInt(val('ms-branch'))||1,
    schedule:{ days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], startTime:'09:00', endTime:'20:00' }
  });
  saveSync();closeModal('modal-add-staff');
  ['ms-name','ms-role','ms-phone'].forEach(id=>setVal(id,''));
  renderStaff();showToast(N().staffS+' added!','success');
}

// ── CUSTOMERS ─────────────────────────────────────────────────
function renderCustomers(filter=''){
  let list=[...S.customers];
  if(filter)list=list.filter(c=>c.name.toLowerCase().includes(filter.toLowerCase()));
  document.getElementById('customers-body').innerHTML=list.map(c=>`<tr>
    <td><div style="font-weight:600">${c.name}</div></td><td>${c.phone||'—'}</td><td style="color:var(--text2)">${c.email||'—'}</td>
    <td><span class="badge badge-info">${c.bookings||0}</span></td><td>${c.lastVisit||'—'}</td>
    <td>${c.noShows?`<span class="badge badge-danger">${c.noShows}</span>`:'<span class="badge badge-success">0</span>'}</td>
  </tr>`).join('')||`<tr><td colspan="6"><div class="empty-state">No customers yet</div></td></tr>`;
}
function searchCustomers(v){renderCustomers(v);}

// ── SERVICES ──────────────────────────────────────────────────
function renderServices(){
  document.getElementById('services-body').innerHTML=S.services.map(s=>`<tr>
    <td style="font-weight:600">${s.name}</td><td>${s.dur} mins</td>
    <td style="font-weight:700">${fmt(s.price)}</td>
    <td><span class="tag">${s.category||''}</span></td>
    <td><div class="toggle ${s.active?'on':''}" onclick="toggleService(${s.id})"></div></td>
    <td><button class="btn btn-danger btn-sm" onclick="removeService(${s.id})">Delete</button></td>
  </tr>`).join('')||`<tr><td colspan="6"><div class="empty-state">No services added</div></td></tr>`;
}
function toggleService(id){const s=S.services.find(x=>x.id===id);if(s){s.active=!s.active;saveSync();renderServices();}}
function removeService(id){S.services=S.services.filter(x=>x.id!==id);saveSync();renderServices();showToast('Service removed');}
function saveService(){
  const name=val('msv-name');if(!name){showToast('Enter service name','error');return;}
  S.services.push({id:Date.now(),name,price:parseInt(val('msv-price'))||0,dur:parseInt(val('msv-dur'))||60,active:true,category:val('msv-cat')||N().cat});
  saveSync();closeModal('modal-add-service');
  ['msv-name','msv-cat'].forEach(id=>setVal(id,''));
  setVal('msv-price','500');setVal('msv-dur','60');
  renderServices();showToast(N().svcS+' added!','success');
}

// ── BRANCHES ─────────────────────────────────────────────────
function renderBranches(){
  document.getElementById('branch-cards').innerHTML=S.branches.map(b=>`<div class="branch-card">
    <div class="bc-head">
      <div>
        <div class="bc-name">${b.name} ${b.isMain?'<span class="badge badge-info" style="font-size:10px">Main</span>':''}</div>
      </div>
      ${currentRole==='owner'&&!b.isMain?`<button class="btn btn-danger btn-sm" onclick="removeBranch(${b.id})">Remove</button>`:''}
    </div>
    <div class="bc-addr">📍 ${b.address||'—'}</div>
    <div class="bc-meta">📞 ${b.phone||'—'}</div>
    <div class="bc-meta">💬 ${b.whatsapp||'—'}</div>
    <div class="bc-meta">🕐 ${b.openTime||'09:00'} — ${b.closeTime||'20:00'}</div>
    <div class="bc-mgr">
      <div class="bc-mgr-label">Branch Manager</div>
      <div class="bc-mgr-name">${b.manager||'—'}</div>
      <div class="bc-mgr-ph">${b.managerPhone||''}</div>
    </div>
    <div style="font-size:12px;color:var(--text3);margin-top:10px">
      ${S.staff.filter(s=>s.branchId===b.id).length} ${N().staff.toLowerCase()} · ${S.appointments.filter(a=>a.branchId===b.id).length} bookings
    </div>
  </div>`).join('');
}

function saveBranch(){
  const name=val('mb-name');if(!name){showToast('Enter branch name','error');return;}
  const br={id:Date.now(),name,address:val('mb-addr'),phone:val('mb-phone'),whatsapp:val('mb-wa'),manager:val('mb-mgr'),managerPhone:val('mb-mgr-ph'),openTime:val('mb-open')||'09:00',closeTime:val('mb-close')||'20:00',isMain:false};
  S.branches.push(br);saveSync();
  closeModal('modal-add-branch');
  ['mb-name','mb-addr','mb-phone','mb-wa','mb-mgr','mb-mgr-ph'].forEach(id=>setVal(id,''));
  renderBranches();showToast(`Branch "${name}" added!`,'success');
}
function removeBranch(id){
  if(S.branches.find(b=>b.id===id)?.isMain){showToast('Cannot remove main branch','error');return;}
  S.branches=S.branches.filter(b=>b.id!==id);
  S.staff.forEach(s=>{if(s.branchId===id)s.branchId=S.branches[0]?.id||1;});
  saveSync();renderBranches();showToast('Branch removed');
}

// ── ANALYTICS ────────────────────────────────────────────────
function renderAnalytics(){
  const conf=S.appointments.filter(a=>a.status==='confirmed');
  const rev=conf.reduce((s,a)=>s+a.price,0);
  const noShow=S.appointments.filter(a=>a.status==='no-show').length;
  const rate=S.appointments.length?Math.round(conf.length/S.appointments.length*100):0;
  const nsRate=S.appointments.length?Math.round(noShow/S.appointments.length*100):0;
  const avg=conf.length?Math.round(rev/conf.length):0;
  document.getElementById('analytics-stats').innerHTML=`
    <div class="stat-card"><div class="stat-lbl">Total Revenue</div><div class="stat-val" style="font-size:18px">${fmt(rev)}</div><div class="stat-ch">Confirmed bookings</div></div>
    <div class="stat-card"><div class="stat-lbl">Completion Rate</div><div class="stat-val">${rate}%</div><div class="stat-ch">Of all bookings</div></div>
    <div class="stat-card"><div class="stat-lbl">No-show Rate</div><div class="stat-val">${nsRate}%</div><div class="stat-ch ${noShow>0?'down':''}">Track & follow up</div></div>
    <div class="stat-card"><div class="stat-lbl">Avg Booking Value</div><div class="stat-val" style="font-size:18px">${fmt(avg)}</div><div class="stat-ch">Per confirmed booking</div></div>`;
  const svcMap={};
  S.appointments.forEach(a=>{if(!svcMap[a.service])svcMap[a.service]={count:0,rev:0};svcMap[a.service].count++;if(a.status==='confirmed')svcMap[a.service].rev+=a.price;});
  const maxC=Math.max(...Object.values(svcMap).map(v=>v.count),1);
  document.getElementById('svc-perf').innerHTML=Object.entries(svcMap).sort((a,b)=>b[1].count-a[1].count).map(([name,v])=>`
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
        <span style="font-weight:500">${name}</span>
        <span style="color:var(--text2)">${v.count} bookings · ${fmt(v.rev)}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${v.count/maxC*100}%"></div></div>
    </div>`).join('')||'<div class="empty-state">No booking data yet</div>';
}

// ── SETTINGS ─────────────────────────────────────────────────
function renderSettings(){
  const b=S.business;
  setVal('st-name',b.name);setVal('st-type',b.type);setVal('st-address',b.address);setVal('st-whatsapp',b.whatsapp);setVal('st-email',b.email||'');
  // Colors
  document.getElementById('color-swatches').innerHTML=BRAND_COLORS.map(c=>`<div class="color-chip ${b.color===c?'sel':''}" style="background:${c}" onclick="stSetColor('${c}',this)"></div>`).join('');
  document.getElementById('custom-color').value=b.color;
  // Emojis
  document.getElementById('emoji-picker').innerHTML=EMOJIS.map(e=>`<span class="ep ${b.emoji===e?'sel':''}" onclick="stSetEmoji('${e}',this)">${e}</span>`).join('');
  // Logo preview
  var logoHtml = b.logoData
    ? '<img src="'+b.logoData+'" style="width:60px;height:60px;object-fit:contain;border-radius:8px;border:2px solid var(--brand);">'
    : '<span style="font-size:36px">'+b.emoji+'</span>';
  var logoEl = document.getElementById('logo-preview');
  if(logoEl) logoEl.innerHTML = logoHtml;
  // Currency
  setVal('cur-symbol',S.currency?.symbol||'PKR');setVal('cur-pos',S.currency?.position||'before');
  document.getElementById('currency-presets').innerHTML=CURRENCIES.map(c=>`<span class="cur-preset" onclick="stSetCurrency('${c.s}')">${c.l}</span>`).join('');
  updateCurrencyPreview();
  // Working days
  document.getElementById('working-days-settings').innerHTML=DAYS.map((d,i)=>`
    <div class="working-day-row"><div class="wd-label">${d}</div>
    <div class="toggle ${(S.hours?.days||[])[i]?'on':''}" onclick="stToggleDay(${i},this)"></div></div>`).join('');
  // Labels
  const n=N();
  const labelFields=[{k:'staff',l:'Staff Label',def:n.staff},{k:'staffS',l:'Staff Single',def:n.staffS},{k:'cust',l:'Customer Label',def:n.cust},{k:'custS',l:'Customer Single',def:n.custS},{k:'svcs',l:'Services Label',def:n.svcs},{k:'appt',l:'Appointment Label',def:n.appt}];
  document.getElementById('labels-body').innerHTML=`<div class="labels-grid">${labelFields.map(f=>`<div class="field-group"><label class="field-label">${f.l}</label><input class="field-input" value="${S.labels?.[f.k]||f.def}" onchange="S.labels=S.labels||{};S.labels['${f.k}']=this.value"></div>`).join('')}</div><button class="btn btn-primary" onclick="saveLabels()">Apply Labels</button>`;
  // Auth users
  const authBr=document.getElementById('auth-branch');
  if(authBr) authBr.innerHTML=S.branches.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
  renderAuthList();
}

function showStTab(id,el){
  document.querySelectorAll('.st-section').forEach(s=>s.classList.remove('active'));
  document.getElementById('st-'+id).classList.add('active');
  document.querySelectorAll('.settings-nav-item').forEach(s=>s.classList.remove('active'));
  if(el)el.classList.add('active');
}

function onTypeChange(){S.business.type=val('st-type');}
function stSetColor(c,el){S.business.color=c;document.querySelectorAll('#color-swatches .color-chip').forEach(e=>e.classList.remove('sel'));if(el)el.classList.add('sel');}
function setCustomColor(c){S.business.color=c;}
function stSetEmoji(e,el){S.business.emoji=e;document.querySelectorAll('.ep').forEach(x=>x.classList.remove('sel'));if(el)el.classList.add('sel');}
function stSetCurrency(sym){setVal('cur-symbol',sym);S.currency=S.currency||{};S.currency.symbol=sym;updateCurrencyPreview();}
function stToggleDay(i,el){S.hours=S.hours||{days:[true,true,true,true,true,false,true]};S.hours.days[i]=!S.hours.days[i];el.classList.toggle('on');}
function updateCurrencyPreview(){const sym=val('cur-symbol')||'PKR',pos=val('cur-pos')||'before';setText('cur-preview',pos==='before'?`${sym} 1,500`:`1,500 ${sym}`);}

function saveBusinessInfo(){
  S.business.name=val('st-name')||S.business.name;S.business.type=val('st-type');S.business.address=val('st-address');S.business.whatsapp=val('st-whatsapp');S.business.email=val('st-email');
  saveSync();setText('sb-biz-name',S.business.name);setText('sb-biz-type',S.business.type);showToast('Business info saved!','success');
}
function handleLogoUpload(input){
  var file = input.files[0];
  if(!file) return;
  if(file.size > 500000){ showToast('Logo too large. Max 500KB.','error'); return; }
  var reader = new FileReader();
  reader.onload = function(e){
    S.business.logoData = e.target.result;
    saveSync();
    // Show preview
    var prev = document.getElementById('logo-preview');
    if(prev){
      prev.innerHTML = '<img src="'+e.target.result+'" style="width:60px;height:60px;object-fit:contain;border-radius:8px;border:2px solid var(--brand);">';
    }
    // Update sidebar immediately
    var sbLogo = document.getElementById('sb-logo');
    if(sbLogo){
      sbLogo.innerHTML = '<img src="'+e.target.result+'" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" alt="logo">';
      sbLogo.style.background = 'transparent';
    }
    showToast('Logo uploaded and saved!','success');
  };
  reader.readAsDataURL(file);
}

function removeLogo(){
  S.business.logoData = null;
  saveSync();
  var prev = document.getElementById('logo-preview');
  if(prev) prev.innerHTML = '<span style="font-size:36px">'+S.business.emoji+'</span>';
  var sbLogo = document.getElementById('sb-logo');
  if(sbLogo){ sbLogo.innerHTML = S.business.emoji; sbLogo.style.background = S.business.color; }
  showToast('Logo removed','success');
}

function saveBranding(){
  document.documentElement.style.setProperty('--brand',S.business.color);
  document.documentElement.style.setProperty('--brand-l',S.business.color+'18');
  document.getElementById('sb-logo').style.background=S.business.color;
  document.getElementById('sb-logo').textContent=S.business.emoji;
  document.getElementById('topbar-avatar').style.background=S.business.color;
  saveSync();showToast('Branding applied!','success');
}
function saveCurrency(){S.currency={symbol:val('cur-symbol')||'PKR',position:val('cur-pos')||'before'};saveSync();showToast('Currency saved!','success');}
function saveSlotSettings(){saveSync();showToast('Slot settings saved!','success');}
function saveLabels(){saveSync();applyLabels();showToast('Labels updated!','success');}
function savePasswords(){
  const op=val('pw-owner'),sp=val('pw-staff');
  if(!op){showToast('Owner password cannot be empty','error');return;}
  S.passwords={owner:op,staff:sp||op};
  saveSync();setVal('pw-owner','');setVal('pw-staff','');
  showToast('Passwords updated!','success');
}
function addHoliday(){
  const d=val('hol-date'),r=val('hol-reason');if(!d){showToast('Select a date','error');return;}
  S.holidays=S.holidays||[];S.holidays.push({date:d,reason:r||'Holiday'});
  saveSync();renderHolidayList();setVal('hol-date','');setVal('hol-reason','');
}
function renderHolidayList(){
  document.getElementById('holidays-list').innerHTML=(S.holidays||[]).map((h,i)=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg3);border-radius:6px">
      <div><strong>${h.date}</strong> <span style="color:var(--text2)">${h.reason}</span></div>
      <button class="icon-btn" onclick="S.holidays.splice(${i},1);saveSync();renderHolidayList()">×</button>
    </div>`).join('');
}
function addAuthUser(){
  const name=val('auth-name');if(!name){showToast('Enter a name','error');return;}
  const brId=parseInt(val('auth-branch'))||S.branches[0]?.id;
  const br=S.branches.find(b=>b.id===brId);
  S.authorisedUsers=S.authorisedUsers||[];
  S.authorisedUsers.push({id:Date.now(),name,role:val('auth-role')||'Staff',email:val('auth-email'),branchId:brId,branchName:br?.name||'Main'});
  saveSync();['auth-name','auth-role','auth-email'].forEach(id=>setVal(id,''));
  renderAuthList();showToast(`${name} added`,'success');
}
function renderAuthList(){
  document.getElementById('auth-list').innerHTML=(S.authorisedUsers||[]).map((u,i)=>`
    <div class="auth-item">
      <div><div class="auth-name-row">${u.name} <span class="badge badge-info" style="font-size:10px">${u.role}</span></div>
      <div class="auth-sub">${u.email||''} · ${u.branchName||''}</div></div>
      <button class="icon-btn" onclick="S.authorisedUsers.splice(${i},1);saveSync();renderAuthList()">×</button>
    </div>`).join('')||'<div style="font-size:13px;color:var(--text3)">No authorised users yet</div>';
}

// ================================================================
// CUSTOMER BOOKING PORTAL
// ================================================================
function initBookingPortal(){
  const b=S.business,n=N();
  document.title=b.name+' — Book Appointment';
  document.documentElement.style.setProperty('--brand',b.color);
  document.documentElement.style.setProperty('--brand-l',b.color+'18');
  document.getElementById('bk-sidebar').style.background=b.color;
  // Booking portal nav — show logo or emoji
  var bkIcon = document.getElementById('bk-nav-icon');
  if(b.logoData){
    bkIcon.innerHTML = '<img src="'+b.logoData+'" style="height:28px;width:28px;object-fit:contain;border-radius:4px;" alt="logo">';
  } else {
    bkIcon.textContent = b.emoji;
  }
  setText('bk-nav-name',b.name);
  setText('bk-biz-name',b.name);setText('bk-biz-tag',n.welcome);
  setText('bk-addr',b.address||'');setText('bk-wa',b.whatsapp||'');
  // Services
  document.getElementById('bk-services').innerHTML=S.services.filter(s=>s.active).map(s=>`
    <div class="bk-svc-item ${bkSel.serviceId===s.id?'sel':''}" onclick="bkPickService(${s.id},this)">
      <div class="bk-svc-name">${s.name}</div>
      <div class="bk-svc-meta">${s.dur} mins · ${fmt(s.price)}</div>
    </div>`).join('');
  // Branches
  const bkBW=document.getElementById('bk-branch-wrap');
  if(S.branches.length>1){
    bkBW.style.display='block';
    document.getElementById('bk-branches').innerHTML=S.branches.map(b=>`
      <div class="bk-branch-opt ${bkSel.branchId===b.id?'sel':''}" onclick="bkPickBranch(${b.id},this)">
        <div class="bk-branch-name">${b.name}</div>
        <div class="bk-branch-addr">📍 ${b.address}</div>
        ${b.phone?`<div style="font-size:12px;color:var(--text2);margin-top:3px">📞 ${b.phone}</div>`:''}
      </div>`).join('');
    // If no branch selected yet, reset staff so customer must pick branch first
    if(!bkSel.branchId){
      bkSel.staffId = null;
      bkSel.time    = null;
    }
  } else {
    // Single branch — auto-select it, show all staff immediately
    bkBW.style.display='none';
    bkSel.branchId = S.branches[0]?.id || 1;
  }
  // Set date FIRST so staff availability is correct when cards render
  const today=new Date().toISOString().split('T')[0];
  setVal('bk-date',today);
  document.getElementById('bk-date').min=today;
  // Now render staff with date already set — shows correct availability
  bkRenderStaff();
  bkLoadSlots();
  // Reset steps
  show('bk-s1');hide('bk-s2');hide('bk-s3');
}

function bkPickService(id,el){bkSel.serviceId=id;document.querySelectorAll('.bk-svc-item').forEach(e=>e.classList.remove('sel'));if(el)el.classList.add('sel');}
function bkPickBranch(id,el){
  bkSel.branchId = id;
  bkSel.staffId  = null; // reset staff when branch changes
  bkSel.time     = null; // reset time too
  document.querySelectorAll('.bk-branch-opt').forEach(function(e){ e.classList.remove('sel'); });
  if(el) el.classList.add('sel');
  // Update address shown in sidebar to match selected branch
  var selBr = S.branches.find(function(b){ return b.id === id; });
  if(selBr){
    setText('bk-addr', selBr.address || '');
    setText('bk-wa',   selBr.whatsapp || selBr.phone || '');
  }
  bkRenderStaff();
  bkLoadSlots();
}

function bkRenderStaff(){
  // Always reset selected staff when branch changes
  var allActive = S.staff.filter(function(s){ return s.active; });
  var list = [];

  if(bkSel.branchId){
    // Strictly show only staff assigned to the selected branch
    list = allActive.filter(function(s){ return s.branchId === bkSel.branchId; });
  } else {
    // No branch selected yet — show nothing until branch is picked
    list = [];
  }

  // If only one branch exists, show all active staff regardless of assignment
  // (single-branch mode — assignment doesn't matter)
  if(S.branches.length === 1){
    list = allActive;
  }

  var branchName = '';
  if(bkSel.branchId){
    var selBr = S.branches.find(function(b){ return b.id === bkSel.branchId; });
    if(selBr) branchName = selBr.name;
  }

  var container = document.getElementById('bk-staff');
  if(list.length === 0 && S.branches.length > 1){
    container.innerHTML = '<div style="padding:16px;color:var(--text3);font-size:13px;grid-column:1/-1;">'+
      (bkSel.branchId
        ? 'No '+L('staff').toLowerCase()+' assigned to this branch yet.'
        : 'Please select a branch first.'
      )+'</div>';
    return;
  }

  var selectedDate = document.getElementById('bk-date')?.value || '';

  container.innerHTML = list.map(function(s){
    var isSel = bkSel.staffId === s.id;
    var logoHtml = s.photoData
      ? '<img src="'+s.photoData+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="'+s.name+'">'
      : (s.name[0]||'?');

    // Check if staff is available on selected date
    var availableOnDate = !selectedDate || isStaffAvailableOnDate(s, selectedDate);

    // Build schedule info for this date
    var scheduleInfo = '';
    var availTimes = availableOnDate ? getStaffTimesForDate(s, selectedDate) : null;
    // Get working days list
    var workingDays = [];
    var allDaysCheck = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    if (s.daySchedule) {
      allDaysCheck.forEach(function(d){ if(s.daySchedule[d] && s.daySchedule[d].on) workingDays.push(d); });
    } else if (s.schedule && s.schedule.days) {
      workingDays = s.schedule.days;
    }
    if (workingDays.length > 0 || !availableOnDate) {
      scheduleInfo = '<div style="font-size:10px;color:'+(availableOnDate?'var(--success)':'var(--danger)')+';margin-top:4px;font-weight:600">'
        + (availableOnDate ? '✓ Available' : '✗ Not available this day')
        + '</div>';
      if (availableOnDate && availTimes) {
        scheduleInfo += '<div style="font-size:10px;color:var(--text3)">'
          + availTimes.start + ' – ' + availTimes.end
          + '</div>';
      }
      if (workingDays.length > 0) {
        scheduleInfo += '<div style="font-size:10px;color:var(--text3);margin-top:2px">'
          + workingDays.join(' · ')
          + '</div>';
      }
    }

    return '<div class="bk-staff-card '+(isSel?'sel':'')+(availableOnDate?'':' unavailable-staff')+'" '
      + (availableOnDate ? 'onclick="bkPickStaff('+s.id+',this)"' : 'style="opacity:0.45;cursor:not-allowed"')
      + '>'
      + '<div class="bk-staff-avatar" style="background:'+(s.photoData?'transparent':S.business.color)+';overflow:hidden">'+logoHtml+'</div>'
      + '<div class="bk-staff-name">'+s.name+'</div>'
      + '<div class="bk-staff-role">'+s.role+'</div>'
      + scheduleInfo
      + '</div>';
  }).join('');
}
function bkPickStaff(id, el) {
  var s = S.staff.find(function(x){ return x.id === id; });
  var date = val('bk-date');
  // Prevent selecting staff who is not available on the chosen date
  if (s && date && !isStaffAvailableOnDate(s, date)) {
    showToast(s.name + ' is not available on this day', 'error');
    return;
  }
  bkSel.staffId = id;
  bkSel.time    = null;
  document.querySelectorAll('.bk-staff-card').forEach(e => e.classList.remove('sel'));
  if (el) el.classList.add('sel');
  bkLoadSlots();
}

// When date changes: re-render staff availability, clear invalid selections
function bkOnDateChange() {
  var date = val('bk-date');
  // If currently selected staff is not available on new date, reset selection
  if (bkSel.staffId && date) {
    var selStaff = S.staff.find(function(s){ return s.id === bkSel.staffId; });
    if (selStaff && !isStaffAvailableOnDate(selStaff, date)) {
      bkSel.staffId = null;
      bkSel.time    = null;
      showToast('Selected specialist is not available on this day. Please choose another.', 'error');
    }
  }
  bkSel.time = null; // always reset time when date changes
  bkRenderStaff();
  bkLoadSlots();
}

function bkLoadSlots(){
  var date    = val('bk-date');
  var staffId = bkSel.staffId;

  var bookedTimes  = [];
  var staffStart   = null;
  var staffEnd     = null;

  if (staffId) {
    var selStaff = S.staff.find(function(s){ return s.id === staffId; });
    if (selStaff) {
      // Get booked times for this staff on this date
      bookedTimes = S.appointments
        .filter(function(a){
          return a.date === date && a.status !== 'cancelled' && a.staff === selStaff.name;
        })
        .map(function(a){ return a.time; });

      // Get staff working hours for the SPECIFIC selected date
      var staffTimes = getStaffTimesForDate(selStaff, date);
      staffStart = staffTimes.start;
      staffEnd   = staffTimes.end;
    }
  }

  // Helper: compare time strings "09:00" < "17:00"
  function timeInRange(t, start, end) {
    if (!start || !end) return true;
    return t >= start && t <= end;
  }

  var html = '';
  TIME_SLOTS.forEach(function(t){
    var inRange  = timeInRange(t, staffStart, staffEnd);
    var busy     = bookedTimes.indexOf(t) > -1;
    var notAvail = !inRange; // outside staff working hours
    var sel      = bkSel.time === t;

    var cls = 'bk-slot';
    if      (busy || notAvail) cls += ' busy';
    else if (sel)              cls += ' sel';

    var label = t;
    if (notAvail) label = t + ' ✗';

    var oc = (busy || notAvail) ? '' : (' onclick="bkPickTime(\x27'+t+'\x27,this)"');
    html += '<div class="'+cls+'"'+oc+' title="'+(notAvail?'Outside working hours':busy?'Already booked':'Available')+'">'+label+'</div>';
  });
  document.getElementById('bk-slots').innerHTML = html;
}
function bkPickTime(t,el){bkSel.time=t;document.querySelectorAll('.bk-slot').forEach(e=>e.classList.remove('sel'));if(el)el.classList.add('sel');}

function bkGoStep2(){
  if(!bkSel.time){showToast('Please select a time slot','error');return;}
  if(!bkSel.serviceId&&S.services.length)bkSel.serviceId=S.services[0].id;
  if(!bkSel.staffId&&S.staff.length)bkSel.staffId=S.staff[0].id;
  // Final check: confirm selected staff is available on selected date
  var stfCheck = S.staff.find(function(x){ return x.id === bkSel.staffId; });
  var dateCheck = val('bk-date');
  if (stfCheck && dateCheck && !isStaffAvailableOnDate(stfCheck, dateCheck)) {
    showToast(stfCheck.name + ' is not available on this day. Please select another specialist.', 'error');
    bkSel.staffId = null;
    bkSel.time = null;
    bkRenderStaff();
    return;
  }
  const svc=S.services.find(s=>s.id===bkSel.serviceId);
  const stf=S.staff.find(s=>s.id===bkSel.staffId);
  const br=S.branches.find(b=>b.id===bkSel.branchId)||S.branches[0];
  document.getElementById('bk-summary').innerHTML=`
    <div class="confirm-row"><span class="confirm-label">Service</span><span class="confirm-val">${svc?.name||'—'}</span></div>
    <div class="confirm-row"><span class="confirm-label">${N().staffS}</span><span class="confirm-val">${stf?.name||'—'}</span></div>
    <div class="confirm-row"><span class="confirm-label">Branch</span><span class="confirm-val">${br?.name||'Main'}</span></div>
    <div class="confirm-row"><span class="confirm-label">Date</span><span class="confirm-val">${val('bk-date')}</span></div>
    <div class="confirm-row"><span class="confirm-label">Time</span><span class="confirm-val">${bkSel.time}</span></div>
    <div class="confirm-row"><span class="confirm-label">Price</span><span class="confirm-val" style="color:var(--brand);font-size:16px">${fmt(svc?.price||0)}</span></div>`;
  hide('bk-s1');show('bk-s2');
}
function bkBack(){show('bk-s1');hide('bk-s2');}

function bkConfirm(){
  const name=val('bk-cname');if(!name){showToast('Please enter your name','error');return;}
  const phone=val('bk-cphone');if(!phone){showToast('Please enter your WhatsApp number','error');return;}
  const svc=S.services.find(s=>s.id===bkSel.serviceId);
  const stf=S.staff.find(s=>s.id===bkSel.staffId);
  const br=S.branches.find(b=>b.id===bkSel.branchId)||S.branches[0];
  const date=val('bk-date');
  const appt={id:Date.now(),customer:name,phone,email:val('bk-cemail'),service:svc?.name||'Service',staff:stf?.name||'Staff',price:svc?.price||0,date,time:bkSel.time,status:'confirmed',notes:val('bk-cnotes'),branchId:br?.id||1,branchName:br?.name||'Main'};
  S.appointments.push(appt);
  let cust=S.customers.find(c=>c.name.toLowerCase()===name.toLowerCase());
  if(!cust){cust={id:Date.now()+1,name,phone,email:val('bk-cemail'),bookings:0,lastVisit:date,noShows:0};S.customers.push(cust);}
  cust.bookings++;cust.lastVisit=date;
  // Save to Firebase (works on any device — no localStorage needed)
  if(_bizId){
    fbSaveAppointment(_bizId, appt).catch(console.error);
    fbSaveCustomer(_bizId, cust).catch(console.error);
  }
  setText('bk-confirmed-h','Appointment Confirmed!');
  setText('bk-confirmed-msg',`Your ${N().appt.toLowerCase()} is confirmed! We will send a WhatsApp confirmation to ${phone}.`);
  document.getElementById('bk-final-summary').innerHTML=document.getElementById('bk-summary').innerHTML+`<div class="confirm-row"><span class="confirm-label">Name</span><span class="confirm-val">${name}</span></div>`;
  hide('bk-s2');show('bk-s3');
  bkSel={serviceId:null,staffId:null,branchId:bkSel.branchId,time:null};
}

function bkReset(){initBookingPortal();}

// ================================================================
// AI ASSISTANT
// ================================================================
function toggleAI(){document.getElementById('ai-window').classList.toggle('open');}

async function sendAI(){
  const input=document.getElementById('ai-input');
  const msg=input.value.trim();if(!msg)return;
  input.value='';
  const msgs=document.getElementById('ai-msgs');
  msgs.innerHTML+=`<div class="ai-msg user">${msg}</div>`;
  msgs.innerHTML+=`<div class="ai-msg bot" id="ai-typing"><div class="dots"><span></span><span></span><span></span></div></div>`;
  msgs.scrollTop=msgs.scrollHeight;
  const b=S.business,n=N();
  const rev=S.appointments.filter(a=>a.status==='confirmed').reduce((s,a)=>s+a.price,0);
  const ctx=`You are an AI assistant for ${b.name}, a ${b.type} (${n.ai}). Data: ${S.staff.length} ${n.staff.toLowerCase()}, ${S.services.length} services, ${S.appointments.length} bookings, ${S.customers.length} customers, ${S.branches.length} branches. Revenue: ${fmt(rev)}. Be concise, max 3 sentences.`;
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,system:ctx,messages:[{role:'user',content:msg}]})});
    const d=await r.json();
    const reply=d.content?.[0]?.text||'Ask me about bookings, revenue, or staff!';
    document.getElementById('ai-typing').outerHTML=`<div class="ai-msg bot">${reply}</div>`;
  }catch(e){
    document.getElementById('ai-typing').outerHTML=`<div class="ai-msg bot">I can help with your ${b.type} — ask about bookings, revenue, or staff performance!</div>`;
  }
  msgs.scrollTop=msgs.scrollHeight;
}

async function genInsights(){
  document.getElementById('ai-insights').innerHTML=`<div style="padding:14px;color:var(--text2)"><div class="dots"><span></span><span></span><span></span></div> Generating insights…</div>`;
  const b=S.business,n=N();
  const conf=S.appointments.filter(a=>a.status==='confirmed');
  const rev=conf.reduce((s,a)=>s+a.price,0);
  const noShow=S.appointments.filter(a=>a.status==='no-show').length;
  const p=`Give 3 business insights for ${b.name} (${b.type}). Data: ${S.appointments.length} bookings, ${fmt(rev)} revenue, ${noShow} no-shows, ${S.customers.length} customers, ${S.branches.length} branches, top service: ${S.services[0]?.name||'N/A'}. Max 20 words each. Use bullet points.`;
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:400,messages:[{role:'user',content:p}]})});
    const d=await r.json();
    document.getElementById('ai-insights').innerHTML=`<div style="font-size:14px;line-height:1.9">${(d.content?.[0]?.text||'').replace(/\n/g,'<br>')}</div>`;
  }catch(e){
    document.getElementById('ai-insights').innerHTML=`<div style="font-size:14px;line-height:1.9">• Reduce no-shows: ${noShow} detected — send WhatsApp reminders 24h before.<br>• Promote top service: ${S.services[0]?.name||'your most popular service'} drives the most revenue.<br>• Grow repeat customers: ${S.customers.length} customers registered — offer loyalty discounts.</div>`;
  }
}

async function genAnalyticsReport(){
  document.getElementById('analytics-report').innerHTML=`<div style="padding:14px;color:var(--text2)"><div class="dots"><span></span><span></span><span></span></div> Generating report…</div>`;
  const b=S.business;
  const conf=S.appointments.filter(a=>a.status==='confirmed');
  const rev=conf.reduce((s,a)=>s+a.price,0);
  const rate=S.appointments.length?Math.round(conf.length/S.appointments.length*100):0;
  const p=`Write a 3-4 sentence analytics report for ${b.name} (${b.type}). Stats: ${S.appointments.length} bookings, ${fmt(rev)} revenue, ${rate}% completion, ${S.appointments.filter(a=>a.status==='no-show').length} no-shows, ${S.branches.length} branches. Include 1 actionable recommendation.`;
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:500,messages:[{role:'user',content:p}]})});
    const d=await r.json();
    document.getElementById('analytics-report').innerHTML=`<div style="font-size:14px;line-height:1.8;background:var(--bg3);padding:16px;border-radius:8px;border-left:3px solid var(--brand)">${(d.content?.[0]?.text||'').replace(/\n/g,'<br>')}</div>`;
  }catch(e){
    document.getElementById('analytics-report').innerHTML=`<div style="font-size:14px;line-height:1.8;background:var(--bg3);padding:16px;border-radius:8px;border-left:3px solid var(--brand)">${b.name} has recorded ${S.appointments.length} total bookings with revenue of ${fmt(rev)}. <strong>Recommendation:</strong> Send automated WhatsApp reminders 24 hours before each appointment to reduce no-shows.</div>`;
  }
}

// ── TOAST ────────────────────────────────────────────────────
function showToast(msg,type=''){
  const t=document.getElementById('toast');
  t.textContent=msg;t.className=`toast ${type} show`;
  setTimeout(()=>t.classList.remove('show'),3000);
}
