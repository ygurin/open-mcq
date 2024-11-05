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
}

const Question: FC<QuestionProps> = ({ heading, ques, image, q1, q2, q3, q4 }) => {
  const [imageError, setImageError] = useState(false);

  // Reset error state when image prop changes
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

    const imagePath = `/images/${image}`;

    return (
      <img
        src={imagePath}
        alt="Question illustration"
        onError={() => setImageError(true)}
        style={{ maxWidth: '100%', height: 'auto' }}
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
    </div>
  );
};

export default Question;