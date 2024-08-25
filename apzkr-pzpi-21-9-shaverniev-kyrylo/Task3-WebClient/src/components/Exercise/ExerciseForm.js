import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import styles from '../Shared/Form.module.css';

function ExerciseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState({
    exercise_type: '',
    duration: ''
  });

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/api/exercises/${id}/`)
        .then(response => {
          setExercise(response.data);
        })
        .catch(error => console.error('Fetch error:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    setExercise({
      ...exercise,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      axiosInstance.put(`/api/exercises/${id}/`, exercise)
        .then(response => {
          navigate(`/exercises/${id}/details`);
        })
        .catch(error => console.error('Submit error:', error));
    } else {
      axiosInstance.post('/api/exercises/', exercise)
        .then(response => {
          navigate('/exercises');
        })
        .catch(error => console.error('Submit error:', error));
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>{id ? 'Edit Exercise' : 'Create Exercise'}</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="exercise_type">Exercise Type:</label>
          <input
            type="text"
            id="exercise_type"
            name="exercise_type"
            value={exercise.exercise_type}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="duration">Duration:</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={exercise.duration}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          {id ? 'Update Exercise' : 'Create Exercise'}
        </button>
      </form>
    </div>
  );
}

export default ExerciseForm;