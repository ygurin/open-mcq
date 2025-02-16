import React, { useState, useEffect } from 'react';
import './ExamTimer.css';

interface ExamTimerProps {
  onTimeUp: () => void;
  totalMinutes: number;
}

const ExamTimer: React.FC<ExamTimerProps> = ({ onTimeUp, totalMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getColorClass = () => {
    if (timeLeft <= 300) return 'timer-critical'; // Last 5 minutes
    if (timeLeft <= 600) return 'timer-warning'; // Last 10 minutes
    return 'timer-normal';
  };

  return (
    <div className={`exam-timer ${getColorClass()}`}>
      Time Remaining: {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default ExamTimer;