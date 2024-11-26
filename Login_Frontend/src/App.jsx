import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/login', { email_id: email, password });
      setSuccessMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { email });
      setIsOtpSent(true);
      setSuccessMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/reset-password', { email, otp, newPassword });
      setSuccessMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-500">Welcome to CRIC Finder</h1>
        <p className="text-lg text-gray-600">Find Opportunities for Students</p>
      </header>

      <div className="w-full max-w-md p-8 bg-blue-500 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-6">{isForgotPassword ? 'Reset Password' : 'Login'}</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

        {isForgotPassword ? (
          <form onSubmit={isOtpSent ? handleResetPassword : handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none"
            />
            {isOtpSent && (
              <>
                <input
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none"
                />
              </>
            )}
            <button
              type="submit"
              className="w-full bg-white text-blue-500 font-semibold py-2 rounded shadow hover:bg-gray-100"
            >
              {isOtpSent ? 'Reset Password' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-2 rounded border border-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-white text-blue-500 font-semibold py-2 rounded shadow hover:bg-gray-100"
            >
              Login
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-white mt-2">
            Forgot your password?{' '}
            <span onClick={() => setIsForgotPassword(true)} className="underline cursor-pointer">
              Reset
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;



