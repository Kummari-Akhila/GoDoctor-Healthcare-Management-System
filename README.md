# GoDoctor - Complete Healthcare Management System

## Overview
GoDoctor is a comprehensive full-stack healthcare system built with React.js frontend, Node.js/Express.js backend, and MongoDB database. It provides separate applications for patients, doctors, support staff, and administrators.

## Tech Stack
- **Frontend**: React.js with modern UI/UX
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based
- **Architecture**: RESTful API with modular structure

## Applications/Modules
1. **Patient Application** - User registration, appointment booking, prescription viewing
2. **Doctor Application** - Profile management, appointment handling, prescription writing
3. **Support Application** - Ticket-based support, chat system, issue resolution
4. **Admin Dashboard** - User management, doctor verification, system monitoring

## Features
- JWT Authentication
- Role-based access control
- Appointment management
- Prescription system
- Payment integration (optional)
- Notifications
- Support ticketing system

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Create .env file with MongoDB URI and JWT secret
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Database
- Install MongoDB locally or use MongoDB Atlas
- Update connection string in backend/config/database.js

## API Documentation
See backend/routes/ for all API endpoints.

## Deployment
- Backend: Deploy to services like Heroku, AWS EC2, or Azure App Service
- Frontend: Deploy to Vercel, Netlify, or AWS S3
- Database: MongoDB Atlas for cloud hosting

## Architecture
- Modular backend with separate routes/controllers
- Component-based React frontend
- JWT for secure authentication
- Role-based permissions

## Contributing
Follow standard coding practices and maintain modular structure.