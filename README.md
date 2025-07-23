Wanzami - Pay-Per-View Streaming Platform
This document logs the development progress of the Wanzami streaming platform, a project built with Next.js and AWS.

Project Overview
Concept: A modern, pay-per-view (PPV) streaming service.

Frontend: Next.js (App Router) with TypeScript and Tailwind CSS.

Backend: Serverless architecture using AWS services.

Authentication: AWS Cognito

Database: AWS DynamoDB

File Storage: AWS S3

Deployment: Vercel

Development Log
Phase 1: Foundation & Frontend Scaffolding
Project Initialization:

Set up a new Next.js 15 project with TypeScript and Tailwind CSS.

Established the core project structure, including app, components, lib, and api directories.

UI Development (from Figma Designs):

Welcome Page: Created a Netflix-inspired landing page for new visitors.

Discover Page: Built the main content discovery page with a dynamic video hero section and horizontally scrolling carousels.

Movie Detail Page: Implemented a dynamic route to display detailed information for individual movies and series.

Layout: Created a consistent main layout with a shared Header and Footer.

Styling & Theming:

Configured Tailwind CSS for a dark theme based on the designs.

Implemented a custom orange theme color (theme-orange) derived from the official Wanzami logo, applied to all interactive elements.

Added a slim, theme-colored top loading bar (nprogress) to provide visual feedback during page navigation.

Phase 2: Authentication & User Management
Backend Setup (AWS Cognito):

Created an AWS Cognito User Pool to manage user data and authentication.

Configured the app client to allow secure user password authentication flows.

Frontend Authentication Flow:

Built the UI for the Login, Register, and Email Verification pages.

Connected the forms to backend API endpoints.

API Route Implementation:

api/auth/register: Securely registers a new user in the Cognito User Pool.

api/auth/login: Authenticates user credentials with Cognito and establishes a session using secure, httpOnly cookies.

api/auth/verify: Confirms a new user's account using a code sent to their email.

api/auth/logout: Clears session cookies to log the user out.

Session Management & Security:

Implemented a middleware.ts file to protect routes.

Unauthenticated users are redirected from protected pages (like /discover and /account) to the login page.

Authenticated users are redirected from public pages (like / and /login) to the discover page.

Account & Profile Management:

Account Page: Created a dedicated, protected page for users to manage their profiles.

Avatar Selection: Implemented a feature allowing users to select from 10 preset avatars.

Profile Updates: Built a backend API (api/auth/update-profile) that securely updates user attributes (username, picture) in Cognito. The Header now dynamically displays the user's chosen avatar.

Phase 3: Content Management (In Progress)
Backend Setup (AWS DynamoDB & S3):

Created a wanzami-movies table in DynamoDB to store movie and series metadata.

Created an S3 bucket (wanzami-media-storage) to store all media files (posters, videos, etc.).

Configured a dedicated IAM user with scoped-down permissions (dynamodb:Scan, dynamodb:PutItem, s3:PutObject) for the application.

Dynamic Content Loading:

Created a api/movies endpoint to fetch all movie data from the DynamoDB table.

Updated the Discover page to call this API, replacing the initial mock data with live data from the database.

Admin Content Upload:

Admin Page UI: Designed and built a comprehensive, secure admin page for uploading new content. The page is protected by a secret key passed via a URL parameter.

Dynamic Form: The form dynamically adjusts to allow for single movie file uploads or multiple episode file uploads for a series.

File Upload Backend:

Created an API endpoint (api/admin/upload) that receives content metadata.

This endpoint securely generates pre-signed URLs from S3 for each file.

The frontend uses these URLs to upload files directly to the S3 bucket.

A final API endpoint (api/admin/finalize-upload) updates the content's status in DynamoDB to "AVAILABLE" once all files are uploaded.
