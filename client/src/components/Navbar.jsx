import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged Out Successfully");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        LMS
      </div>

      <div className="nav-links">
        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          Courses
        </Link>

        {token && (
          <Link
            to="/my-courses"
            className={
              location.pathname === "/my-courses"
                ? "active"
                : ""
            }
          >
            My Courses
          </Link>
        )}

        {!token ? (
          <>
            <Link
              to="/login"
              className={
                location.pathname === "/login"
                  ? "active"
                  : ""
              }
            >
              Login
            </Link>

            <Link
              to="/register"
              className={
                location.pathname === "/register"
                  ? "active"
                  : ""
              }
            >
              Register
            </Link>
          </>
        ) : (
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;