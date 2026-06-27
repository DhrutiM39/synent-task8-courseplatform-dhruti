import "../CourseDetails.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses/${id}`
      );

      setCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!course) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="course-details">
      <h1>{course.title}</h1>

      <p>{course.description}</p>

      <h2>₹ {course.price}</h2>

      <img
        src="https://picsum.photos/500/250"
        alt={course.title}
      />

      <br />

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        Back to Courses
      </button>
    </div>
  );
}

export default CourseDetails;