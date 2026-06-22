import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";

function App() {
  const logout = () => {
    localStorage.removeItem("token");
    alert("Logged Out Successfully");
  };

  return (
    <BrowserRouter>
      <nav
        style={{
          padding: "15px",
          borderBottom: "1px solid black",
          marginBottom: "20px",
        }}
      >
        <Link to="/" style={{ marginRight: "15px" }}>
          Courses
        </Link>

        <Link to="/my-courses" style={{ marginRight: "15px" }}>
          My Courses
        </Link>

        <Link to="/login" style={{ marginRight: "15px" }}>
          Login
        </Link>

        <Link to="/register" style={{ marginRight: "15px" }}>
          Register
        </Link>

        <button onClick={logout}>Logout</button>
      </nav>

      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-courses" element={<MyCourses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;