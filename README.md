# TalentHub - Professional Job Board Application

A modern, full-stack job board application built with the MERN stack.

## 🚀 Features
- User authentication and authorization
- Job posting and management
- Advanced job search and filtering
- Application tracking system
- Responsive design

## 🛠 Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## 📁 Project Structure

TalentHub/
├── backend/           # Express.js API
├── frontend/          # React.js application
├── docs/              # Documentation
└── README.md          # Project overview

## 🏃‍♂️ Quick Start

### Backend Setup
```bash
cd backend
npm install
npm run dev

🔧 Environment Variables
Create .env file in backend directory:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/talenthub
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
📝 API Documentation
Authentication Endpoints
Register User
httpPOST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "role": "jobseeker" // or "employer"
}
Login User
httpPOST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
Get Profile (Protected)
httpGET /api/auth/profile
Authorization: Bearer JWT_TOKEN
Update Profile (Protected)
httpPUT /api/auth/profile
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "profile": {
    "skills": ["React", "Node.js"],
    "experience": "2 years"
  }
}
🔒 Security Features

Password hashing with bcrypt
JWT token-based authentication
Protected routes with middleware
Input validation and sanitization
Environment variable configuration

🤝 Contributing
