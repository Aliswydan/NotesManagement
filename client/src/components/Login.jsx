import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import useInput from '../hook/useInput';

export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Validation functions return error messages if invalid
  function validateEmail(value) {
    return value.includes('@') ? '' : 'Please enter a valid email address.';
  }

  function validatePass(value) {
    return value.trim().length >= 6 ? '' : 'Password must be at least 6 characters long.';
  }

  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailError,
  } = useInput('', validateEmail, setErrorMessage);

  const {
    value: passValue,
    handleInputChange: handlePassChange,
    handleInputBlur: handlePassBlur,
    hasError: passError,
  } = useInput('', validatePass, setErrorMessage);

  async function handleLogin(e) {
    e.preventDefault();

    // Validate inputs before making API call
    if (emailError || passError) {
      setErrorMessage(validateEmail(emailValue) || validatePass(passValue));
      return;
    }

    try {
      const response = await axios.post(
        '/login',
        { username: emailValue, password: passValue },
        { withCredentials: true }
      );
      if (response.data.message === 'Login successful') {
        localStorage.setItem('isAuthenticated', true); // Store authentication state
        navigate('/NotePage'); // Redirect to NotePage after successful login
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-4">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              id="email"
              className="form-control"
              value={emailValue}
              onBlur={handleEmailBlur}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={passValue}
              onBlur={handlePassBlur}
              onChange={handlePassChange}
              required
            />
          </div>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block mb-4 w-100">Login</button>
        </form>

        <hr className="my-4" />

        <div className="text-center mb-4">
          <a className="btn btn-google" href="http://localhost:5000/auth/google" role="button">
            <i className="fab fa-google"></i> Sign In with Google
          </a>
        </div>

        <p className="text-center">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
