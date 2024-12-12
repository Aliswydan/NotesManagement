import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import custom CSS


const Login = () => {
  
  const [enteredValues, SetEnteredValues] = useState({
    username: '' , 
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { ...enteredValues }, { withCredentials: true });
      if (response.data.message === 'Login successful') {
        localStorage.setItem('isAuthenticated', true);  // Store authentication state
        navigate('/NotePage');  // Redirect to NotePage after successful login
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };
  
  function handleInputChange(type , value){
    SetEnteredValues(prevValue => ({
      ...prevValue , 
      [type] : value
    }))
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
              value={enteredValues.username}
              onChange={(event)=> handleInputChange('username' , event.target.value )}
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
              onChange={(event)=> handleInputChange('password' , event.target.value )}
             
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
