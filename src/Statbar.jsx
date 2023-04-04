import React, { useState } from 'react';
import PlotComponent from 'react-plotly.js';
// import Plot from 'react-plotly';
// import './styles.css';

const Statbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`menu ${isOpen ? 'menu-open' : ''}`} onClick={handleClick}>
      <PlotComponent
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'line', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={{width: 320, height: 240, title: 'A Fancy Plot'}}
      />
        <div className="title2">DATA VISUALISATIONS</div>
        <ul className="nav">
            {/* <div className = 'header'>
                Average Customers Served/h:
            </div> */}
        </ul>
      </div>
        
    </div>
  );
};

export default Statbar;
