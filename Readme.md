# GigMap — Youth Empowerment through Local Micro Gigs

GigMap is a community-driven platform that connects young people to short-term, local, and skill-building gigs.  
It empowers youth by creating easy access to small jobs while helping communities find affordable, trusted help.

---

## Project Overview

Many young people possess useful skills but have limited access to formal employment or digital platforms.  
GigMap bridges this gap by providing a simple, accessible web app where users can:

- Discover nearby or online gigs
- Post small jobs or errands
- Build work experience and confidence
- Connect with peers and grow their network

Built during the **Hackathon 2025 (2-hour vibe coding challenge)** using:

- Frontend: React (Vite)
- Backend: Firebase (Authentication, Firestore, Hosting)

---

## Key Features

- Firebase Authentication for secure user sign-up and login  
- Firestore Database for real-time gig posting and updates  
- Gig Posting and Discovery for youth and small businesses  
- Localized job matching by category or location  
- Peer Feedback System for ratings and credibility  
- Responsive React interface suitable for mobile and desktop  
- Deployed using Firebase Hosting for quick and reliable access

---

## Firestore Data Structure

### Collections

#### `users`
```javascript
{
  name: string,
  email: string,
  role: "seeker" | "poster",
  skills: string[],
  joinedAt: string (ISO date)
}
```

#### `gigs`
```javascript
{
  title: string,
  description: string,
  category: string,
  subcategory: string (optional),
  pay: number,
  location: string,
  postedBy: string (userId),
  claimedBy: string | null (userId),
  status: "open" | "claimed" | "completed",
  createdAt: string (ISO date)
}
```

#### `feedback`
```javascript
{
  gigId: string,
  fromUser: string (userId),
  toUser: string (userId),
  rating: number (1-5),
  comment: string (optional),
  createdAt: string (ISO date)
}
```

#### `categories`
Categories are loaded from `src/assets/categories.json` and include:
- name: string
- icon: string (emoji)
- subcategories: string[]

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Copy your Firebase configuration
5. Update `src/firebase/config.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

---

## Project Structure

```
src/
├── assets/
│   └── categories.json          # Category definitions
├── components/
│   ├── Navbar.jsx               # Navigation component
│   ├── ProtectedRoute.jsx       # Route protection wrapper
│   └── FeedbackModal.jsx        # Feedback submission modal
├── context/
│   └── AuthContext.jsx          # Authentication context
├── firebase/
│   ├── config.js                # Firebase configuration
│   ├── auth.js                  # Authentication functions
│   ├── gigs.js                  # Gig CRUD operations
│   ├── feedback.js              # Feedback operations
│   └── users.js                 # User data operations
├── pages/
│   ├── LandingPage.jsx          # Home page (/)
│   ├── AuthPage.jsx             # Authentication page (/auth)
│   ├── DashboardPage.jsx        # Main dashboard (/dashboard)
│   ├── GigDetailsPage.jsx       # Gig detail view (/gig/:id)
│   ├── PostGigPage.jsx          # Create gig form (/post)
│   └── ProfilePage.jsx           # User profile (/profile)
├── App.jsx                       # Main app with routing
└── main.jsx                      # Entry point

---

## Features Overview

### Authentication
- Email/Password sign up and login
- Google Sign-In (optional)
- Role selection on first signup (Seeker or Poster)
- Protected routes requiring authentication

### Dashboard
- Real-time gig listing with Firestore listeners
- Category filtering
- Separate tabs for available gigs and user's gigs
- Different views based on user role

### Gig Management
- Create new gigs with category/subcategory selection
- View gig details
- Claim gigs (for seekers)
- Mark gigs as complete (for posters)
- Real-time updates across all users

### Profile & Feedback
- View and edit user profile
- Display user's posted and claimed gigs summary
- View feedback and ratings
- Submit feedback after completing gigs

---

## Technologies Used

- **React 19** - UI library
- **React Router v6** - Client-side routing
- **Firebase v9** - Backend services (Auth, Firestore)
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool and dev server

---

## Next Steps

1. Set up Firebase project and configure credentials
2. Test authentication flow
3. Create test gigs and verify CRUD operations
4. Test feedback system
5. Deploy to Firebase Hosting

---

## Notes

- All pages are responsive and work on mobile and desktop
- Real-time updates use Firestore listeners
- User roles determine available actions but all users can post and claim gigs
- Feedback can only be submitted after a gig is marked as complete

