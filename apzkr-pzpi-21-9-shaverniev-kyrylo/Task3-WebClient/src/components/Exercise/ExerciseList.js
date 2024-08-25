import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import styles from '../Shared/List.module.css';

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/api/exercises/')
      .then(response => {
        setExercises(response.data);
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const handleCreateNewExercise = () => {
    navigate('/exercises/create');
  };

  return (
    <div className={styles.listContainer}>
      <h1>EXERCISES</h1>
      <button onClick={handleCreateNewExercise} className={styles.createButton}>Create New Exercise</button>
      <ul className={styles.list}>
        {exercises.map(exercise => (
          <li key={exercise.id} className={styles.listItem}>
            <span>{exercise.exercise_type} - Duration: {exercise.duration}</span>
            <button onClick={() => navigate(`/exercises/${exercise.id}/details`)}>Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExerciseList;