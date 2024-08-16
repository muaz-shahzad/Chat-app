import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { name, email, password };

    try {
      const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setName("");
        setEmail("");
        setPassword("");
        setPasswordStrength("");
        setTimeout(() => {
          navigate('/login');
        }, 6000); // 3 seconds delay
      } else {
        toast.error(data.message || 'An error occurred');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);

    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/;

    if (passwordPattern.test(password)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('weak');
    }
  };

  const isFormValid = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/;
    return name && emailPattern.test(email) && passwordPattern.test(password);
  };

  return (
    <div className="container mx-auto mt-5">
      <div className="max-w-md mx-auto bg-white p-5 border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl text-blue-600 font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label block text-left">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label block text-left">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label block text-left">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {password && (
              <div className={`mt-2 ${passwordStrength === 'weak' ? 'text-red-500' : 'text-green-500'}`}>
                {passwordStrength === 'weak' ? 'Weak password' : 'Strong password'}
              </div>
            )}
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isFormValid()}
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
