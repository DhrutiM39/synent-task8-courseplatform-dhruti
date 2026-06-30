import { Link } from "react-router-dom";
import "../AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-cards">

        <Link to="/admin/add-course" className="admin-card">
          <h2>➕ Add Course</h2>
          <p>Create a new course</p>
        </Link>

        <Link to="/admin/manage-courses" className="admin-card">
          <h2>📚 Manage Courses</h2>
          <p>Edit or Delete Courses</p>
        </Link>

        <Link to="/admin/users" className="admin-card">
          <h2>👨‍🎓 Users</h2>
          <p>View Registered Users</p>
        </Link>

        <Link to="/admin/enrollments" className="admin-card">
          <h2>📝 Enrollments</h2>
          <p>View Course Enrollments</p>
        </Link>

      </div>
    </div>
  );
}

export default AdminDashboard;