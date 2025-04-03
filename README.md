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
● Progressive Web Application - Web app can be installed to act like a regular application.
● User Authentication - Users may create an account and log in.
● Report Issues - Users may submit reports with descriptions, locations, and images.
● Track Status - Users may see the status of their reports (Pending, In Progress, Resolved).
● Admin Dashboard - City officials can manage and moderate reports, changing their statuses.
● Mapping Integration - Reports are displayed on an interactive city map with GIS support.
● Notification System – Users receive updates when their reports change status or receive comments from city officials.


## Technology Stack

### Frontend (Vue.js)
- Vue.js (for UI development)
- TailwindCSS (for UI components)
- Google Maps API (for GIS integration)
- Supabase Auth (for Authentication)

### Backend (Python & FastAPI)
- FastAPI (for handling API requests)
- PostgreSQL (Database via Supabase)
- JWT for authentication
- AWS S3 (for image storage)
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
