# Cypress

## Team Members
- Milad Safi
- Maruf Ahmed
- Labib Sarwar
- Wesil Said
- Sameeh Hasayen

## Project Overview
Cypress is a progressive web application designed to modernize and streamline the way citizens of Toronto report and track street-related issues. By replacing the current cumbersome and manual process, Cypress will provide an intuitive, map-based interface that allows users to pinpoint problem locations with precision, accurately categorize issues, and submit detailed reports directly to the City of Toronto. Citizens will also have the ability to subscribe to updates regarding the resolution of their reports.

By enhancing accessibility, transparency, and efficiency, Cypress aims to foster a more responsive and engaged community while improving municipal service operations.

## Core Features
- User Authentication - Users may create an account and log in.
- Report Issues - Users may submit reports with descriptions, locations, and images.
- Track Status - Users may see the status of their reports (Pending, In Progress, Resolved).
- Admin Dashboard - City officials can manage and moderate reports, changing their statuses.
- Mapping Integration - Reports are displayed on an interactive city map with GIS support.


## Technology Stack

### Frontend (Vue.js)
- Vue.js
- TailwindCSS
- OpenStreetMap API

### Backend (Python & FastAPI)
- Supabase Auth (user auth and management)
- Supabase Storage (image buckets)
- PostgreSQL Database through Supabase


## System Architecture
1. User registers and logs in.
2. User submits an issue (attaches image, selects category, adds location).
3. Issue is stored in the database with “Pending” status.
4. City officials update the issue status (Pending -> In Progress -> Resolved).
6. Users can track and view reports on an interactive GIS-enabled map.
