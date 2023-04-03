import React, { useState } from 'react';
// import './styles.css';

const Statbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`menu ${isOpen ? 'menu-open' : ''}`} onClick={handleClick}>
        <div className="title2">DATA VISUALISATIONS</div>
        <ul className="nav">
            <div className = 'header'>
                Average Customers Served/h:
            </div>
        </ul>
      </div>

    </div>
  );
};

export default Statbar;
