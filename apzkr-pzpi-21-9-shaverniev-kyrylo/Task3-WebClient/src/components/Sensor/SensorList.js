import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import styles from '../Shared/List.module.css';

function SensorList() {
  const [sensors, setSensors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/api/sensors/')
      .then(response => {
        setSensors(response.data);
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const handleCreateNewSensor = () => {
    navigate('/sensors/create');
  };

  return (
    <div className={styles.listContainer}>
      <h1>SENSORS</h1>
      <button onClick={handleCreateNewSensor} className={styles.createButton}>Create New Sensor</button>
      <ul className={styles.list}>
        {sensors.map(sensor => (
          <li key={sensor.id} className={styles.listItem}>
            <span>Sensor at {sensor.timestamp} - Temperature: {sensor.temperature}°C</span>
            <Link to={`/sensors/${sensor.id}/details`}>Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SensorList;