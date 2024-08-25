import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useUser } from '../Shared/UserContext';
import styles from '../Shared/Detail.module.css';

function ExerciseDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const [exercise, setExercise] = useState(null);
  const [petExercises, setPetExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/api/exercises/${id}/`)
      .then(response => {
        setExercise(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setLoading(false);
      });

    axiosInstance.get(`/api/pet-exercises/by-exercise/?exercise=${id}`)
      .then(response => {
        setPetExercises(response.data);
      })
      .catch(error => console.error('Fetch PetExercise data error:', error));
  }, [id]);

  const handleEdit = () => {
    navigate(`/exercises/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/exercises/${id}/`);
      navigate('/exercises');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!exercise) {
    return <div>Exercise not found</div>;
  }

  // Correctly access the nested user object for role checking
  const userRole = user?.user?.role;

  return (
    <div className={styles.detailContainer}>
      <h1>{exercise.exercise_type}</h1>
      <p>Duration: {exercise.duration}</p>

      <h2>Pets using this Exercise</h2>
      <ul>
        {petExercises.map(petExercise => (
          <li key={petExercise.id}>
            {petExercise.pet_name} on {petExercise.date} - Duration: {petExercise.duration}
          </li>
        ))}
      </ul>

      <button onClick={handleEdit}>Edit</button>

      {(userRole === 'admin' || userRole === 'wor') && (
        <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
      )}
    </div>
  );
}

export default ExerciseDetail;