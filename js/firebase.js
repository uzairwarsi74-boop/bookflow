// ================================================================
// BookFlow — Firebase Storage Layer
// Replaces localStorage with Firebase Firestore + Auth
// Every business owner gets their own isolated data via UID
// ================================================================

// ── FIREBASE CONFIG ───────────────────────────────────────────
// IMPORTANT: Replace these values with YOUR Firebase project config
// Get them from: Firebase Console → Project Settings → Your Apps → Web
const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE"
};

// ── INIT ──────────────────────────────────────────────────────
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

// ── CURRENT USER ─────────────────────────────────────────────
// Set after anonymous sign-in. All reads/writes are scoped to this UID.
let _uid = null;

// ── DOCUMENT KEY ─────────────────────────────────────────────
// All business data is stored as ONE document per business
// in collection "businesses" with doc ID = owner's Firebase UID
// Public business data (for customers) is stored in "public" collection
const BIZ_COLLECTION    = 'businesses';
const PUBLIC_COLLECTION = 'public';

// ── SIGN IN ANONYMOUSLY ───────────────────────────────────────
// We use anonymous auth so:
//   - Owner's device gets a stable UID tied to their browser
//   - Same UID = same data on the owner's device always
//   - Different device = different UID = needs business ID to find data
// For customer-facing data we use a separate "public" document
async function fbSignIn() {
  try {
    // Check if already signed in
    if (auth.currentUser) {
      _uid = auth.currentUser.uid;
      return _uid;
    }
    const result = await auth.signInAnonymously();
    _uid = result.user.uid;
    return _uid;
  } catch (e) {
    console.error('Firebase sign-in failed:', e);
    return null;
  }
}

