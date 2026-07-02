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

  const enrollCourse = async (courseId, amount) => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        {
          amount,
          courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "LMS Platform",
        description: "Course Purchase",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payments/verify",
              {
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature,
                courseId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            alert("Payment successful & enrolled!");
            console.log(verifyRes.data);
            navigate("/my-courses");
          } catch (error) {
            console.log(error);
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: "Student",
          email: "student@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
      alert("Payment initiation failed");
    }
  };

  const demoEnrollCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/payments/demo-success",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Demo payment successful! Course enrolled.");
      console.log(res.data);
      navigate("/my-courses");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Demo enrollment failed"
      );
    }
  };

  return (
    <div className="courses-container">
      <h1 className="courses-title">Courses</h1>

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
                  enrollCourse(course._id, course.price)
                }
              >
                Buy Now
              </button>

              <button
                className="enroll-btn"
                onClick={() =>
                  demoEnrollCourse(course._id)
                }
                style={{
                  marginTop: "10px",
                  backgroundColor: "#16a34a",
                }}
              >
                Demo Payment Success
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Courses;