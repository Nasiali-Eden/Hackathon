# GigMap - Youth Empowerment through Local Micro Gigs

GigMap is a platform that connects young people to short-term, local, and skill-building gigs. It empowers youth by helping them find quick jobs while giving communities affordable, trusted help.

## 🚀 Features

- **User Authentication**: Secure signup/login with Firebase Authentication
- **Browse Gigs**: Search and filter through available gig opportunities
- **Post Gigs**: Create gig listings as a provider
- **Apply to Gigs**: Apply to gigs as a seeker
- **User Profiles**: Manage your profile and track your gigs
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 🛠️ Tech Stack

- **React** + **Vite** - Fast development and building
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Authentication, Firestore database, and hosting
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Hackathon
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase configuration

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Add your Firebase configuration to `.env`:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 🔥 Firebase Setup

### Firestore Security Rules

Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Gigs collection
    match /gigs/{gigId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.providerId == request.auth.uid || 
         request.auth.token.admin == true);
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow read: if request.auth != null && 
        (resource.data.applicantId == request.auth.uid ||
         get(/databases/$(database)/documents/gigs/$(resource.data.gigId)).data.providerId == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.applicantId == request.auth.uid ||
         get(/databases/$(database)/documents/gigs/$(resource.data.gigId)).data.providerId == request.auth.uid);
    }
  }
}
```

## 🏃 Development

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── firebase/           # Firebase configuration
│   └── config.js
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── BrowseGigs.jsx
│   ├── CreateGig.jsx
│   ├── GigDetails.jsx
│   ├── MyGigs.jsx
│   └── Profile.jsx
├── utils/              # Utility functions
│   └── firestore.js
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles with Tailwind
```

## 🎨 Features Overview

### For Gig Seekers:
- Browse available gigs with filtering
- Apply to gigs
- Track applications
- Build profile and showcase skills

### For Gig Providers:
- Post new gig opportunities
- Manage posted gigs
- Review applications
- Connect with youth in the community

## 🚢 Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Hosting:
```bash
firebase init hosting
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

## 📝 License

MIT License - feel free to use this project for your hackathon!

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

---

Made with ❤️ for youth empowerment

