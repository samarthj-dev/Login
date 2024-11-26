
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const dummyDatabase = {
  "samarthj.intern@lawsikho.in": {
    email_id: "samarthj.intern@lawsikho.in",
    password: "123",
    name: "Test User"
  },
  "shreya.srivastava@lawsikho.in": {
    email_id: "shreya.srivastava@lawsikho.in",
    password: "123",
    name: "Test User"
  }
};


let otpStore = {
  otp: null,
  email: null
};


const validateDomain = (email_id) => {
  return email_id.endsWith('@lawsikho.in') || email_id.endsWith('@skillarbitrage.in');
};


app.post('/login', async (req, res) => {
  const { email_id, password } = req.body;

  if (!validateDomain(email_id)) {
    return res.status(400).json({ message: 'Login is restricted to specific domains.' });
  }

  try {
    const user = dummyDatabase[email_id];
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!validateDomain(email)) {
    return res.status(400).json({ message: 'Email domain is restricted.' });
  }

  
  if (!dummyDatabase[email]) {
    return res.status(400).json({ message: 'Email not found in database' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore = { otp, email };

  try {
    const response = await axios.post('https://us-central1-cric-proeject-aether.cloudfunctions.net/cric_emailOTP', {
      to_email_id: email,
      name: dummyDatabase[email].name || "User",
      otp,
    });

    console.log("OTP sent to user:", response.data);
    res.status(200).json({ message: 'OTP has been sent to your email.' });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: 'Error sending OTP email.' });
  }
});


app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (otpStore.otp === otp && otpStore.email === email) {
    try {
      if (dummyDatabase[email]) {
        dummyDatabase[email].password = newPassword;
        otpStore = { otp: null, email: null };  
        res.status(200).json({ message: 'Password reset successful!' });
      } else {
        res.status(400).json({ message: 'Email not found in database' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating password' });
    }
  } else {
    res.status(400).json({ message: 'Invalid OTP or email' });
  }
});


app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
