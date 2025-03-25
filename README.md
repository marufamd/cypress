# Cypress

## Team Members
- Milad Safi
- Maruf Ahmed
- Labib Sarwar
- Wesil Said
- Sameeh Hasayen

## Project Overview
Cypress is a progressive web application designed to modernize and streamline the way citizens of Toronto report and track street-related issues. By replacing the current cumbersome and manual process, Cypress will provide an intuitive, map-based interface that allows users to pinpoint problem locations with precision, accurately categorize issues, and submit detailed reports directly to the City of Toronto. Citizens will also have the ability to subscribe to updates regarding the resolution of their reports. Additionally, the platform will enable users to view reported problems in specific areas and implement measures to prevent false submissions.

To ensure data integrity and prevent false reports, Cypress will incorporate multiple safeguards, including user verification, location validation to confirm the authenticity of submissions, and photographic evidence to support reports. A moderation system will allow reports to be reviewed and flagged if necessary.

By enhancing accessibility, transparency, and efficiency, Cypress aims to foster a more responsive and engaged community while improving municipal service operations.


## Core Features
- **Progressive Web App** – Installable, mobile-friendly experience.
- **User Authentication** – Secure login and registration.
- **Report Issues** - Users may submit reports with descriptions, locations, and images.
- **Track Status** - Users may see the status of their reports (Pending, In Progress, Resolved).
- **Admin Dashboard** - City officials can manage and moderate reports, changing their statuses.
- **Mapping Integration** - Reports are displayed on an interactive city map with GIS support.
- **Notification System** – Users receive updates when their reports change status or receive comments from city officials.


## Technology Stack

### Frontend (React.js)
- React.js (for UI development)
- TailwindCSS (for UI components)
- Pinia (for state management)
- Google Maps API of GIS integration
- JWT Authentication (for security)

### Backend (Python & FastAPI)
- FastAPI (for handling API requests)
- PostgreSQL (Database via Supabase)
- JWT for authentication
- Cloudinary / AWS S3 (for image storage)
- WebSockets (for real-time updates)
- GIS Support (PostGIS for spatial queries)


### Database (Supabase)
- PostgreSQL with PostGIS extension
- Authentication services
- File storage for images



## System Architecture
1. User registers and logs in.
2. User submits an issue (attaches image, selects category, adds location).
3. Issue is stored in the database with “Pending” status.
4. City officials update the issue status (Pending -> In Progress -> Resolved).
5. Users receive notifications for updates.
6. Users can track and view reports on an interactive GIS-enabled map.


## Implementation Steps
**1. Setup Backend (FastAPI & Python)**
   - Create REST API endpoints for:
   - User authentication (JWT-based)
   - Create, update, delete reports
   - Fetch reports based on location/status
	- Implement authentication using JWT.
	- Use Supabase storage for image uploads.

**2. Build Frontend (React.js)**
	- Create React components:
   - Login/Register page
   - Report form (title, description, location picker, image upload)
   - Issue tracking dashboard
   - Interactive GIS map (Google Maps API)

**3. Deployment**
	- Frontend: Deploy React app on Vercel or Firebase.
   - Backend: Deploy FastAPI on AWS EC2
   - Database: Use Supabase PostgreSQL 
      (manage cloud database with PostGIS support)
   - Storage: Use Supabase storage or AWS S3 for image hosting.
