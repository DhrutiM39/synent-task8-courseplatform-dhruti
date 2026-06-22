import { useEffect, useState } from "react";
import axios from "axios";

function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/enrollments/my-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>My Courses</h1>

      {courses.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid black",
            padding: "10px",
            margin: "10px",
          }}
        >
          <h2>{item.course.title}</h2>
          <p>{item.course.description}</p>
          <h3>₹ {item.course.price}</h3>
          <p>Progress: {item.progress}%</p>
        </div>
      ))}
    </div>
  );
}

export default MyCourses;