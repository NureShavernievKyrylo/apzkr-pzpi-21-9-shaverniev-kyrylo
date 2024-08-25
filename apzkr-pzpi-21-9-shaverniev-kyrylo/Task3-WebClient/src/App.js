import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import { UserProvider } from './components/Shared/UserContext';
import Login from './components/System/Login';
import Register from './components/System/Register';
import HomePage from './components/System/HomePage';
import PetList from './components/Pet/PetList';
import PetDetail from './components/Pet/PetDetail';
import PetForm from './components/Pet/PetForm';

import DietList from './components/Diet/DietList';
import DietForm from './components/Diet/DietForm';
import DietDetail from './components/Diet/DietDetail';
import ExerciseList from './components/Exercise/ExerciseList';
import ExerciseDetail from './components/Exercise/ExerciseDetail';
import ExerciseForm from './components/Exercise/ExerciseForm';
import SensorDetail from './components/Sensor/SensorDetail';
import SensorList from './components/Sensor/SensorList';
import SensorForm from './components/Sensor/SensorForm';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/:id/details" element={<PetDetail />} />
          <Route path="/pets/create" element={<PetForm />} />
          <Route path="/pets/edit/:id" element={<PetForm />} />
          
          <Route path="/diets" element={<DietList />} />
          <Route path="/diets/create" element={<DietForm />} />
          <Route path="/diets/:id/details" element={<DietDetail />} />
          <Route path="/diets/edit/:id" element={<DietForm />} />
          <Route path="/exercises" element={<ExerciseList />} />
          <Route path="/exercises/:id/details" element={<ExerciseDetail />} />
          <Route path="/exercises/create" element={<ExerciseForm />} />
          <Route path="/exercises/edit/:id" element={<ExerciseForm />} />
          
          {/* Sensor Routes */}
          <Route path="/sensors" element={<SensorList />} />
          <Route path="/sensors/:id/details" element={<SensorDetail />} />
          <Route path="/sensors/create" element={<SensorForm />} />
          <Route path="/sensors/edit/:id" element={<SensorForm />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;