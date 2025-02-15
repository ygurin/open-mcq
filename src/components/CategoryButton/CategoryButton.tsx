import { FC } from 'react';
import './CategoryButton.css';

interface CategoryButtonProps {
  getCategory: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text: string;
}

const CategoryButton: FC<CategoryButtonProps> = ({ text, getCategory }) => {
  return (
    <div className="CategoryButton">
      <button onClick={getCategory} value={text}>
        {text}
      </button>
    </div>
  );
};

export default CategoryButton;
