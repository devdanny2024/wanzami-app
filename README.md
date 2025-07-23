# Wanzami - Pay-Per-View Streaming Platform

**Wanzami** is a modern pay-per-view (PPV) streaming platform built using cutting-edge technologies like **Next.js 15**, **AWS Serverless Architecture**, and **Tailwind CSS**. Designed to offer a Netflix-style experience, Wanzami allows users to securely browse, watch, and manage media content with a robust authentication and content delivery system.

---

## 🚀 Project Overview

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS  
- **Backend:** AWS Serverless (Cognito, DynamoDB, S3, Lambda via API routes)  
- **Authentication:** AWS Cognito  
- **Database:** AWS DynamoDB  
- **File Storage:** AWS S3  
- **Deployment:** Vercel  

---

## 📦 Features

### ✅ Foundation & Frontend

- **Landing Page:** Netflix-inspired welcome screen for unauthenticated users
- **Discover Page:** Dynamic hero section, movie carousels, and genre filters
- **Movie Detail Page:** Dynamic routing for detailed movie/series information
- **Reusable Layout:** Header and footer with a consistent dark theme
- **Theming:** Custom orange accent color and smooth top loading bar (`nprogress`)

### 🔐 Authentication & User Management

- **Login & Registration:** Secure flows using AWS Cognito
- **Email Verification:** Account confirmation with one-time email codes
- **Session Management:** Secure, `httpOnly` cookie-based authentication
- **Route Protection:** Middleware-based redirection for protected/public pages
- **Account Page:** Users can manage their profile and change avatar
- **Avatar Selection:** Choose from 10 pre-defined avatars
- **Profile Update:** Username and avatar updates synced to Cognito

### 🎬 Content Management (In Progress)

- **Media Metadata:** Stored in a `wanzami-movies` table (DynamoDB)
- **Media Files:** Stored in `wanzami-media-storage` S3 bucket
- **Admin Upload Interface:**
  - Secure access via a secret URL token
  - Dynamic forms for movies vs. series (single vs. multi-file upload)
- **Pre-signed Uploads:** S3 upload URLs generated via backend API
- **Content Finalization:** Dynamically mark content as "AVAILABLE" in DynamoDB post-upload

---

## 🛠️ Tech Stack

| Layer        | Technology                  |
|--------------|------------------------------|
| Frontend     | Next.js 15, TypeScript       |
| Styling      | Tailwind CSS, NProgress      |
| Auth         | AWS Cognito                  |
| Database     | AWS DynamoDB                 |
| File Storage | AWS S3                       |
| Hosting      | Vercel                       |

---

## 📁 Project Structure

```bash
.
├── app/               # App router structure for pages
├── components/        # Reusable UI components
├── lib/               # Utility functions (e.g., auth, db)
├── api/               # API routes (Next.js serverless functions)
├── styles/            # Tailwind and global styles
├── public/            # Static assets
├── middleware.ts      # Route protection
└── tailwind.config.js # Custom theming
