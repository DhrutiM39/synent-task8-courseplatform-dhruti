# 📚 Online Course Platform

A full-stack MERN application where users can register, log in, browse courses, enroll in them, and track their enrolled courses — all secured with JWT-based authentication.

---

## 🚀 Features

### 🔐 Authentication
- User Registration & Login
- Password hashing using **bcrypt.js**
- JWT-based authentication
- Protected routes using custom middleware

### 🎓 Courses
- Add new courses
- View all available courses
- View a single course by ID
- Update course details
- Delete a course

### 📝 Enrollments
- Enroll in a course
- Prevents duplicate enrollment for the same course
- View all courses the logged-in user is enrolled in (with progress tracking)

### 💻 Frontend
- Built with **React + Vite**
- Client-side routing using **React Router**
- Pages: Login, Register, Courses, My Courses
- Connected to backend APIs using **Axios**
- JWT token stored in `localStorage` for authenticated requests

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, React Router, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**Authentication:** JWT, bcrypt.js  

---

## 📁 Project Structure

```
project/
├── client/                 # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Courses.jsx
│       │   └── MyCourses.jsx
│       ├── App.jsx
│       └── main.jsx
│
└── server/                 # Express backend
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── courseController.js
    │   └── enrollmentController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── user.js
    │   ├── Course.js
    │   └── Enrollment.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── courseRoutes.js
    │   └── enrollmentRoutes.js
    └── server.js
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd project
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Run the backend server:
```bash
npm run dev
```
Server runs on **http://localhost:5000**

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint    | Description           | Protected |
|--------|-------------|------------------------|-----------|
| POST   | `/register` | Register a new user   | ❌        |
| POST   | `/login`    | Login & get JWT token  | ❌        |
| GET    | `/profile`  | Get logged-in user     | ✅        |

### Course Routes — `/api/courses`
| Method | Endpoint | Description           |
|--------|----------|------------------------|
| POST   | `/`      | Add a new course       |
| GET    | `/`      | Get all courses        |
| GET    | `/:id`   | Get a course by ID     |
| PUT    | `/:id`   | Update a course        |
| DELETE | `/:id`   | Delete a course        |

### Enrollment Routes — `/api/enrollments`
| Method | Endpoint       | Description                      | Protected |
|--------|----------------|-----------------------------------|-----------|
| POST   | `/`            | Enroll in a course                | ✅        |
| GET    | `/my-courses`  | Get enrollments for current user  | ✅        |

---

## 🔒 Authentication Flow

1. User registers → password is hashed with bcrypt → stored in MongoDB.
2. User logs in → credentials verified → JWT token issued (valid for 7 days).
3. Token is stored in `localStorage` on the frontend.
4. Protected routes require the token to be sent as:
   ```
   Authorization: Bearer <token>
   ```
5. `authMiddleware.js` verifies the token before granting access to protected resources.

---

## 📌 Future Improvements

- [ ] Add route protection (admin-only) for course creation/editing/deletion
- [ ] Wire up the Register page UI to the existing registration API
- [ ] Add global auth state (Context API) instead of relying on `localStorage` reads alone
- [ ] Add course progress update functionality
- [ ] Improve UI/UX with a proper design system
- [ ] Add form validation and better error messages
- [ ] Deploy backend (Render) and frontend (Vercel/Netlify)

---

## 👩‍💻 Author

**Dhruti**  
Built as part of a full-stack development internship project.

---

## 📄 License

This project is open source and available for learning purposes.
