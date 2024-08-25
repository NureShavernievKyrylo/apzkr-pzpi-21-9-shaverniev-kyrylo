import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ReminderNotification from './ReminderNotification';
import PetDietManagement from './PetDietManagement';
import PetExerciseManagement from './PetExerciseManagement';
import styles from './PetDetail.module.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [dietData, setDietData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextDiet, setNextDiet] = useState(null);
  const [nextExercise, setNextExercise] = useState(null);
  const [diets, setDiets] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [petDiets, setPetDiets] = useState([]);
  const [petExercises, setPetExercises] = useState([]);
  const [currentTemperature, setCurrentTemperature] = useState(null);
  const [showDietGraph, setShowDietGraph] = useState(true);
  const [showExerciseGraph, setShowExerciseGraph] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/api/pets/${id}/`)
      .then(response => {
        setPet(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setLoading(false);
      });

    axiosInstance.get(`/api/pets/${id}/diets/`)
      .then(response => {
        const diets = response.data;
        setDietData(diets);

        const upcomingDiets = diets.filter(diet => new Date(diet.date) > new Date());
        if (upcomingDiets.length > 0) {
          const nextDiet = upcomingDiets.sort((a, b) => new Date(a.date) - new Date(b.date))[0].date;
          setNextDiet(nextDiet);
        } else {
          setNextDiet(null);
        }
      })
      .catch(error => {
        console.error('Fetch diet data error:', error);
      });

    axiosInstance.get(`/api/pets/${id}/exercises/`)
      .then(response => {
        const exercises = response.data;
        const processedExerciseData = exercises.map(item => ({
          ...item,
          duration: parseInt(item.duration.split(':')[0], 10) * 60 + parseInt(item.duration.split(':')[1], 10)
        }));
        setExerciseData(processedExerciseData);

        const upcomingExercises = exercises.filter(exercise => new Date(exercise.date) > new Date());
        if (upcomingExercises.length > 0) {
          const nextExercise = upcomingExercises.sort((a, b) => new Date(a.date) - new Date(b.date))[0].date;
          setNextExercise(nextExercise);
        } else {
          setNextExercise(null);
        }
      })
      .catch(error => {
        console.error('Fetch exercise data error:', error);
      });

    axiosInstance.get('/api/diets/')
      .then(response => {
        setDiets(response.data);
      })
      .catch(error => {
        console.error('Fetch diets error:', error);
      });

    axiosInstance.get('/api/exercises/')
      .then(response => {
        setExercises(response.data);
      })
      .catch(error => {
        console.error('Fetch exercises error:', error);
      });

    axiosInstance.get(`/api/sensors/?pet=${id}&ordering=-timestamp&limit=1`)
      .then(response => {
        if (response.data.length > 0) {
          setCurrentTemperature(response.data[0]);
        }
      })
      .catch(error => {
        console.error('Fetch sensor data error:', error);
      });

  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pet) {
    return <div>Pet not found</div>;
  }

  const handleEdit = () => {
    navigate(`/pets/edit/${id}`);
  };

  const dietChartData = {
    labels: dietData.map(item => item.date),
    datasets: [
      {
        label: 'Feeding Quantity',
        data: dietData.map(item => item.quantity),
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const exerciseChartData = {
    labels: exerciseData.map(item => item.date),
    datasets: [
      {
        label: 'Exercise Duration (minutes)',
        data: exerciseData.map(item => item.duration),
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div className={styles.petDetailContainer}>
      <ReminderNotification nextDiet={nextDiet} nextExercise={nextExercise} />
      <h1>{pet.name}</h1>
      <p>Breed: {pet.breed}</p>
      <p>Age: {pet.age}</p>
      <p>Gender: {pet.gender}</p>
      <p>Weight: {pet.weight} kg</p>
      <h2>Current Temperature</h2>
      {currentTemperature ? (
        <p>Latest recorded temperature: {currentTemperature.temperature}°C at {new Date(currentTemperature.timestamp).toLocaleString()}</p>
      ) : (
        <p>No temperature data available for this pet.</p>
      )}
      <h2>Owner Details</h2>
      {pet.user ? (
        <>
          <p>Full Name: {pet.user.first_name} {pet.user.second_name}</p>
          <p>Phone: {pet.user.phone}</p>
        </>
      ) : (
        <p>Owner information not available</p>
      )}
      <button className={styles.actionButton} onClick={handleEdit}>Edit</button>

      <h2>Feeding Graph</h2>
      <button className={styles.actionButton} onClick={() => setShowDietGraph(!showDietGraph)}>
        {showDietGraph ? 'Hide Feeding Graph' : 'Show Feeding Graph'}
      </button>
      {showDietGraph && (
        <div className={styles.chartContainer}>
          <Line data={dietChartData} />
        </div>
      )}
      <PetDietManagement petId={id} diets={diets} petDiets={petDiets} setPetDiets={setPetDiets} />

      <h2>Exercise Graph</h2>
      <button className={styles.actionButton} onClick={() => setShowExerciseGraph(!showExerciseGraph)}>
        {showExerciseGraph ? 'Hide Exercise Graph' : 'Show Exercise Graph'}
      </button>
      {showExerciseGraph && (
        <div className={styles.chartContainer}>
          <Line data={exerciseChartData} />
        </div>
      )}
      <PetExerciseManagement petId={id} exercises={exercises} petExercises={petExercises} setPetExercises={setPetExercises} />
    </div>
  );
}

export default PetDetail;