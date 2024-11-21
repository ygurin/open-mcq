import React from 'react';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Quit to Menu</h3>
        <p className="modal-message">Are you sure you want to quit to the menu?</p>
        <div className="modal-buttons">
          <button 
            onClick={onClose}
            className="nav-button"
          >
            No
          </button>
          <button 
            onClick={onConfirm}
            className="nav-button"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;