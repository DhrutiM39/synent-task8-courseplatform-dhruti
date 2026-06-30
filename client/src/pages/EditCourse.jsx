import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../AddCourse.css";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses/${id}`
      );

      setTitle(res.data.title);
      setDescription(res.data.description);
      setPrice(res.data.price);
      setThumbnail(res.data.thumbnail);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/courses/${id}`,
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

      alert("Course Updated Successfully");

      navigate("/admin/manage-courses");

    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="add-course-container">
      <h1>Edit Course</h1>

      <form
        className="add-course-form"
        onSubmit={handleUpdate}
      >

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <input
          type="text"
          value={thumbnail}
          onChange={(e) =>
            setThumbnail(e.target.value)
          }
        />

        <button type="submit">
          Update Course
        </button>

      </form>
    </div>
  );
}

export default EditCourse;

