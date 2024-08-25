import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import styles from './PetExerciseManagement.module.css';

function PetExerciseManagement({ petId, exercises, petExercises, setPetExercises }) {
  const [showPetExerciseForm, setShowPetExerciseForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseDate, setExerciseDate] = useState('');
  const [averageExercise, setAverageExercise] = useState(null); // State to store average exercise

  useEffect(() => {
    // Fetch the average exercise value
    axiosInstance.get(`/api/pets/${petId}/average-exercise/`)
      .then(response => {
        setAverageExercise(response.data.average_exercise);
      })
      .catch(error => {
        console.error('Fetch average exercise error:', error);
      });
  }, [petId]);

  const handleCreatePetExercise = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/pet-exercises/', {
        pet: petId,
        exercise: selectedExercise,
        date: exerciseDate
      });
      setPetExercises([...petExercises, response.data]);
      setSelectedExercise('');
      setExerciseDate('');
    } catch (error) {
      console.error('Create pet exercise error:', error);
    }
  };

  const handleDeletePetExercise = async (petExerciseId) => {
    try {
      await axiosInstance.delete(`/api/pet-exercises/${petExerciseId}/`);
      setPetExercises(petExercises.filter(pe => pe.id !== petExerciseId));
    } catch (error) {
      console.error('Delete pet exercise error:', error);
    }
  };

  return (
    <div className={styles.exerciseManagementContainer}>
      <h2>Exercise Management</h2>
      <p>Average Exercise Duration: {averageExercise !== null ? `${averageExercise.toFixed(2)} minutes` : 'No data available'}</p> {/* Display average exercise */}
      <button onClick={() => setShowPetExerciseForm(!showPetExerciseForm)}>
        {showPetExerciseForm ? 'Hide Exercise Management' : 'Show Exercise Management'}
      </button>
      {showPetExerciseForm && (
        <div>
          <form onSubmit={handleCreatePetExercise}>
            <label htmlFor="exerciseSelect">Select Exercise:</label>
            <select
              id="exerciseSelect"
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              <option value="">-- Select Exercise --</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.exercise_type}
                </option>
              ))}
            </select>
            <label htmlFor="exerciseDate">Select Date:</label>
            <input
              type="date"
              id="exerciseDate"
              value={exerciseDate}
              onChange={(e) => setExerciseDate(e.target.value)}
              required
            />
            <button type="submit">Add Exercise</button>
          </form>
          <h3>Current Pet Exercise Records</h3>
          <ul>
            {petExercises.map((petExercise) => (
              <li key={petExercise.id}>
                {petExercise.date} - {petExercise.exercise_type} - Duration: {petExercise.duration} minutes
                <button onClick={() => handleDeletePetExercise(petExercise.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PetExerciseManagement;