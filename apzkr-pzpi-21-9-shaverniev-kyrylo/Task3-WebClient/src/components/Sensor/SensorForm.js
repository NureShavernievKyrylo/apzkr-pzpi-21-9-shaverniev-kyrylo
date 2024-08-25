import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import styles from '../Shared/Form.module.css';

function SensorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensor, setSensor] = useState({
    pet: '',
    temperature: ''
  });
  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/api/sensors/${id}/`)
        .then(response => {
          setSensor(response.data);
        })
        .catch(error => console.error('Fetch error:', error));
    }

    axiosInstance.get('/api/pets/')
      .then(response => {
        setPets(response.data);
      })
      .catch(error => console.error('Fetch error:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSensor(prevSensor => ({
      ...prevSensor,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      axiosInstance.put(`/api/sensors/${id}/`, sensor)
        .then(response => {
          navigate(`/sensors/${id}/details`);
        })
        .catch(error => console.error('Submit error:', error));
    } else {
      axiosInstance.post('/api/sensors/', sensor)
        .then(response => {
          navigate('/sensors');
        })
        .catch(error => console.error('Submit error:', error));
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>{id ? 'Edit Sensor' : 'Create Sensor'}</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="pet">Pet:</label>
          <select
            id="pet"
            name="pet"
            value={sensor.pet || ''}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Pet --</option>
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="temperature">Temperature:</label>
          <input
            type="number"
            id="temperature"
            name="temperature"
            value={sensor.temperature}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          {id ? 'Update Sensor' : 'Create Sensor'}
        </button>
      </form>
    </div>
  );
}

export default SensorForm;