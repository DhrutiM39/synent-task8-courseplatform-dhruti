import { useNavigate } from "react-router-dom";
import "../Courses.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
const navigate = useNavigate();

const [courses, setCourses] = useState([]);
const [search, setSearch] = useState("");

useEffect(() => {
fetchCourses();
}, []);

const fetchCourses = async () => {
try {
const res = await axios.get(
"http://localhost:5000/api/courses"
);


  console.log("Courses Response:", res.data);
  setCourses(res.data);
} catch (error) {
  console.log(error);
}


};

const enrollCourse = async (courseId) => {
try {
const token = localStorage.getItem("token");


  const res = await axios.post(
    "http://localhost:5000/api/enrollments",
    { courseId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert("Enrollment Successful");
  console.log(res.data);
} catch (error) {
  alert("Already enrolled");
  console.log(error);
}


};

return ( <div className="courses-container"> <h1 className="courses-title">Courses</h1>


  <input
    type="text"
    placeholder="Search Courses..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-box"
  />

  <div className="course-grid">
    {courses
      .filter((course) =>
        course.title
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .map((course) => (
        <div
          key={course._id}
          className="course-card"
        >
          <h2
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(`/course/${course._id}`)
            }
          >
            {course.title}
          </h2>

          <p>{course.description}</p>

          <h3 className="price">
            ₹ {course.price}
          </h3>

          <button
            className="enroll-btn"
            onClick={() =>
              enrollCourse(course._id)
            }
          >
            Enroll Now
          </button>
        </div>
      ))}
  </div>
</div>


);
}

export default Courses;
