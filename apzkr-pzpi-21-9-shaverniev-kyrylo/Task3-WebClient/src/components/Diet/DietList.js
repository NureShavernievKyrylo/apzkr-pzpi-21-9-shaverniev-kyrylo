import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import styles from '../Shared/List.module.css';

function DietList() {
  const [diets, setDiets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/api/diets/')
      .then(response => {
        setDiets(response.data);
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const handleCreateNewDiet = () => {
    navigate('/diets/create');
  };

  return (
    <div className={styles.listContainer}>
      <h1>DIETS</h1>
      <button onClick={handleCreateNewDiet} className={styles.createButton}>Create New Diet</button>
      <ul className={styles.list}>
        {diets.map(diet => (
          <li key={diet.id} className={styles.listItem}>
            <span>{diet.food_type} - {diet.quantity} g</span>
            <Link to={`/diets/${diet.id}/details`}>Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DietList;