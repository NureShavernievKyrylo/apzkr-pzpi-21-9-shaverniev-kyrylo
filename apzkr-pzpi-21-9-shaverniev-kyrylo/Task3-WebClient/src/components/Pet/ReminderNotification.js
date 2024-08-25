import React, { useEffect, useState } from 'react';
import styles from './ReminderNotification.module.css';

const ReminderNotification = ({ nextDiet, nextExercise }) => {
  const [showDietNotification, setShowDietNotification] = useState(false);
  const [showExerciseNotification, setShowExerciseNotification] = useState(false);

  useEffect(() => {
    if (nextDiet) {
      setShowDietNotification(true);
      setTimeout(() => setShowDietNotification(false), 10000);  // Increase to 10 seconds
    }
    if (nextExercise) {
      setShowExerciseNotification(true);
      setTimeout(() => setShowExerciseNotification(false), 10000);  // Increase to 10 seconds
    }
  }, [nextDiet, nextExercise]);

  return (
    <div className={styles.notificationContainer}>
      {showDietNotification && (
        <div className={styles.notification}>
          {nextDiet ? `Next feeding is scheduled on ${nextDiet}` : 'No upcoming feeding scheduled.'}
        </div>
      )}
      {showExerciseNotification && (
        <div className={styles.notification}>
          {nextExercise ? `Next exercise is scheduled on ${nextExercise}` : 'No upcoming exercise scheduled.'}
        </div>
      )}
    </div>
  );
};

export default ReminderNotification;