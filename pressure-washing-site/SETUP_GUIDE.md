# CountyWide Pressure Washing - Setup Guide

## Project Overview

This is a professional pressure washing website built with React + Vite, Firebase, and Vercel. It features an admin panel for content management, contact form submissions, and a modern responsive design.

## Quick Start

### 1. Local Development

```bash
cd pressure-washing-site
npm install
npm run dev
```

The site will be available at `http://localhost:5173`

### 2. Admin Access

- Email: `bennettfcountywide@gmail.com`
- Password: `Fantgolf2$`

Login at `http://localhost:5173/login` to access:
- Admin Dashboard (`/admin`) - View contact form submissions
- Edit Mode - Click "Edit" button on homepage to edit content inline
- Publish Changes - Click "Publish Changes" after editing to deploy to GitHub

## Firebase Configuration

### Already Configured:
- **Project ID**: countywideservices-fa3af
- **Authentication**: Email/Password enabled
- **Firestore Database**: Created with security rules
- **Admin Email**: bennettfcountywide@gmail.com

### Firestore Security Rules (Already Applied):

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Contacts collection - allow public writes (for contact form)
    // Only authenticated users can read (admins)
    match /contacts/{contactId} {
      allow read: if request.auth != null;
      allow create: if true;  // Anyone can submit contact form
      allow update, delete: if request.auth != null;
    }

    // Images collection - allow public reads (for website display)
    // Only authenticated users can write (admins)
    match /images/{imageId} {
      allow read: if true;  // Anyone can view images
      allow write: if request.auth != null;  // Only admins can manage images
    }

    // Site content collection - allow public reads (for website display)
    // Only authenticated users can write (admins)
    match /siteContent/{docId} {
      allow read: if true;  // Anyone can view site content
      allow write: if request.auth != null;  // Only admins can edit content
    }
  }
}
```

## GitHub Integration

### Repository:
- **Owner**: bennettfcountywide-cmd
- **Repo**: PressureWashingWebsite
- **Token**: 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

### How Content Publishing Works:
1. Admin edits content in Edit Mode on homepage
2. Changes are saved locally in browser
3. Admin clicks "Publish Changes" button
4. Content is committed to GitHub via Octokit API
5. Vercel automatically deploys the update
6. Site updates in ~30 seconds

## Vercel Deployment

### Step 1: Import Repository

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import `bennettfcountywide-cmd/PressureWashingWebsite`
4. Select the `pressure-washing-site` folder as the root directory

### Step 2: Configure Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Environment Variables

Add these environment variables in Vercel dashboard:

```
VITE_FIREBASE_API_KEY=AIzaSyBflvlFORSC_J6cFrFvSPYLb0FyY5F_SjU
VITE_FIREBASE_AUTH_DOMAIN=countywideservices-fa3af.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=countywideservices-fa3af
VITE_FIREBASE_STORAGE_BUCKET=countywideservices-fa3af.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=101494553650
VITE_FIREBASE_APP_ID=1:101494553650:web:783e8fb45539c09363902b
VITE_ADMIN_EMAIL=bennettfcountywide@gmail.com
VITE_IMGBB_API_KEY=(get from imgbb.com)
VITE_GITHUB_TOKEN=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
VITE_GITHUB_OWNER=bennettfcountywide-cmd
VITE_GITHUB_REPO=PressureWashingWebsite
```

### Step 4: Deploy

Click "Deploy" and Vercel will build and deploy your site!

## Optional: ImgBB API Key

To enable image uploads (for gallery and background images):

1. Go to https://imgbb.com/
2. Sign up for a free account
3. Get your API key from https://api.imgbb.com/
4. Add it to your `.env` file: `VITE_IMGBB_API_KEY=your_key_here`
5. Add it to Vercel environment variables

## Project Structure

```
pressure-washing-site/
├── public/
│   ├── content.json          # Editable site content
│   └── logos/                # Company logo (add yours here)
├── src/
│   ├── components/           # Reusable components
│   │   ├── ModernNavbar      # Navigation with edit mode
│   │   ├── ModernGallery     # Swiper carousel gallery
│   │   ├── EditableText      # Inline text editing
│   │   ├── EditableImage     # Image editing with upload
│   │   └── ...
│   ├── context/              # React contexts
│   │   ├── AuthContext       # Firebase authentication
│   │   └── WebsiteContentContext  # Content management
│   ├── pages/                # Route pages
│   │   ├── ModernHome        # Main landing page
│   │   ├── Login             # Admin login
│   │   └── AdminDashboard    # Contact submissions
│   ├── firebase/
│   │   └── config.js         # Firebase initialization
│   ├── App.jsx               # Main app with routing
│   └── main.jsx              # React entry point
├── .env                      # Environment variables
├── vercel.json               # Deployment config
└── package.json              # Dependencies
```

## Key Features

### 1. Admin Content Management
- Login at `/login` with admin credentials
- Click "Edit" button on homepage
- Click any text or image to edit inline
- Click "Publish Changes" to deploy updates

### 2. Contact Form
- Public contact form on homepage
- Submissions saved to Firestore
- View in Admin Dashboard (`/admin`)
- Mark as New/Contacted/Resolved

### 3. Gallery Management
- Add/edit/delete images in Edit Mode
- Support for URL or file upload
- Swiper carousel with navigation
- Captions editable inline

### 4. Responsive Design
- Mobile-first responsive layout
- Hamburger menu for mobile
- Optimized for all screen sizes

### 5. SEO Ready
- Proper meta tags in index.html
- Semantic HTML structure
- Fast load times with Vite

## Customization

### Update Logo
1. Add your logo to `public/logos/logo.png`
2. Update `src/components/ModernNavbar.jsx` lines 65 and 96:
   ```jsx
   <img src="/logos/logo.png" alt="Company Logo" className="brand-logo" />
   ```

### Update Content
1. Login as admin
2. Click "Edit" button
3. Click on any text or image to edit
4. Click "Publish Changes" when done

### Update Colors
Main brand color is `#7CB342` (green). To change:
1. Update in `src/index.css` (scrollbar)
2. Update in component CSS files (buttons, accents)

### Update Services
Edit in Edit Mode or directly in `public/content.json`:
```json
"services": {
  "title": "Our Services",
  "items": [
    {
      "id": 1,
      "title": "Service Name",
      "description": "Service description"
    }
  ]
}
```

## Troubleshooting

### Build Errors
- Ensure Node.js version is 20.x or higher
- Run `npm install` to reinstall dependencies
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Firebase Errors
- Check Firebase console for authentication errors
- Verify Firestore security rules are applied
- Ensure admin email matches `.env` file

### Deployment Issues
- Check Vercel deployment logs
- Verify all environment variables are set
- Ensure `vercel.json` is in root directory

## Support

For issues or questions:
1. Check the Vercel deployment logs
2. Review Firebase console for errors
3. Check browser console for JavaScript errors

## Tech Stack

- **Frontend**: React 19, Vite 7
- **Styling**: Custom CSS with responsive design
- **Animation**: Framer Motion, AOS
- **Carousel**: Swiper
- **Backend**: Firebase (Auth + Firestore)
- **Deployment**: Vercel
- **Version Control**: GitHub
- **Content Publishing**: Octokit (GitHub API)
- **Image Hosting**: ImgBB

---

**Your website is ready to go live!** 🚀

Just deploy to Vercel and your professional pressure washing website will be online.
