import "../CourseDetails.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();


const [course, setCourse] = useState(null);
const [modules, setModules] = useState([]);
const [selectedLesson, setSelectedLesson] = useState(null);



  useEffect(() => {
    fetchCourse();
  }, []);

 
  const fetchCourse = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:5000/api/courses/${id}/content`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCourse(res.data.course);

    setModules(res.data.modules);

    if ( 
      res.data.modules.length > 0 &&
      res.data.modules[0].lessons.length > 0
    ) {
      setSelectedLesson(res.data.modules[0].lessons[0]);
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "You need to enroll to access this content";

    alert(message);
    setCourse(null);
    setModules([]);
    setSelectedLesson(null);
  }
};



  
if (!course) {
  return <h2>Loading...</h2>;
}

return (
  <div className="course-page">

    <div className="course-left">

      <h1>{course.title}</h1>

      <p>{course.description}</p>

      <h2>₹ {course.price}</h2>

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        Back
      </button>

      <hr />

      <h2>Course Content</h2>

      {modules.map((module) => (
        <div
          key={module._id}
          className="module-card"
        >
          <h3>{module.title}</h3>

          {module.lessons.map((lesson) => (
            <p
              key={lesson._id}
              className="lesson-item"
              onClick={() =>
                setSelectedLesson(lesson)
              }
            >
              ▶ {lesson.title}
            </p>
          ))}
        </div>
      ))}

    </div>

    <div className="course-right">

      {selectedLesson ? (
        <>

          <iframe
            width="100%"
            height="400"
            src={selectedLesson.videoUrl.replace(
              "watch?v=",
              "embed/"
            )}
            title={selectedLesson.title}
            allowFullScreen
          ></iframe>

          <h2>{selectedLesson.title}</h2>

        </>
      ) : (
        <h2>Select a Lesson</h2>
      )}

    </div>

  </div>
);


}

export default CourseDetails;