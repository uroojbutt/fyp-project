# 🎓 FYP Management System

A full stack web application built with the **MERN Stack** to streamline and manage the Final Year Project process for students, supervisors, and administrators.

---

## 🚀 About The Project

The FYP Management System is designed to simplify and organize the entire Final Year Project lifecycle — from student registration and supervisor assignment to project submission and progress tracking. It provides a centralized platform for all stakeholders involved in the FYP process.

---

## ✨ Features

- 🔐 **User Authentication** — Secure login and signup for students, supervisors, and admins
- 👤 **Role-Based Access** — Different dashboards and permissions for each user type
- 📁 **Project Management** — Create, submit, and track FYP proposals and progress
- 👨‍🏫 **Supervisor Assignment** — Assign and manage supervisor-student relationships
- 📊 **Progress Tracking** — Monitor project milestones and deadlines
- 🔔 **Notifications** — Stay updated on project status and feedback

> ⚠️ **Note:** This project is currently under active development. More features are being added regularly.

---

## 🛠️ Built With

| Technology | Purpose |
|------------|---------|
| **MongoDB** | Database |
| **Express.js** | Backend Framework |
| **React.js** | Frontend Library |
| **Node.js** | Runtime Environment |
| **JWT** | Authentication |
| **REST APIs** | Client-Server Communication |

---

## 📦 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/uroojbutt/fyp-project.git
   cd fyp-management-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the backend folder:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

5. **Run the application**

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend:
   ```bash
   cd client
   npm run dev
   ```

---

## 📁 Project Structure

```
fyp-management-system/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
└── README.md
```

---

## 🔧 Current Status

- [x] User Authentication (Login & Signup)
- [ ] Role-Based Dashboards
- [ ] Project Submission Module
- [ ] Supervisor Assignment
- [ ] Progress Tracking
- [ ] Notifications System

---

## 👩‍💻 Author

Developed by **Urooj** as part of Final Year Project  
BS Computer Science

---

## 📄 License

This project is for academic purposes.
