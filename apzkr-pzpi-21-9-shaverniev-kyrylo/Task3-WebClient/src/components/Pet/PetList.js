import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Shared/UserContext';
import axiosInstance from '../../api/axiosInstance';  
import styles from '../Shared/List.module.css';

function PetList() {
  const { user } = useUser();  
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axiosInstance.get('/api/pets-list/')
        .then(response => {
          setPets(response.data);
        })
        .catch(error => console.error('Fetch error:', error));
    }
  }, [user]);

  const handleCreatePet = () => {
    navigate('/pets/create');
  };

  return (
    <div className={styles.listContainer}>
      <h1>PETS</h1>
      <button onClick={handleCreatePet} className={styles.createButton}>Create New Pet</button>
      <ul className={styles.list}>
        {pets.map(pet => (
          <li key={pet.id} className={styles.listItem}>
            <span>{pet.name} ({pet.breed})</span>
            <button onClick={() => navigate(`/pets/${pet.id}/details`)}>Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PetList;