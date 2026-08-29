# Campus Cafeteria Food Ordering System

## Project Overview

Campus Cafeteria is a web-based food ordering system developed using the MERN stack. It allows students to browse food items, place orders, and track order status. Admins can manage menu items and student orders.

## Features

### Student Portal

* Student Registration
* Student Login
* View Food Menu
* Add Items to Cart
* Place Orders
* View My Orders
* Track Order Status
* Logout

### Admin Portal

* Admin Login
* Admin Dashboard
* Manage Menu Items
* Add, Edit and Delete Food Items
* View Student Orders
* Update Order Status
* Logout

## Technologies Used

* React.js – Frontend
* Node.js – Backend runtime
* Express.js – Backend API
* MongoDB – Database
* Mongoose – Database connection and models
* Axios – API communication
* JWT – Authentication
* bcryptjs – Password hashing
* CORS – Frontend-backend communication
* dotenv – Environment configuration

## Project Structure

```text
campus-cafeteria/
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── App.jsx
│       ├── App.css
│       ├── ProtectedRoute.jsx
│       └── AdminProtectedRoute.jsx
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
└── .gitignore
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend runs on:

```text
http://localhost:5000
```

## Database

MongoDB is used to store:

* Student/Admin users
* Menu items
* Orders
* Feedback

## Order Flow

```text
Student Login
     ↓
Browse Menu
     ↓
Add Food to Cart
     ↓
Place Order
     ↓
Admin Views Order
     ↓
Admin Updates Status
     ↓
Student Checks My Orders
```

## Authentication

JWT-based authentication is used to protect student and admin dashboards. Passwords are secured using bcryptjs.

## Purpose

The main purpose of this project is to provide a convenient online cafeteria ordering system that reduces waiting time and makes food ordering and order management easier.

## Future Enhancements

* Online payment
* Food search and filtering
* Order notifications
* Better feedback management
* Live order tracking
* Deployment as a public web application
