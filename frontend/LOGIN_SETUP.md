# Metana Login Page - Installation & Setup Guide

## 📦 Required Packages

Run this command in your `frontend` directory to install all required packages:

```bash
npm install firebase lucide-react
```

### Package Breakdown:
- **firebase**: Firebase SDK for authentication
- **lucide-react**: Icon library (already may be installed)

---

## 🔥 Firebase Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create a new project** (or use an existing one)
3. **Enable Authentication**:
   - Go to **Authentication** → **Sign-in method**
   - Enable **Google** provider
   - Enable **Email/Password** provider (optional)
4. **Get your Firebase config**:
   - Go to **Project Settings** → **General** → **Your apps**
   - Click **Web app** icon → Register app
   - Copy the `firebaseConfig` object
5. **Update `src/firebase.js`**:
   - Replace the placeholder values with your actual Firebase credentials

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🎯 Configure Instructor Access

Edit `src/components/Login.jsx` and add instructor emails to the `INSTRUCTORS` array:

```javascript
const INSTRUCTORS = [
  'thinal@metana.io',
  'your.email@gmail.com',
  'instructor2@metana.io',
  // Add more emails here
];
```

**How it works:**
- Users with emails in this list → Redirected to `/grading-assistant`
- All other users → Redirected to `/dashboard`

---

## 🚀 Usage

### Access the Login Page
Navigate to: `http://localhost:5173/login`

### Test Authentication
1. **Google Login**: Click "Sign in with Google" button
2. **Email/Password**: Enter credentials (if you've set up users in Firebase)

### After Login
- **Instructors** → Grading Assistant Dashboard
- **Students** → Regular Dashboard

---

## 📁 Files Created

1. **`src/firebase.js`** - Firebase configuration and initialization
2. **`src/components/Login.jsx`** - Login page component with split-screen design
3. **Updated `src/App.jsx`** - Added `/login` and `/grading-assistant` routes

---

## 🎨 Customization

### Change Brand Colors
In `Login.jsx`, modify the gradient classes:
```jsx
// Current: Yellow to Green
className="bg-gradient-to-br from-gray-50 via-yellow-50 to-green-50"

// Or use solid colors
className="bg-yellow-50"
```

### Update Testimonial
Edit the testimonial section in `Login.jsx`:
```jsx
<div className="text-4xl font-bold text-gray-800 leading-tight">
  "Your custom quote here..."
</div>
```

### Change Logo
Replace `src/assets/images.png` with your actual logo file.

---

## 🔒 Security Notes

1. **Never commit Firebase keys to Git**:
   - Add `.env` file with keys
   - Add `.env` to `.gitignore`
   
2. **Environment Variables** (Optional):
   Create `.env` file:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   ...
   ```
   
   Then update `firebase.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     // ...
   };
   ```

---

## 🐛 Troubleshooting

**Issue**: "Firebase: Error (auth/configuration-not-found)"
- **Fix**: Make sure you've replaced the placeholder values in `firebase.js` with your actual Firebase credentials.

**Issue**: Google login not working
- **Fix**: Ensure Google provider is enabled in Firebase Console → Authentication → Sign-in method

**Issue**: Not redirecting after login
- **Fix**: Check browser console for errors. Ensure `/dashboard` and `/grading-assistant` routes exist in your app.

---

## ✅ Complete Installation Checklist

- [ ] Run `npm install firebase lucide-react`
- [ ] Create Firebase project
- [ ] Enable Google authentication in Firebase
- [ ] Copy Firebase config to `src/firebase.js`
- [ ] Add instructor emails to `INSTRUCTORS` array
- [ ] Test login at `/login`
- [ ] Verify redirects work correctly

---

**Ready to test!** Navigate to `http://localhost:5173/login` and sign in with Google.
