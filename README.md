# BookFlow — Adaptive Appointment Scheduler
### One-Time Purchase · Self-Hosted · No Monthly Fees

---

## 🎯 How This Works (For Sellers)

You sell this ZIP file to any business. Each business:
1. Downloads the ZIP
2. Extracts it
3. Uploads to their own hosting (Netlify, cPanel, etc.)
4. Opens the website → Setup Wizard runs automatically
5. They configure their own business name, colors, staff, services, passwords
6. Their data saves in their own browser/hosting — completely separate from all other businesses
7. Done. They have a fully working appointment system.

**Every business that buys your ZIP gets:**
- Their own completely independent system
- Their own passwords they set themselves
- Their own data stored locally
- No connection to any other buyer
- No monthly fees forever

---

## 📦 What's Inside the ZIP

```
bookflow/
├── index.html          ← The entire app (one file)
├── css/
│   └── main.css        ← All styles
├── js/
│   └── app.js          ← All logic + localStorage
├── netlify.toml        ← Netlify auto-config
├── vercel.json         ← Vercel auto-config
├── .github/
│   └── workflows/
│       └── deploy.yml  ← GitHub Pages auto-deploy
└── README.md           ← This file
```

---

## 🚀 Deploy Instructions (Give These to Your Buyers)

### Method 1 — Netlify Drop (Easiest, Free, 30 seconds)
1. Extract the ZIP — you get a `bookflow` folder
2. Go to **https://app.netlify.com/drop**
3. Drag the `bookflow` folder onto the page
4. Your site is live instantly at a free URL like `https://xyz.netlify.app`
5. Open the URL → Setup Wizard starts automatically

### Method 2 — cPanel / Any Web Hosting
1. Extract the ZIP
2. Login to your hosting cPanel
3. Open **File Manager** → go to `public_html`
4. Upload ALL files from inside the `bookflow` folder
5. Visit your domain → Setup Wizard starts

### Method 3 — GitHub Pages (Free, Professional)
1. Create account at github.com
2. Create new repository → name it `bookflow`
3. Upload all files from the `bookflow` folder
4. Go to Settings → Pages → Branch: main → Save
5. Your URL: `https://yourusername.github.io/bookflow`

### Method 4 — Vercel (Free, Fast)
1. Go to **vercel.com** → Sign up free
2. Click "Add New" → "Project"
3. Import from GitHub or drag folder
4. Deploy — done in 60 seconds

---

## 🔐 Security — How Passwords Work

- Owner sets their own password during first-time Setup Wizard
- Staff password set separately during setup
- Passwords stored in their own browser's localStorage
- Can be changed anytime from Settings → Passwords
- No central database — each installation is completely independent
- Customers NEVER see any login or dashboard — only the booking portal

---

## 💾 Where Data is Stored

