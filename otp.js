import { useState } from 'react';
import { Text, View, TextInput, Button } from 'react-native';

const OtpPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      alert('Please enter a phone number');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtp(data.otp); // Save OTP in state (for demonstration purposes)
        setOtpSent(true);
        alert(OTP sent to ${phoneNumber});
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!userOtp) {
      alert('Please enter the OTP');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, userOtp }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpVerified(true);
        alert('OTP Verified Successfully!');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Use Text component instead of h1 */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Phone OTP Authentication</Text>

      {!otpSent && (
        <View>
          <TextInput
            style={{ padding: 10, marginBottom: 10, borderWidth: 1 }}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
          />
          <Button title="Send OTP" onPress={handleSendOtp} />
        </View>
      )}

      {otpSent && !otpVerified && (
        <View>
          <TextInput
            style={{ padding: 10, marginBottom: 10, borderWidth: 1 }}
            value={userOtp}
            onChangeText={setUserOtp}
            placeholder="Enter OTP"
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} />
        </View>
      )}

      {otpVerified && <Text>OTP Verified! You're authenticated.</Text>}
    </View>
  );
};

export default OtpPage;
