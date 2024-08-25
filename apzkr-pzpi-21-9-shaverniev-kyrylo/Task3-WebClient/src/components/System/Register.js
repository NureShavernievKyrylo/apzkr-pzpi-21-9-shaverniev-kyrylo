import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { fetchCsrfToken } from '../../api/csrf';
import { useUser } from '../Shared/UserContext';
import styles from './auth.module.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');  
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    const setCsrfToken = async () => {
      await fetchCsrfToken();
    };
    setCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axiosInstance.post('/api/register/', {
        email,
        password,
        first_name: firstName,
        second_name: secondName,
        phone,
        address
      });
      if (response.status === 201 && response.data) {
        login({ email: response.data.email, role: response.data.role });
        navigate('/');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <h1 className={styles.title}>LeashBuddy</h1>
      <label>
        First Name:
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <label>
        Second Name:
        <input type="text" value={secondName} onChange={(e) => setSecondName(e.target.value)} />
      </label>
      <label>
        Phone:
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <label>
        Address:
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label>
        Confirm Password:
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </label>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit">Register</button>
      <div className={styles.linkContainer}>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </form>
  );
};

export default Register;