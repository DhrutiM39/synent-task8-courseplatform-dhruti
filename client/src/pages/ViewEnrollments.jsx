
import { useEffect, useState } from "react";
import axios from "axios";
import "../ViewEnrollments.css";

function ViewEnrollments() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/enrollments/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Enrollments Response:", res.data);
      setEnrollments(res.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="enrollment-container">
      <h1>Course Enrollments</h1>

      <table className="enrollment-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Course</th>
            <th>Price</th>
            <th>Progress</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map((item) => (
            <tr key={item._id}>
              <td>{item.user?.name}</td>
              <td>{item.user?.email}</td>
              <td>{item.course?.title}</td>
              <td>₹ {item.course?.price}</td>
              <td>{item.progress}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewEnrollments;

