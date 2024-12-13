import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [enteredValues, setEnteredValues] = useState({
    username: '',
    password: ''
  });
  const [didEdit, setDidEdit] = useState({
    username: false,
    password: false
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validateInput = (type, value) => {
    if (type === 'username') {
      if (!value.includes('@')) return 'Please enter a valid email address.';
    } else if (type === 'password') {
      if (value.trim().length < 6) return 'Password must be at least 6 characters long.';
    }
    return ''; // No error
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Final validation before submission
    const usernameError = validateInput('username', enteredValues.username);
    const passwordError = validateInput('password', enteredValues.password);

    if (usernameError || passwordError) {
      setErrorMessage(usernameError || passwordError);
      return;
    }

    try {
      const response = await axios.post('/login', { ...enteredValues }, { withCredentials: true });
      if (response.data.message === 'Login successful') {
        setEnteredValues({ username: '', password: '' });
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
  };

  const handleInputChange = (type, value) => {
    setEnteredValues((prevValue) => ({
      ...prevValue,
      [type]: value
    }));

    // Update error message only if the user has already interacted with the field
    if (didEdit[type]) {
      const error = validateInput(type, value);
      setErrorMessage(error);
    }
  };

  const handleInputBlur = (type) => {
    setDidEdit((prevEdit) => ({
      ...prevEdit,
      [type]: true
    }));

    // Trigger validation on blur
    const error = validateInput(type, enteredValues[type]);
    setErrorMessage(error);
  };

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
              value={enteredValues.username}
              onBlur={() => handleInputBlur('username')}
              onChange={(event) => handleInputChange('username', event.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={enteredValues.password}
              onBlur={() => handleInputBlur('password')}
              onChange={(event) => handleInputChange('password', event.target.value)}
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
};

export default Login;
