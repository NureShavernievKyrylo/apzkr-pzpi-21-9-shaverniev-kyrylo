import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useUser } from '../Shared/UserContext';
import styles from '../Shared/Detail.module.css';

function SensorDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const [sensor, setSensor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/api/sensors/${id}/`)
      .then(response => {
        setSensor(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    navigate(`/sensors/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/sensors/${id}/`);
      navigate('/sensors');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!sensor) {
    return <div>Sensor not found</div>;
  }

  
  const userRole = user?.user?.role;

  return (
    <div className={styles.detailContainer}>
      <h1>Sensor Details</h1>
      <p>Temperature: {sensor.temperature}°C</p>
      <p>Timestamp: {sensor.timestamp}</p>
      {sensor.pet && <p>Pet: {sensor.pet.name}</p>}

      <button onClick={handleEdit}>Edit</button>

      {(userRole === 'admin' || userRole === 'wor') && (
        <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
      )}
    </div>
  );
}

export default SensorDetail;