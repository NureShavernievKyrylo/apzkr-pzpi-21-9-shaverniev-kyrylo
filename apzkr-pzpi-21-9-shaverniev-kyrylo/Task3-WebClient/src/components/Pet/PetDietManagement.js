import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import styles from './PetDietManagement.module.css';

function PetDietManagement({ petId, diets, petDiets, setPetDiets }) {
  const [showPetDietForm, setShowPetDietForm] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState('');
  const [dietDate, setDietDate] = useState('');

  const handleCreatePetDiet = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/pet-diets/', {
        pet: petId,
        diet: selectedDiet,
        date: dietDate
      });
      setPetDiets([...petDiets, response.data]);
      setSelectedDiet('');
      setDietDate('');
    } catch (error) {
      console.error('Create pet diet error:', error);
    }
  };

  const handleDeletePetDiet = async (petDietId) => {
    try {
      await axiosInstance.delete(`/api/pet-diets/${petDietId}/`);
      setPetDiets(petDiets.filter(pd => pd.id !== petDietId));
    } catch (error) {
      console.error('Delete pet diet error:', error);
    }
  };

 

  return (
    <div className={styles.dietManagementContainer}>
      <h2>Diet Management</h2>
      <button onClick={() => setShowPetDietForm(!showPetDietForm)}>
        {showPetDietForm ? 'Hide Diet Management' : 'Show Diet Management'}
      </button>
      {showPetDietForm && (
        <div>
          <form onSubmit={handleCreatePetDiet}>
            <label htmlFor="dietSelect">Select Diet:</label>
            <select
              id="dietSelect"
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
            >
              <option value="">-- Select Diet --</option>
              {diets.map((diet) => (
                <option key={diet.id} value={diet.id}>
                  {diet.food_type}
                </option>
              ))}
            </select>
            <label htmlFor="dietDate">Select Date:</label>
            <input
              type="date"
              id="dietDate"
              value={dietDate}
              onChange={(e) => setDietDate(e.target.value)}
              required
            />
            <button type="submit">Add Diet</button>
          </form>
          <h3>Current Pet Diet Records</h3>
          <ul>
            {petDiets.map((petDiet) => (
              <li key={petDiet.id}>
                {petDiet.date} - {petDiet.diet_food_type} - Quantity: {petDiet.quantity}
                <button onClick={() => handleDeletePetDiet(petDiet.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PetDietManagement;