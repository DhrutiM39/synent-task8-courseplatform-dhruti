import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../AddCourse.css";

function AddModule() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);

  // Fetch all courses to populate the dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
        // Pre-select if arriving from EditCourse via ?courseId=
        const preselect = searchParams.get("courseId");
        if (preselect) {
          setCourseId(preselect);
        } else if (res.data.length > 0) {
          setCourseId(res.data[0]._id);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load courses.");
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/modules",
        { title, course: courseId, order: Number(order) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Module Added Successfully");
      console.log(res.data);

      setTitle("");
      setOrder(1);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to Add Module");
    }
  };

  return (
    <div className="add-course-container">
      <h1>Add New Module</h1>

      <form onSubmit={handleSubmit} className="add-course-form">

        {/* Course selector */}
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          <option value="" disabled>Select a Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Module Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Order (e.g. 1)"
          value={order}
          min="1"
          onChange={(e) => setOrder(e.target.value)}
          required
        />

        <button type="submit">Add Module</button>

      </form>

      <button
        className="add-course-form"
        style={{
          marginTop: "16px",
          padding: "12px",
          background: "transparent",
          color: "#2563eb",
          border: "1px solid #2563eb",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "15px",
          width: "100%",
        }}
        onClick={() => navigate("/admin")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default AddModule;
