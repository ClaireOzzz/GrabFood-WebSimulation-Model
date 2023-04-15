import React, { useState, useEffect } from 'react';
import PlotComponent from 'react-plotly.js';
import{nod} from './Map';

const Statbar = (props) => {

  const [data, setData] = useState([
    {
      x: [] ,
      y: [],
      type: 'curve',
      marker: {color: 'orange'},
      fill: 'tonexty',
      name: 'Customers',
    },
    // {type: 'scatter',marker: {color: 'orange'}, fill: 'tonexty', name: 'Customers', x: [1, 2, 3, 4], y: [2, 5, 3, 4]},
                  
  ]);

  const [data2, setData2] = useState([
    {
      x: [] ,
      y: [],
      type: 'curve',
      marker: {color: 'orange'},
      fill: 'tonexty',
      name: 'Drivers',
    },
    // {type: 'scatter',marker: {color: 'orange'}, fill: 'tonexty', name: 'Customers', x: [1, 2, 3, 4], y: [2, 5, 3, 4]},          
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setData((prevData) => {
        const updatedX = [...prevData[0].x, props.servedCustomers];
        const updatedY = [...prevData[0].y, props.totalTime];
        return [{ ...prevData[0], x: updatedX, y: updatedY }];
      });
    }, 3000);

    document.getElementById('clear').addEventListener('click', () => { 
      setData((prevData) => {
        const updatedX = [0];
        const updatedY = [0];
        return [{ ...prevData[0], x: updatedX, y: updatedY }];
      });
     clearInterval(intervalId);
    });

    return () => clearInterval(intervalId);
  }, [props.servedCustomers, props.totalTime]);

  useEffect(() => {
    const intervalId2 = setInterval(() => {
      setData2((prevData2) => {
        const updatedX2 = [...prevData2[0].x, props.totalTime];
        const updatedY2 = [...prevData2[0].y, props.occupied];
        return [{ ...prevData2[0], x: updatedX2, y: updatedY2 }];
      });
    }, 3000);

    document.getElementById('clear').addEventListener('click', () => { 
      setData2((prevData2) => {
        const updatedX2 = [0];
        const updatedY2 = [0];
        return [{ ...prevData2[0], x: updatedX2, y: updatedY2 }];
      });
      clearInterval(intervalId2);
    });
  
    return () => clearInterval(intervalId2);
  }, [props.occupied,  props.totalTime]);


  const layout = { width: 500, height: 400, title: {text:'Average Customer Waiting Time', x:0.05}, font: {color: '#51ba4c', size:14} , gridwidth:1,
                xaxis: {
                  title:"Number Of Customers",
                  linecolor: '#51ba4c',
                  linewidth: 2,
                  gridcolor:'#51ba4c',
                  mirror: true
                },
                yaxis: {
                  title:"Average Time per Customer (mins)",
                  linecolor: '#51ba4c',
                  linewidth: 2,
                  gridcolor:'#51ba4c',
                  mirror: true
                },
                plot_bgcolor: '#rgba(0,0,0,0)',
                paper_bgcolor: '#rgba(0,0,0,0)'          
  };

  const layout2 = { width: 500, height: 400, title: {text:'Percentage of Occupied Drivers', x:0.05}, font: {color: '#51ba4c', size:14} , gridwidth:1,
                xaxis: {
                  title:"Time (mins)",
                  linecolor: '#51ba4c',
                  linewidth: 2,
                  gridcolor:'#51ba4c',
                  mirror: true
                },
                yaxis: {
                  title:"Occupied Drivers (%)",
                  linecolor: '#51ba4c',
                  linewidth: 2,
                  gridcolor:'#51ba4c',
                  mirror: true
                },
                plot_bgcolor: '#rgba(0,0,0,0)',
                paper_bgcolor: '#rgba(0,0,0,0)'          
  };

  // const handleClear = () => {
  //   setData((prevData) => {
  //     const updatedX = [0];
  //     const updatedY = [0];
  //     return [{ ...prevData[0], x: updatedX, y: updatedY }];
  //   });
  //   setData2((prevData2) => {
  //     const updatedX2 = [0];
  //     const updatedY2 = [0];
  //     return [{ ...prevData2[0], x: updatedX2, y: updatedY2 }];
  //   });
  // };

  const downloadCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + data[0].x.map((xVal, i) => [xVal, data[0].y[i]].join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };            

  function openStats() {
    document.getElementById("menu").style.transform = " translate3d(-95%, 0, 0)";
  }

  const closeStats = () => {
    document.getElementById("menu").style.transform = " translate3d(0.1%, 0, 0)";
  }

  return (
    <div id="menu" className="menu" tabIndex="0" > 
    <div  className="statButtonContain">
      <button className="x-icon" onClick={closeStats}  ></button>
      <button className="downloadButton" id= 'clear' >Clear</button>
      <button className="downloadButton" onClick={downloadCsv}>Download CSV</button>
    </div>
    
    <div className="graph-container">

        <div style={{ width: "70%", height: "100%" }}>
          <PlotComponent data={data} layout={layout} />
        </div>

        <div style={{ width: "70%", height: "100%" }}>
          <PlotComponent data={data2} layout={layout2} />
        </div>

    </div>
    <div className = 'answer'>
    {props.occupied} : {props.unoccupied}
    </div>
   
      <button className="menuButton">
      <div className="title2" onClick={openStats}  >DATA VISUALISATIONS</div>
      </button>

    </div>
  );
};

export default Statbar;