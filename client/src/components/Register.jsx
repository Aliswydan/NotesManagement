import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Import custom CSS

export default function Register() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/register', { username, password }, { withCredentials: true });

      if (response.data.message === 'Registration successful') {
        localStorage.setItem('isAuthenticated', true);
        navigate('/NotePage');
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="text-center">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="form-group mb-4">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block mb-4 w-100">Register</button>
        </form>
        <hr className="my-4" />

        <div className="text-center mb-4">
          <a className="btn btn-google" href="http://localhost:5000/auth/google" role="button">
            <i className="fab fa-google"></i> Sign Up with Google
          </a>
        </div>

        <p className="text-center">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}