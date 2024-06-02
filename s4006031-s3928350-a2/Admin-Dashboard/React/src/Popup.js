import React from 'react';

function Popup({ message, onClose }) {
  return (
    <div style={popupStyle}>
      <div style={popupContentStyle}>
        <span>{message}</span>
        <button onClick={onClose} style={closeButtonStyle}>X</button>
      </div>
    </div>
  );
}

const popupStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  padding: '10px',
  backgroundColor: 'green',
  color: 'white',
  borderRadius: '5px',
  zIndex: 1000,
};

const popupContentStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const closeButtonStyle = {
  marginLeft: '10px',
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer',
};

export default Popup;
