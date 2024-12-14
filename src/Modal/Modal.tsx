// src/Modal/Modal.tsx
import React from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;  // Make message optional
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  message = "Are you sure you want to quit to the menu?" // Default message
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Quit to Menu</h3>
        <p className="modal-message">{message}</p>
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