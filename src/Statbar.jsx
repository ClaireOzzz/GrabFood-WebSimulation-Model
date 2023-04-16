import React, { useState, useEffect } from 'react';
import PlotComponent from 'react-plotly.js';
import{nod} from './Map';

const Statbar = (props) => {

  const [data, setData] = useState([
    {
      x: [] ,
      y: [],
      type: 'scatter', 
      line: { 
        shape: 'spline',  
        smoothing: 2}, 
      mode: 'lines+markers',  
      marker: {color: 'orange'}, 
      //fill: 'tonexty', 
      name: 'Customers',
    },            
  ]);

  const [data2, setData2] = useState([
    {
      x: [] ,
      y: [],
      type: 'scatter', 
      line: { 
        shape: 'spline',  
        smoothing: 2}, 
      mode: 'lines+markers',  
      marker: {color: 'orange'}, 
      //fill: 'tonexty', 
      name: 'Drivers',
    },       
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setData((prevData) => {
        const updatedX = [...prevData[0].x, props.totalCustomers];
        const updatedY = [...prevData[0].y, props.totalTime];
        return [{ ...prevData[0], x: updatedX, y: updatedY }];
      });
    }, 100);

    document.getElementById('clear').addEventListener('click', () => { 
      setData((prevData) => {
        const updatedX = [0];
        const updatedY = [0];
        return [{ ...prevData[0], x: updatedX, y: updatedY }];
      });
     clearInterval(intervalId);
    });

    return () => clearInterval(intervalId);
  }, [props.totalCustomers, props.totalTime]);

  useEffect(() => {
    const intervalId2 = setInterval(() => {
      setData2((prevData2) => {
        const updatedX2 = [...prevData2[0].x, props.totalTime];
        const updatedY2 = [...prevData2[0].y, (props.occupied/nod)*100];
        return [{ ...prevData2[0], x: updatedX2, y: updatedY2 }];
      });
    }, 100);

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
                plot_bgcolor: '#rgba(84, 145, 81,0.5)',
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
                plot_bgcolor: '#rgba(84, 145, 81,0.5)',
                paper_bgcolor: '#rgba(0,0,0,0)'          
  };

  const downloadCsv = (datas, filenames) => {
    datas.forEach((data, i) => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + data.x.map((xVal, j) => [xVal, data.y[j]].join(',')).join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filenames[i]);
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
    });
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
      <button className="downloadButton" onClick={() => downloadCsv([data[0], data2[0]], ['graph1.csv', 'graph2.csv'])} >Download CSV</button>
    </div>
    
    <div className="graph-container">

        <div style={{ width: "70%", height: "100%" }}>
          <PlotComponent data={data} layout={layout} />
        </div>

        <div style={{ width: "70%", height: "100%" }}>
          <PlotComponent data={data2} layout={layout2} />
        </div>

    </div>
    <div className='item' style={{textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline'}}>
     Current Simulation Run Information
    </div>

    <div className='bigTable' >
      <table >
        <tbody>
          <tr >
            <td>Min Driver Speed (km/h)</td>
            <td>{props.minSpeed}</td>
          </tr>
          <tr >
            <td>Max Driver Speed (km/h)</td>
            <td>{props.maxSpeed}</td>
          </tr>
          <tr >
            <td>Mean Driver Speed (km/h)</td>
            <td>{props.meanSpeed}</td>
          </tr>
        </tbody>
      </table>

      <table >
        <tbody>
          <tr >
            <td>Food Preperation Time (mins)</td>
            <td>{props.foodPrepTime}</td>
          </tr>
          <tr>
            <td>Total Distance Travelled (km)</td>
            <td>{props.distElapsed}</td>
          </tr>

          <tr>
            <td>Total Number of Eateries </td>
            <td>73</td>
          </tr>

          <tr>
            <td>Total Number of Customers </td>
            <td>{props.nou}</td>
          </tr>

          <tr>
            <td>Number of Customers Served </td>
            <td>{props.minInput}</td>
          </tr>
      
        </tbody>
      </table>
    </div>
   
      <button className="menuButton">
      <div className="title2" onClick={openStats}  >DATA VISUALISATIONS</div>
      </button>

    </div>
  );
};

export default Statbar;