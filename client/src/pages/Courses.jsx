import { useNavigate } from "react-router-dom";
import "../Courses.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");


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

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);

      const existing = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existing) {
        existing.addEventListener("load", () => resolve(true));
        existing.addEventListener("error", () => reject(new Error("Razorpay SDK failed to load")));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
      document.body.appendChild(script);
    });
  };

  const enrollCourse = async (courseId, amount) => {
    try {
      const token = localStorage.getItem("token");

      await loadRazorpayScript();
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please try again.");
        return;
      }


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
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            alert("Payment successful & enrolled!");
            console.log("verifyRes.data", verifyRes.data);
            navigate("/my-courses");
          } catch (error) {
            console.log("verify error", error?.response?.data || error);
            alert(
              error?.response?.data?.message ||
                "Payment verification failed"
            );
          }
        },

        // Important: international/failed cards often fail before handler runs.
        // So we must capture failure as well.
        modal: {
          ondismiss: function () {
            console.log("Razorpay modal dismissed");
          },
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

      razor.on("payment.failed", function (resp) {
        console.log("Razorpay payment.failed", resp);
        alert(
          resp?.error?.description ||
            resp?.error?.reason ||
            "Payment failed"
        );
      });

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

      <div className="filters-row">
        <div className="filter-field">
          <label>Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="filter-input"
            placeholder="0"
            min="0"
          />
        </div>

        <div className="filter-field">
          <label>Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="filter-input"
            placeholder="100000"
            min="0"
          />
        </div>
      </div>

      <div className="course-grid">
        {courses
          .filter((course) => {
            const titleOk = course.title
              .toLowerCase()
              .includes(search.toLowerCase());

            const price = Number(course.price);
            const minOk = minPrice === "" ? true : price >= Number(minPrice);
            const maxOk = maxPrice === "" ? true : price <= Number(maxPrice);

            return titleOk && minOk && maxOk;
          })
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
                Enroll Now
              </button>

              {import.meta.env.VITE_ALLOW_DEMO === "true" && (
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
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Courses;