import { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/courses"
      );

      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const enrollCourse = async (courseId) => {
    console.log("Button Clicked", courseId);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/enrollments",
        {
          courseId,
        },
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

  return (
    <div>
      <h1>Courses</h1>

      {courses.map((course) => (
        <div
          key={course._id}
          style={{
            border: "1px solid black",
            padding: "10px",
            margin: "10px",
          }}
        >
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <h3>₹ {course.price}</h3>

          <button onClick={() => enrollCourse(course._id)}>
            Enroll Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default Courses;