All data is stored in **localStorage** (the buyer's own browser/server):
- Business configuration
- Staff list
- Services and prices
- All appointments
- Customer records
- Branch information
- Holidays

**This means:**
- ✅ Data persists between sessions
- ✅ No external database needed
- ✅ No monthly costs
- ✅ Completely private — only accessible on their device
- ⚠️ If they clear browser data, they lose it (advise them to export regularly)

**For production use with permanent data:** Connect to Supabase (free tier) — see js/app.js comments.

---

## 🌐 Supported Business Types (Auto-adapts everything)

| Business | Staff | Customers | Services |
|----------|-------|-----------|----------|
| Salon | Stylists | Clients | Beauty Services |
| Clinic | Doctors | Patients | Consultations |
| Dental Clinic | Dentists | Patients | Dental Services |
| Gym | Trainers | Members | Training Programs |
| Tutor Center | Tutors | Students | Courses |
| Law Office | Lawyers | Clients | Legal Services |
| Spa | Therapists | Guests | Spa Treatments |
| Consultant | Consultants | Clients | Consulting Services |
| Repair Shop | Technicians | Customers | Repair Services |
| Custom | Fully customizable | | |

---

## 💰 Currency Support

Built-in: PKR, USD, GBP, EUR, AED, INR, SAR, MYR, NGN, EGP
Custom: Any symbol, before or after amount

---

## 📋 Full Feature List

**Setup & Onboarding**
- [x] First-time Setup Wizard (7 steps)
- [x] Business type selector (10 niches)
- [x] Auto-adapts all labels/terminology by niche
- [x] Brand color picker + custom color
- [x] Business icon/emoji selector
- [x] Password setup during onboarding

**Dashboard (Owner/Staff)**
- [x] Role-based login (Owner vs Staff)
- [x] Owner sees everything including Settings
- [x] Staff sees bookings, calendar, customers (not settings)
- [x] Live stats: revenue, bookings, customers, no-shows
- [x] Today's appointments at a glance
- [x] Mini calendar with booking indicators
- [x] AI-powered business insights

**Appointments**
- [x] Full bookings table with search + filter
- [x] Filter by status, branch
- [x] Confirm / No-show / Delete actions
- [x] Calendar view with day-click drill-down
- [x] New booking form (admin side)

**People Management**
- [x] Staff cards with activate/deactivate
- [x] Staff assigned to specific branches
- [x] Customer list with booking history
- [x] No-show tracking per customer

**Services**
- [x] Service list with price and duration
- [x] Toggle active/inactive per service
- [x] Category tagging

**Branches**
- [x] Multi-branch support
- [x] Branch manager details
- [x] Per-branch staff assignment
- [x] Branch shown on bookings and calendar

**Settings (Owner Only)**
- [x] Business info editor
- [x] Brand color and emoji
- [x] Currency symbol + position
- [x] Working days toggle per day
- [x] Slot duration (15/30/60/90/120 min)
- [x] Buffer time between bookings
- [x] Friday closed toggle
- [x] Ramadan timing toggle
- [x] Booking rules (same-day, auto-confirm, cancellations)
- [x] Custom labels (rename any term)
- [x] Holidays & blocked dates
- [x] Notification toggles (WhatsApp, Email, Reminders)
- [x] Change owner/staff passwords
- [x] Authorised staff accounts with branch access

**Customer Booking Portal**
- [x] Beautiful public booking page
- [x] Service selection with price shown
- [x] Branch selector (if multiple branches)
- [x] Staff/specialist selection
- [x] Date picker
- [x] Available time slots (booked times hidden)
- [x] Customer details form
- [x] Booking confirmation screen
- [x] ZERO admin links visible to customers
- [x] No login button shown to customers

**AI Features**
- [x] AI business insights on dashboard
- [x] AI analytics report generator
- [x] AI chat assistant (owner/staff only)

---

## 🛠️ Tech Stack

- Pure HTML + CSS + Vanilla JavaScript
- Zero dependencies (no npm, no build step)
- localStorage for data persistence
- Google Fonts (loaded from CDN)
- Anthropic Claude API for AI features
- Works on any static hosting

---

## 📞 Customization for Clients

To customize before selling/delivering:
1. Open `js/app.js`
2. Change `NICHES` object to add custom terminology
3. Change `DEFAULT_SERVICES` to add preset services for their industry
4. Change `BRAND_COLORS` to include their preferred colors
5. That's it — no build step needed

---

## ⚡ Quick Checklist for Buyers

- [ ] Extract ZIP
- [ ] Upload to Netlify / cPanel / GitHub Pages
- [ ] Visit the URL
- [ ] Complete 7-step Setup Wizard
- [ ] Set strong owner password
- [ ] Add your staff
- [ ] Add your services with prices
- [ ] Set working hours
- [ ] Share your URL with customers
- [ ] Customers open the same URL → Book appointments
- [ ] You login as Owner → See all bookings

---

*BookFlow — Built for businesses that want to own their tools, not rent them.*
