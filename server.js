// server.js
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Your Twilio credentials
const TWILIO_SID = 'ACeecf03134fae812a7ca4e05de2628d54'; // SID
const TWILIO_AUTH_TOKEN = '052ff19030c18109758a4d200dce6aa4'; // Auth Token
const TWILIO_PHONE_NUMBER = '+12765959796'; // Twilio phone number

const client = new twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;  // Expecting phone number in body

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);  // Generate 6-digit OTP
    const message = `Your OTP code is: ${otp}`;

    // Send OTP via SMS using Twilio
    await client.messages.create({
      body: message,
      to: phoneNumber,
      from: TWILIO_PHONE_NUMBER,
    });

    // In a real app, store OTP in session or database for later verification
    // For simplicity, we'll just send it back in the response
    res.status(200).json({ otp });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Endpoint to verify OTP (you'll need to adjust for real apps, such as using a database to store OTPs)
app.post('/verify-otp', (req, res) => {
  const { otp, userOtp } = req.body;

  if (otp === userOtp) {
    res.status(200).json({ message: 'OTP Verified Successfully' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
