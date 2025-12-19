# University Recruitment System - Setup & Usage Guide

## 🎯 Project Overview

This is a complete, clickable recruitment system prototype built with:
- **Vue 2** - Progressive JavaScript framework
- **Nuxt 2** - Universal Vue.js framework (static target, universal mode)
- **Vuetify 2** - Material Design component framework

## 📋 Features Implemented

### ✅ Complete Page Structure
1. **Landing Page** (`/`) - Marketing-style intro with CTAs
2. **Authentication**
   - Register (`/auth/register`) - Account creation with validation
   - Login (`/auth/login`) - User authentication
3. **Dashboard** (`/dashboard`) - Application status tracking
4. **Programmes Catalogue** (`/programmes`) - Browse and filter programmes
5. **Programme Details** (`/programmes/:id`) - Detailed programme information
6. **Applications List** (`/applications`) - View all applications
7. **Application Wizard**
   - Personal Data (`/applications/current/personal-data`) - 3-step stepper form
   - Education (`/applications/current/education`) - 3-step education wizard
   - Summary (`/applications/current/summary`) - Review and submit
8. **FAQ** (`/faq`) - Expandable questions
9. **Messages** (`/messages`) - Inbox with compose functionality

### ✅ Vuetify Components Used
- `v-app-bar` - Top navigation
- `v-navigation-drawer` - Side menu
- `v-list` - Navigation items and data lists
- `v-stepper` - Multi-step forms
- `v-text-field`, `v-select`, `v-autocomplete` - Form inputs
- `v-checkbox`, `v-radio-group` - Selection controls
- `v-data-table` - Applications and messages tables
- `v-alert` - Information messages
- `v-snackbar` - Global notifications
- `v-dialog` - Modal windows
- `v-chip` - Status indicators
- `v-badge` - Unread message count
- `v-skeleton-loader`, `v-progress-linear` - Loading states
- `v-file-input` - Photo upload
- `v-expansion-panels` - FAQ accordions

### ✅ Key Features
- **Mock Authentication** - In-memory user state
- **Form Validation** - Real-time validation with rules
- **Auto-fill Functionality** - PESEL and postal code prefill
- **Dynamic Forms** - Add/remove exam subjects
- **Responsive Design** - Mobile and desktop layouts
- **Loading States** - Simulated async operations
- **Navigation Guards** - Protected routes with middleware
- **State Management** - Vuex store for application data

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn

### Step 1: Install Dependencies
```bash
cd c:\_Lavoro\rejestracja
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Step 3: Build for Production (Optional)
```bash
# Build the application
npm run build

# Start production server
npm run start

# OR generate static files
npm run generate
```

## 🎮 How to Use the Application

### Complete Application Flow

1. **Start at Landing Page** (`/`)
   - Click "Start Application" button

2. **Register Account** (`/auth/register`)
   - Enter email (e.g., `test@example.com`)
   - Enter password (min 6 characters)
   - Confirm password
   - Accept terms and conditions
   - Answer captcha: Type `7` (3 + 4)
   - Submit → Redirects to programmes

3. **Browse Programmes** (`/programmes`)
   - Use filters (level, mode, status, language)
   - Search by name
   - Click on a programme to view details

4. **View Programme Details** (`/programmes/:id`)
   - Review programme information
   - Click "Apply Now" button

5. **Fill Personal Data** (`/applications/current/personal-data`)
   - **Step 1: Basic Info**
     - Enter PESEL (e.g., `12345678901`)
     - Click "Prefill from PESEL" to auto-fill name, DOB, gender
     - Or fill manually
     - Click "Next"
   
   - **Step 2: Address**
     - Enter postal code (try `87-100`, `00-001`, `30-001`, etc.)
     - Address fields auto-fill
     - Complete street, house number
     - Choose if correspondence address is same
     - Click "Next"
   
   - **Step 3: Photo**
     - Upload photo (any image file)
     - Preview appears
     - Click "Save & Continue to Education"

6. **Fill Education Data** (`/applications/current/education`)
   - **Step 1: Secondary School**
     - Select school from dropdown
     - Location auto-fills
     - Select graduation year
     - Enter document number
     - Click "Next"
   
   - **Step 2: Diploma Type**
     - Select diploma type (default: Polish New Matura)
     - Click "Next"
   
   - **Step 3: Subjects & Scores**
     - Select subject (Mathematics, Physics, etc.)
     - Choose exam type (Written Basic/Extended, Oral)
     - Enter score (0-100%)
     - Click "Add Another Subject" to add more
     - Click "Save & Go to Summary"

7. **Review & Submit** (`/applications/current/summary`)
   - Review all entered data
   - Click pencil icons to edit any section
   - Check confirmation checkbox
   - Click "Submit Application"
   - Success dialog appears
   - Choose "Back to Dashboard" or "View Application Details"

8. **View Dashboard** (`/dashboard`)
   - See application status
   - Track progress
   - Access quick actions

### Alternative Flows

**Login Instead of Register:**
- Click "Log In" from landing page
- Enter any email and password
- Redirects to dashboard

**View All Applications:**
- Navigate to "My Registrations" in sidebar
- View list of all applications
- Click "Continue" on draft applications
- View details of submitted applications

**Use Messages:**
- Click messages icon in top bar
- View inbox
- Click "New Message" to compose
- Select recipient and send

**Browse FAQ:**
- Navigate to "FAQ" in sidebar
- Search questions
- Click to expand answers
- Send message if not answered

## 🔑 Test Data

### Postal Codes (for auto-fill)
- `87-100` → Toruń, kujawsko-pomorskie
- `00-001` → Warszawa, mazowieckie
- `30-001` → Kraków, małopolskie
- `80-001` → Gdańsk, pomorskie
- `60-001` → Poznań, wielkopolskie

### PESEL (for auto-fill)
- Any 11-digit number (e.g., `12345678901`)
- Auto-fills: Jan Kowalski, 1995-05-15, Male

### Schools (in autocomplete)
- I Liceum Ogólnokształcące im. Mikołaja Kopernika w Toruniu
- XIV Liceum Ogólnokształcące im. Stanisława Staszica w Warszawie
- II Liceum Ogólnokształcące im. Marii Konopnickiej w Krakowie
- And more...

### Subjects
- Mathematics
- Polish Language
- English Language
- Physics
- Chemistry
- Biology
- Computer Science
- And more...

## 📁 Project Structure

```
c:\_Lavoro\rejestracja/
├── assets/
│   └── variables.scss          # Vuetify customization
├── data/
│   └── mockData.js             # All mock data (programmes, schools, etc.)
├── layouts/
│   └── default.vue             # Main layout with app bar & drawer
├── middleware/
│   └── auth.js                 # Authentication guard
├── pages/
│   ├── index.vue               # Landing page
│   ├── dashboard.vue           # User dashboard
│   ├── faq.vue                 # FAQ page
│   ├── messages.vue            # Messages inbox
│   ├── auth/
│   │   ├── login.vue           # Login page
│   │   └── register.vue        # Registration page
│   ├── programmes/
│   │   ├── index.vue           # Programmes catalogue
│   │   └── _id.vue             # Programme details
│   └── applications/
│       ├── index.vue           # Applications list
│       └── current/
│           ├── personal-data.vue   # Personal data wizard
│           ├── education.vue       # Education wizard
│           └── summary.vue         # Application summary
├── static/
│   └── favicon.ico             # Favicon placeholder
├── store/
│   └── index.js                # Vuex store
├── .gitignore
├── nuxt.config.js              # Nuxt configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🎨 Design Principles Applied

