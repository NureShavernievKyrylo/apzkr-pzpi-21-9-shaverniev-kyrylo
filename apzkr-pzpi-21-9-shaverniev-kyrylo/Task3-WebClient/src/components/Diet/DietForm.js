import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import styles from '../Shared/Form.module.css';

function DietForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/api/diets/${id}/`)
        .then(response => {
          setFoodType(response.data.food_type);
          setQuantity(response.data.quantity);
          setNotes(response.data.notes || '');
        })
        .catch(error => console.error('Fetch diet data error:', error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axiosInstance.put(`/api/diets/${id}/`, {
          food_type: foodType,
          quantity,
          notes,
        });
      } else {
        await axiosInstance.post('/api/diets/', {
          food_type: foodType,
          quantity,
          notes,
        });
      }
      navigate('/diets');
    } catch (error) {
      console.error('Diet submission error:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>{id ? 'Edit Diet' : 'Create New Diet'}</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="foodType">Food Type:</label>
          <input
            type="text"
            id="foodType"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          {id ? 'Update Diet' : 'Create Diet'}
        </button>
      </form>
    </div>
  );
}

export default DietForm;