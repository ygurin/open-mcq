import { FC } from 'react';
import './CategoryButton.css';

interface CategoryButtonProps {
  onSelectCategory: ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | (() => void);
  text: string;
}

const CategoryButton: FC<CategoryButtonProps> = ({ text, onSelectCategory }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Check if the function expects an event parameter
    if (onSelectCategory.length > 0) {
      // For event handlers (like in PracticeMode)
      (onSelectCategory as (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)(e);
    } else {
      // For simple functions (like in CategoryTest)
      (onSelectCategory as () => void)();
    }
  };

  return (
    <div className="CategoryButton">
      <button 
        onClick={handleClick} 
        value={text}
      >
        {text}
      </button>
    </div>
  );
};

export default CategoryButton;