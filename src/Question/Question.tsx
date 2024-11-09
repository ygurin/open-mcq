import { FC, useState, useEffect } from 'react';
import './Question.css';

interface QuestionProps {
  heading: string;
  ques: string;
  image?: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const Question: FC<QuestionProps> = ({ 
  heading, 
  ques, 
  image, 
  q1, 
  q2, 
  q3, 
  q4,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext
}) => {
  const [imageError, setImageError] = useState(false);

  // In Vite, we can directly reference files in the public directory using '/'
  const imagePath = image ? `/images/${image}` : '';

  useEffect(() => {
    setImageError(false);
  }, [image]);

  const renderImage = () => {
    if (!image) {
      return null;
    }

    if (imageError) {
      return (
        <div style={{
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          textAlign: 'center',
          color: '#666'
        }}>
          Image not available
        </div>
      );
    }

    return (
      <img
        src={imagePath}
        alt="Question illustration"
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <div className="Question">
      <p>{heading}</p>
      <p>{ques}</p>
      <br />
      <br />
      {renderImage()}
      <br />
      <br />
      <button value={q1}>{q1}</button>
      <br />
      <br />
      <button value={q2}>{q2}</button>
      <br />
      <br />
      <button value={q3}>{q3}</button>
      <br />
      <br />
      <button value={q4}>{q4}</button>
      <br />
      <br />
      <div className="navigation-buttons">
        <button 
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="nav-button"
        >
          Previous
        </button>
        <button 
          onClick={onNext}
          disabled={!hasNext}
          className="nav-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Question;