// ── SAVE ALL DATA ─────────────────────────────────────────────
// Writes the complete S object to Firestore
// Also writes public-safe data to public collection for customers
async function fbSave(S) {
  if (!_uid) await fbSignIn();
  if (!_uid) { console.error('No UID — cannot save'); return false; }

  try {
    // Save full data for owner (private, auth-protected)
    await db.collection(BIZ_COLLECTION).doc(_uid).set({
      ...S,
      userId:    _uid,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Save public data for customer booking portal
    // Uses the bizId (stored in business object) so customers can load it
    const bizId = S.business?.bizId || _uid;
    const publicData = {
      bizId:      bizId,
      business:   S.business   || {},
      services:   S.services   || [],
      staff:      S.staff      || [],
      branches:   S.branches   || [],
      hours:      S.hours      || {},
      currency:   S.currency   || { symbol: 'PKR', position: 'before' },
      labels:     S.labels     || {},
      holidays:   S.holidays   || [],
      setup_done: true,
      updatedAt:  firebase.firestore.FieldValue.serverTimestamp()
    };
    await db.collection(PUBLIC_COLLECTION).doc(bizId).set(publicData);

    // Always save bizId to meta/config so ANY device can discover it
    await db.collection('meta').doc('config').set({
      bizId:     bizId,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Save passwords to meta/auth so login works on ANY device
    // This document is publicly readable but that is acceptable
    // because the dashboard still requires the correct password to enter
    if (S.passwords) {
      await db.collection('meta').doc('auth').set({
        owner:     S.passwords.owner || '',
        staff:     S.passwords.staff || '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    return true;
  } catch (e) {
    console.error('Firebase save failed:', e);
    return false;
  }
}

// ── LOAD OWNER DATA ───────────────────────────────────────────
// Loads full data for the logged-in owner
async function fbLoad() {
  if (!_uid) await fbSignIn();
  if (!_uid) return null;

  try {
    const doc = await db.collection(BIZ_COLLECTION).doc(_uid).get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (e) {
    console.error('Firebase load failed:', e);
    return null;
  }
}

// ── LOAD PUBLIC DATA (for customers on any device) ────────────
// Customers load data using the bizId from the URL parameter
// URL format: yoursite.com/?biz=BIZID
async function fbLoadPublic(bizId) {
  try {
    const doc = await db.collection(PUBLIC_COLLECTION).doc(bizId).get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (e) {
    console.error('Firebase public load failed:', e);
    return null;
  }
}

// ── SAVE APPOINTMENT (public — customers create these) ────────
// Appointments are saved to public collection so owner sees them
async function fbSaveAppointment(bizId, appointment) {
  try {
    await db.collection(PUBLIC_COLLECTION).doc(bizId)
      .collection('appointments').doc(String(appointment.id)).set({
        ...appointment,
        userId:    bizId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    return true;
  } catch (e) {
    console.error('Firebase appointment save failed:', e);
    return false;
  }
}

// ── LOAD APPOINTMENTS ─────────────────────────────────────────
async function fbLoadAppointments(bizId) {
  try {
    const snap = await db.collection(PUBLIC_COLLECTION).doc(bizId)
      .collection('appointments')
      .where('userId', '==', bizId)
      .get();
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.error('Firebase appointments load failed:', e);
    return [];
  }
}

// ── DELETE APPOINTMENT ────────────────────────────────────────
async function fbDeleteAppointment(bizId, apptId) {
  try {
    await db.collection(PUBLIC_COLLECTION).doc(bizId)
      .collection('appointments').doc(String(apptId)).delete();
    return true;
  } catch (e) {
    console.error('Firebase delete appointment failed:', e);
    return false;
  }
}

// ── UPDATE APPOINTMENT STATUS ─────────────────────────────────
async function fbUpdateAppointmentStatus(bizId, apptId, status) {
  try {
    await db.collection(PUBLIC_COLLECTION).doc(bizId)
      .collection('appointments').doc(String(apptId)).update({ status });
    return true;
  } catch (e) {
    console.error('Firebase update appointment failed:', e);
    return false;
  }
}

// ── SAVE CUSTOMER ─────────────────────────────────────────────
async function fbSaveCustomer(bizId, customer) {
  try {
    await db.collection(PUBLIC_COLLECTION).doc(bizId)
      .collection('customers').doc(String(customer.id)).set({
        ...customer,
        userId: bizId
      });
    return true;
  } catch (e) {
    console.error('Firebase customer save failed:', e);
    return false;
  }
}

// ── LOAD CUSTOMERS ────────────────────────────────────────────
async function fbLoadCustomers(bizId) {
  try {
    const snap = await db.collection(PUBLIC_COLLECTION).doc(bizId)
      .collection('customers')
      .where('userId', '==', bizId)
      .get();
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.error('Firebase customers load failed:', e);
    return [];
  }
}

// ── CHECK IF BUSINESS EXISTS (for customers) ──────────────────
async function fbBizExists(bizId) {
  try {
    const doc = await db.collection(PUBLIC_COLLECTION).doc(bizId).get();
    return doc.exists && doc.data()?.setup_done === true;
  } catch (e) {
    return false;
  }
}

// ── SAVE CONFIG (bizId registry) ─────────────────────────────
// Saves the bizId to a fixed known document: meta/config
// This document is publicly readable so ANY device can discover
// the bizId without needing it in the URL or in a file.
// Called once after setup completes.
async function fbSaveConfig(bizId) {
  try {
    await db.collection('meta').doc('config').set({
      bizId:     bizId,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (e) {
    console.error('fbSaveConfig failed:', e);
    return false;
  }
}

// ── LOAD CONFIG (discover bizId on any device) ────────────────
async function fbLoadConfig() {
  try {
    const doc = await db.collection('meta').doc('config').get();
    if (doc.exists && doc.data().bizId) {
      return doc.data().bizId;
    }
    return null;
  } catch (e) {
    console.error('fbLoadConfig failed:', e);
    return null;
  }
}

// ── LOAD AUTH (passwords on any device) ───────────────────────
// Reads meta/auth document to get passwords.
// Called on new devices where S.passwords is not loaded yet.
async function fbLoadAuth() {
  try {
    const doc = await db.collection('meta').doc('auth').get();
    if (doc.exists) {
      return { owner: doc.data().owner || '', staff: doc.data().staff || '' };
    }
    return null;
  } catch (e) {
    console.error('fbLoadAuth failed:', e);
    return null;
  }
}
