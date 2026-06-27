import "../ResetPassword.css";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {

const { token } = useParams();

const navigate = useNavigate();

const [password, setPassword] = useState("");

const handleReset = async (e) => {

e.preventDefault();

try {

await axios.post(
`http://localhost:5000/api/auth/reset-password/${token}`,
{
password,
}
);

alert("Password Updated Successfully");

navigate("/login");

} catch (error) {

alert(error.response?.data?.message);

}

};

return (

<div className="reset-container">

<form
className="reset-card"
onSubmit={handleReset}
>

<h2>Reset Password</h2>

<input
type="password"
placeholder="Enter New Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button type="submit">
Update Password
</button>

</form>

</div>

);

}

export default ResetPassword;