import React from 'react';
import '../styles/modal.css';

const Modal = ({ onAllow, onDeny }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h1>Location Permission</h1>
        <p>We need your permission to access your location to display weather data.</p>
        <button onClick={onAllow}>Allow</button>
        <button onClick={onDeny}>Deny</button>
      </div>
    </div>
  );
};

export default Modal;
