import "../MyCourses.css";
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

  const updateProgress = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/enrollments/${id}/progress`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchMyCourses();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mycourses-container">

      <h1 className="mycourses-title">
        📚 My Learning Dashboard
      </h1>

      <div className="mycourses-grid">

        {courses.map((item) => (

          <div
            key={item._id}
            className="course-card"
          >

            <img
              src="https://picsum.photos/350/180"
              alt="Course"
              className="course-image"
            />

            <div className="course-content">

              <h2>{item.course.title}</h2>

              <p>{item.course.description}</p>

              <h3>₹ {item.course.price}</h3>

              <div className="progress-header">
                <span>Progress</span>

                <span>{item.progress}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${item.progress}%`,
                  }}
                ></div>
              </div>

              <button
                className="complete-btn"
                onClick={() =>
                  updateProgress(item._id)
                }
              >
                ✅ Mark Complete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MyCourses;