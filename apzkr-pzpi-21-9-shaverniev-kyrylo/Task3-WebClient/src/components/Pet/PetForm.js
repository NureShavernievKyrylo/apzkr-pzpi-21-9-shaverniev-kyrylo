import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useUser } from '../Shared/UserContext';
import styles from '../Shared/Form.module.css';

function PetForm() {
  const { id } = useParams();
  const { user } = useUser();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [owner, setOwner] = useState('');
  const [owners, setOwners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of owners
    axiosInstance.get('/api/users/')
      .then(response => {
        setOwners(response.data);
      })
      .catch(error => console.error('Fetch error:', error));

    if (id) {
      axiosInstance.get(`/api/pets/${id}/`)
        .then(response => {
          const pet = response.data;
          setName(pet.name);
          setBreed(pet.breed);
          setAge(pet.age);
          setGender(pet.gender);
          setWeight(pet.weight);
          setOwner(pet.owner.id);
        })
        .catch(error => console.error('Fetch error:', error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const petData = { name, breed, age, gender, weight, owner };

    try {
      if (id) {
        await axiosInstance.put(`/api/pets/${id}/`, petData);
      } else {
        await axiosInstance.post('/api/pets/', petData);
      }
      navigate('/pets');
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>{id ? 'Edit Pet' : 'Create Pet'}</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="breed">Breed:</label>
          <input
            type="text"
            id="breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="gender">Gender:</label>
          <input
            type="text"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        {(user.role === 'worker' || user.role === 'admin') && (
          <div className={styles.formGroup}>
            <label htmlFor="owner">Owner:</label>
            <select
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            >
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.first_name} {owner.second_name} ({owner.email})
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" className={styles.submitButton}>
          {id ? 'Update Pet' : 'Create Pet'}
        </button>
      </form>
    </div>
  );
}

export default PetForm;