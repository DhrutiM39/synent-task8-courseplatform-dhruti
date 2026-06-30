import { useState } from "react";
import axios from "axios";
import "../AddCourse.css";

function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/courses",
        {
          title,
          description,
          price,
          thumbnail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course Added Successfully");

      console.log(res.data);

      setTitle("");
      setDescription("");
      setPrice("");
      setThumbnail("");

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to Add Course");
    }
  };

  return (
    <div className="add-course-container">
      <h1>Add New Course</h1>

      <form
        onSubmit={handleSubmit}
        className="add-course-form"
      >
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          required
        />

        <input
          type="number"
          placeholder="Course Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="Thumbnail Image URL"
          value={thumbnail}
          onChange={(e) =>
            setThumbnail(e.target.value)
          }
        />

        <button type="submit">
          Add Course
        </button>
      </form>
    </div>
  );
}

export default AddCourse;