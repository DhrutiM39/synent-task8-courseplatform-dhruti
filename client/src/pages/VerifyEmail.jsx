import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );
        setStatus("Email verified successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } catch (err) {
        setStatus(
          err.response?.data?.message || "Verification failed."
        );
      }
    };

    if (token) verify();
  }, [token, navigate]);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>{status}</h2>
    </div>
  );
}

export default VerifyEmail;

