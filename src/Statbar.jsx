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

      <div className="graph-container">
        <div className="graph">
          <PlotComponent
            data={[
              {
                x: [1, 2, 3],
                y: [2, 6, 3],
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'orange'},
              },
              {type: 'line', x: [1, 2, 3], y: [2, 5, 3]},
            ]}
            layout={{ width: 533, height: 400, title: {text:'A Fancy Plot', x:0.05}, font: {color: '#51ba4c', size:14} , gridwidth:1,
            xaxis: {
              title:"Time",
              linecolor: '#51ba4c',
              linewidth: 2,
              gridcolor:'#51ba4c',
              mirror: true
            },
            yaxis: {
              title:"Customers",
              linecolor: '#51ba4c',
              linewidth: 2,
              gridcolor:'#51ba4c',
              mirror: true
            },
            plot_bgcolor: '#rgba(0,0,0,0)',
            paper_bgcolor: '#rgba(0,0,0,0)'
          
          }}
        />
        </div>
        
        <div className="graph">
        <PlotComponent
            data={[
              {type: 'bar',marker: {color: 'rgba(255, 167, 14, 0.6)'}, fill: 'tonexty', name: 'Customers', x: [1, 2, 3, 4], y: [2, 5, 3, 4]},
            ]}
            // plot_bgcolor:'#17381a', paper_bgcolor:'#17381a'
            layout={{ width: 533, height: 400, title: {text:'A Fancy Plot', x:0.05}, font: {color: '#51ba4c', size:14} , gridwidth:1,
              xaxis: {
                title:"Time",
                linecolor: '#51ba4c',
                linewidth: 2,
                gridcolor:'#51ba4c',
                mirror: true
              },
              yaxis: {
                title:"Customers",
                linecolor: '#51ba4c',
                linewidth: 2,
                gridcolor:'#51ba4c',
                mirror: true
              },
              plot_bgcolor: '#rgba(0,0,0,0)',
              paper_bgcolor: '#rgba(0,0,0,0)'
            
            }}
          />
        </div>
      </div>

      <div className="graph-container">
        <div className="graph" >
          <PlotComponent
            data={[
              // {
              //   x: [1, 2, 3],
              //   y: [2, 6, 3],
              //   type: 'scatter',
              //   mode: 'lines+markers',
              //   marker: {color: 'orange'}
              // },
              {type: 'line',marker: {color: 'orange'}, fill: 'tonexty', name: 'Customers', x: [1, 2, 3, 4], y: [2, 5, 3, 4]},
            ]}
            // plot_bgcolor:'#17381a', paper_bgcolor:'#17381a'
            layout={{ width: 533, height: 400, title: {text:'A Fancy Plot', x:0.05}, font: {color: '#51ba4c', size:14} , gridwidth:1,
              xaxis: {
                title:"Time",
                linecolor: '#51ba4c',
                linewidth: 2,
                gridcolor:'#51ba4c',
                mirror: true
              },
              yaxis: {
                title:"Customers",
                linecolor: '#51ba4c',
                linewidth: 2,
                gridcolor:'#51ba4c',
                mirror: true
              },
              plot_bgcolor: '#rgba(0,0,0,0)',
              paper_bgcolor: '#rgba(0,0,0,0)'
            
            }}
          />
        </div>
        
        <div className="graph">
          <PlotComponent
            data={[
              {
                x: [1, 2, 3],
                y: [2, 6, 3],
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'orange'},
              },
              {type: 'bar',marker: {color: 'rgba(255, 167, 14, 0.6)'}, fill: 'tonexty', x: [1, 2, 3], y: [2, 5, 3]},
            ]}
            layout={{ width: 533, height: 400, title: {text:'A Fancy Plot', x:0.05}, font: {color: '#51ba4c', size:14} , gridwidth:1,
            xaxis: {
              title:"Time",
              linecolor: '#51ba4c',
              linewidth: 2,
              gridcolor:'#51ba4c',
              mirror: true
            },
            yaxis: {
              title:"Customers",
              linecolor: '#51ba4c',
              linewidth: 2,
              gridcolor:'#51ba4c',
              mirror: true
            },
            plot_bgcolor: '#rgba(0,0,0,0)',
            paper_bgcolor: '#rgba(0,0,0,0)'
          
          }}
        />
        </div>
      </div>
        

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
