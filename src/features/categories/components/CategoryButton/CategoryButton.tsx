import { FC } from 'react';
import './CategoryButton.css';

interface CategoryButtonProps {
  onSelectCategory: () => void;
  text: string;
}

const CategoryButton: FC<CategoryButtonProps> = ({ text, onSelectCategory }) => {
  return (
    <div className="CategoryButton">
      <button onClick={onSelectCategory}>
        {text}
      </button>
    </div>
  );
};

export default CategoryButton;