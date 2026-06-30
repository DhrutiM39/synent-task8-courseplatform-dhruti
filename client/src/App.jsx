import ManageCourses from "./pages/ManageCourses";
import AdminDashboard from "./pages/AdminDashboard";
import EditCourse from "./pages/EditCourse";
import AddCourse from "./pages/AddCourse";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewUsers from "./pages/ViewUsers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ViewEnrollments from "./pages/ViewEnrollments";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import CourseDetails from "./pages/CourseDetails";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/admin/add-course" element={<AddCourse />} />
        <Route path="/admin/edit-course/:id" element={<EditCourse />}/>
        <Route path="/admin/manage-courses" element={<ManageCourses />}/>
        <Route path="/admin" element={<AdminDashboard />}/>
<Route path="/admin/enrollments"element={<ViewEnrollments />}/>
<Route path="/admin/users" element={<ViewUsers />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;