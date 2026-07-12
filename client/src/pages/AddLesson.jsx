import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../AddCourse.css";

function AddLesson() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [modules, setModules] = useState([]);
  const [moduleId, setModuleId] = useState("");

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [order, setOrder] = useState(1);

  // Step-1: fetch all courses for the first dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
        // Pre-select if arriving from EditCourse via ?courseId=
        const preselect = searchParams.get("courseId");
        if (preselect) setSelectedCourseId(preselect);
      } catch (err) {
        console.error(err);
        alert("Failed to load courses.");
      }
    };
    fetchCourses();
  }, []);

  // Step-2: whenever the chosen course changes, fetch its modules
  useEffect(() => {
    if (!selectedCourseId) {
      setModules([]);
      setModuleId("");
      return;
    }

    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        // We call the public getCourseById endpoint which already returns modules
        const res = await axios.get(
          `http://localhost:5000/api/courses/${selectedCourseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const mods = res.data.modules || [];
        setModules(mods);
        setModuleId(mods.length > 0 ? mods[0]._id : "");
      } catch (err) {
        console.error(err);
        alert("Failed to load modules for selected course.");
      }
    };
    fetchModules();
  }, [selectedCourseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!moduleId) {
      alert("Please select a module.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/lessons",
        { title, videoUrl, module: moduleId, order: Number(order) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Lesson Added Successfully");
      console.log(res.data);

      setTitle("");
      setVideoUrl("");
      setOrder(1);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to Add Lesson");
    }
  };

  return (
    <div className="add-course-container">
      <h1>Add New Lesson</h1>

      <form onSubmit={handleSubmit} className="add-course-form">

        {/* Course selector — drives the module dropdown */}
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          required
        >
          <option value="" disabled>Select a Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        {/* Module selector — populated after a course is chosen */}
        <select
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          required
          disabled={modules.length === 0}
        >
          <option value="" disabled>
            {selectedCourseId
              ? modules.length === 0
                ? "No modules yet — add one first"
                : "Select a Module"
              : "Select a course first"}
          </option>
          {modules.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="url"
          placeholder="YouTube Video URL (e.g. https://www.youtube.com/watch?v=…)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
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

        <button type="submit">Add Lesson</button>

      </form>

      <button
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

export default AddLesson;
