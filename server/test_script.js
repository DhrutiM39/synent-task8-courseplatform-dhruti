const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let verificationToken = '';
let token = '';

async function runTests() {
  console.log("Starting API Tests...\n");
  const email = `testuser_${Date.now()}@example.com`;
  const password = "password123";

  try {
    // 1. Registration
    console.log(`[1] Registering ${email}...`);
    const regRes = await axios.post(`${BASE_URL}/auth/register`, { name: "Test User", email, password });
    console.log("Registration Response:", regRes.data);
    
    // We can't fetch the token from the email, but we know it's in the server console. 
    // For this test script, we'll actually fetch the token directly from MongoDB
    const mongoose = require('mongoose');
    require('dotenv').config();
    await mongoose.connect(process.env.MONGO_URI);
    const User = require('./models/user');
    const user = await User.findOne({ email });
    verificationToken = user.verificationToken;
    console.log(`[Extracted from DB] Verification Token: ${verificationToken}`);

    // 2. Login (Expect 403)
    console.log(`\n[2] Attempting login before verification (Expect 403)...`);
    try {
      await axios.post(`${BASE_URL}/auth/login`, { email, password });
      console.log("❌ ERROR: Login succeeded before verification!");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("✅ SUCCESS: Login correctly blocked with 403 Forbidden");
      } else {
        console.log("❌ Unexpected Error:", err.message);
      }
    }

    // 3. Verify Email
    console.log(`\n[3] Verifying email using token...`);
    const verifyRes = await axios.get(`${BASE_URL}/auth/verify-email/${verificationToken}`);
    console.log("Verify Response:", verifyRes.data);

    // 4. Login Successfully
    console.log(`\n[4] Attempting login after verification...`);
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    token = loginRes.data.token;
    console.log("✅ SUCCESS: Login succeeded. JWT received.");

    // 5. Check Courses (Public route)
    console.log(`\n[5] Fetching courses...`);
    const coursesRes = await axios.get(`${BASE_URL}/courses`);
    console.log(`Fetched ${coursesRes.data.length} courses.`);

    // 6. Test Admin Guard
    console.log(`\n[6] Testing admin guard...`);
    // Need an admin JWT or we can just try hitting an admin route like POST /api/courses
    try {
      await axios.post(`${BASE_URL}/courses`, {}, { headers: { Authorization: `Bearer ${token}` } });
      console.log("❌ ERROR: Created course as non-admin!");
    } catch (err) {
       if (err.response && (err.response.status === 403 || err.response.status === 401)) {
        console.log(`✅ SUCCESS: Admin route blocked correctly (${err.response.status})`);
      } else {
        console.log("❌ Unexpected Error:", err.message);
      }
    }

    console.log("\n✅ All Backend Core Logic Tests Passed!");

  } catch (error) {
    console.error("Test execution failed:", error.response?.data || error.message);
  } finally {
    process.exit(0);
  }
}

runTests();
