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
  const [imageLoading, setImageLoading] = useState(true);

  // In Vite, we can directly reference files in the public directory using '/'
  const imagePath = image ? `/images/${image}` : '';

  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [image]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const renderImage = () => {
    if (!image) return null;

    return (
      <div className="image-container">
        {imageError ? (
          <div className="image-placeholder">
            Image not available
          </div>
        ) : (
          <img
            className="question-image"
            src={imagePath}
            alt="Question illustration"
            onError={() => setImageError(true)}
            onLoad={handleImageLoad}
            style={{ opacity: imageLoading ? 0 : 1 }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="Question">
      <h2 className="question-header">{heading}</h2>
      <div className="question-text-container">
        <p className="question-text">{ques}</p>
      </div>
      {renderImage()}
      <div className="question-options">
        <button className="option-button" value={q1}>{q1}</button>
        <button className="option-button" value={q2}>{q2}</button>
        <button className="option-button" value={q3}>{q3}</button>
        <button className="option-button" value={q4}>{q4}</button>
      </div>
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