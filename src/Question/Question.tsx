import { FC } from 'react';
import './Question.css';

interface QuestionProps {
  heading: string;
  ques: string;
  image: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

const Question: FC<QuestionProps> = ({ heading, ques, image, q1, q2, q3, q4 }) => {
  return (
    <div className="Question">
      <p>{heading}</p>
      <p>{ques}</p>
      <br />
      <br />
      <img src={process.env.PUBLIC_URL + '/images/' + image} alt="description" />
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
