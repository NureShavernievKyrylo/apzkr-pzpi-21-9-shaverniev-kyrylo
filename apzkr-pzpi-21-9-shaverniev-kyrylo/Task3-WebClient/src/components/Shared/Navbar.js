import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useUser } from '../Shared/UserContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useUser();  
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [backupStatus, setBackupStatus] = useState('');

  const handleBackupClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPassword('');
    setBackupStatus('');
  };

  const handleBackupSubmit = async () => {
    try {
      const response = await axiosInstance.post('/api/backup/', { password });
      setBackupStatus(response.data.message);
      
      // Close the modal after 5 seconds
      setTimeout(() => {
        handleCloseModal();
      }, 5000);
      
    } catch (error) {
      setBackupStatus('Error: ' + (error.response.data.message || 'An error occurred.'));
    }
  };

  const handleLogout = () => {
    axiosInstance.post('/api/logout/')
      .then(() => {
        logout();
        navigate('/login');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}><Link to="/" className={styles.navLink}>Home</Link></li>
          {user && user.user ? (
            <>
              <li className={styles.navItem}><Link to="/diets" className={styles.navLink}>Diets</Link></li>
              <li className={styles.navItem}><Link to="/pets" className={styles.navLink}>Pets</Link></li>
              <li className={styles.navItem}><Link to="/exercises" className={styles.navLink}>Exercises</Link></li>
              
              {(user.user.role === 'admin' || user.user.role === 'wor') && (
                <li className={styles.navItem}><Link to="/sensors" className={styles.navLink}>Sensors</Link></li>
              )}
              {(user.user.role === 'admin') && (
                <>
                  <li className={styles.navItem}>
                    <button onClick={handleBackupClick} className={styles.navButton}>Backup Database</button>
                  </li>
                </>
              )}
              <li className={styles.navItem}><button onClick={handleLogout} className={styles.navButton}>Logout</button></li>
            </>
          ) : (
            <>
              <li className={styles.navItem}><Link to="/login" className={styles.navLink}>Login</Link></li>
              <li className={styles.navItem}><Link to="/register" className={styles.navLink}>Register</Link></li>
            </>
          )}
        </ul>
      </nav>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={handleCloseModal}>&times;</span>
            <h2 className={styles.modalTitle}>Enter Password for Database Backup</h2>
            <input 
              type="password" 
              placeholder="Enter password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={styles.modalInput}
            />
            <button onClick={handleBackupSubmit} className={styles.modalButton}>Submit</button>
            {backupStatus && <p className={styles.modalStatus}>{backupStatus}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;