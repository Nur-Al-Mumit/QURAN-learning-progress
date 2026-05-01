# Backend Project: Esho Quran Shikhi

The backend project has been initialized and configured with the requested tables and authentication.

## 🚀 Getting Started

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🛠 Project Structure

- **`server.js`**: Entry point of the application.
- **`.env`**: Contains the MongoDB URI and JWT Secret.
- **`models/`**:
  - `User.js`: Handles user data and password hashing (Roles: `admin`, `teacher`, `student`).
  - `Class.js`: Manages class schedules and student assignments.
  - `Attendance.js`: Tracks daily attendance records.
  - `UserDashboard.js`: Stores aggregated statistics and progress for students.
- **`routes/` & `controllers/`**: Implementation of API endpoints.
- **`middleware/`**: JWT protection and role-based authorization.

## 🔑 Authentication

- **Register**: `POST /api/auth/register` (body: `name`, `email`, `password`, `role`)
- **Login**: `POST /api/auth/login` (body: `email`, `password`)
- **Profile**: `GET /api/auth/me` (requires Bearer Token)

## 📡 Database

The project is connected to the MongoDB Atlas cluster: `esho_quran_shikhi`.

> [!NOTE]
> I have implemented basic Attendance routes as an example. You can follow the same pattern for Classes and Dashboard data.
