import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useUser } from '../Shared/UserContext';
import styles from '../Shared/Detail.module.css';

function DietDetail() {
  const { id } = useParams(); 
  const { user } = useUser();
  const [diet, setDiet] = useState(null);
  const [petDiets, setPetDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/api/diets/${id}/`)
      .then(response => {
        setDiet(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setLoading(false);
      });

    axiosInstance.get(`/api/pet-diets/by-diet/?diet=${id}`)
      .then(response => {
        setPetDiets(response.data);
      })
      .catch(error => console.error('Fetch PetDiet data error:', error));
  }, [id]);

  const handleEdit = () => {
    navigate(`/diets/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/diets/${id}/`);
      navigate('/diets');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!diet) {
    return <div>Diet not found</div>;
  }

  // Correctly access the nested user object for role checking
  const userRole = user?.user?.role;

  return (
    <div className={styles.detailContainer}>
      <h1>Diet Details</h1>
      <p>Food Type: {diet.food_type}</p>
      <p>Quantity: {diet.quantity}</p>
      {diet.notes && <p>Notes: {diet.notes}</p>}

      <h2>Pets using this Diet</h2>
      <ul>
        {petDiets.map(petDiet => (
          <li key={petDiet.id}>
            {petDiet.pet_name} on {petDiet.date} - Quantity: {petDiet.quantity}
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

export default DietDetail;