1. **User-Friendly Forms**
   - Never more than 6-7 fields without grouping
   - Inline validation messages
   - Clear primary actions on each screen

2. **Helpful Auto-fills**
   - PESEL prefills personal data
   - Postal code prefills address
   - School selection prefills location
   - Diploma type auto-selected for Polish students

3. **Progress Indicators**
   - Progress bars on wizard pages
   - Step completion status
   - Visual feedback for all actions

4. **Responsive Layout**
   - Desktop: Persistent side navigation
   - Mobile: Collapsible drawer
   - Adaptive card layouts

5. **Loading States**
   - Skeleton loaders for content
   - Progress indicators for actions
   - Smooth transitions

## 🔧 Customization

### Change Theme Colors
Edit `nuxt.config.js`:
```javascript
vuetify: {
  theme: {
    light: true,
    themes: {
      light: {
        primary: '#1976D2',    // Change to your color
        secondary: '#424242',
        // ... other colors
      }
    }
  }
}
```

### Add More Programmes
Edit `data/mockData.js` and add items to the `programmes` array.

### Modify Form Fields
Edit the respective page component in `pages/applications/current/`.

### Add New Pages
Create new `.vue` files in `pages/` directory. Nuxt will auto-generate routes.

## 🐛 Known Limitations (Prototype)

- No real backend - all data stored in memory
- Data lost on page refresh (no persistence)
- No real file uploads (files stored as base64)
- Payment and document upload features are placeholders
- No email sending functionality
- Authentication is mock (accepts any credentials)

## 📝 Next Steps for Production

1. **Backend Integration**
   - Replace Vuex actions with API calls
   - Implement real authentication (JWT, OAuth)
   - Add file upload to server/cloud storage

2. **Data Persistence**
   - Add database (PostgreSQL, MongoDB, etc.)
   - Implement session management
   - Add caching layer

3. **Enhanced Features**
   - Real payment gateway integration
   - Email notifications (welcome, confirmation, etc.)
   - Document verification system
   - Admin panel for recruitment office

4. **Security**
   - Add CSRF protection
   - Implement rate limiting
   - Add input sanitization
   - Enable HTTPS

5. **Testing**
   - Unit tests for components
   - Integration tests for workflows
   - E2E tests for critical paths

## 🎉 Congratulations!

You now have a fully functional recruitment system prototype with:
- ✅ End-to-end clickable flow
- ✅ All required pages and components
- ✅ Realistic mock data
- ✅ Modern UI with Vuetify
- ✅ Form validation and auto-fill
- ✅ Responsive design
- ✅ Loading states and feedback

Enjoy exploring the application! 🚀
