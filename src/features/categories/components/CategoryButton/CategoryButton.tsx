import { FC } from 'react';
import './CategoryButton.css';

interface CategoryButtonProps {
  onSelectCategory: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text: string;
}

const CategoryButton: FC<CategoryButtonProps> = ({ text, onSelectCategory }) => {
  return (
    <div className="CategoryButton">
      <button onClick={onSelectCategory} value={text}>
        {text}
      </button>
    </div>
  );
};

export default CategoryButton;