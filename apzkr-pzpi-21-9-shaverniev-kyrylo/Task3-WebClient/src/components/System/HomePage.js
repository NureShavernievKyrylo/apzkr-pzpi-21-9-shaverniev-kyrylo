import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Shared/UserContext';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={styles.homePageContainer}>
      <h1>Welcome to LeashBuddy</h1>
      <p>
        Welcome to the Pet Care Management System, your all-in-one solution for keeping track of your pets' health and activities.
        This system allows you to:
      </p>
      <ul>
        <li>Monitor and manage your pet's diet with detailed records of their feeding schedule and quantities.</li>
        <li>Track your pet's exercise routines to ensure they are getting the right amount of activity.</li>
        <li>Measure and record your pet's temperature using sensors to keep an eye on their health status.</li>
        <li>Maintain comprehensive records about your pet, including personal information, medical history, and more.</li>
      </ul>
      <div className={styles.buttonContainer}>
        <button onClick={() => handleRedirect('/diets')} className={styles.linkButton}>Manage Diets</button>
        <button onClick={() => handleRedirect('/exercises')} className={styles.linkButton}>Manage Exercises</button>
        <button onClick={() => handleRedirect('/pets')} className={styles.linkButton}>View Pets</button>
        <button onClick={() => handleRedirect('/sensors')} className={styles.linkButton}>View Sensors</button>
      </div>
    </div>
  );
}

export default HomePage;