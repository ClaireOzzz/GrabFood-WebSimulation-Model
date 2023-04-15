import React, { useState, useEffect } from 'react';
import PlotComponent from 'react-plotly.js';

// const Statbar = (props) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [data, setData] = useState([1, 2, 3, 5]);

//   useEffect(() => {
//     setData((prevData) => [...prevData, props.servedCustomers]);
//   }, [props.servedCustomers]);

//   const handleClick = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div>
//       <div className={`menu ${isOpen ? 'menu-open' : ''}`} tabIndex="0" onClick={handleClick}>

//       <div className = 'answer'>
//       {props.servedCustomers}
//       </div>

//       <div className="graph-container">
//       <div className="graph" >
//           <PlotComponent
//             data={[
//               {
//                 x: data ,
//                 y: [1, 2, 3, 4],
//                 type: 'line',
//                 marker: {color: 'orange'},
//                 fill: 'tonexty',
//                 name: 'Customers',
//               },
//               // {type: 'scatter',marker: {color: 'orange'}, fill: 'tonexty', name: 'Customers', x: [1, 2, 3, 4], y: [2, 5, 3, 4]},
//             ]}
//             // plot_bgcolor:'#17381a', paper_bgcolor:'#17381a'
//             layout={{ width: 533, height: 400, title: {text:'A Fancy Plot', x:0.05}, font: {color: '#51ba4c', size:14} , gridwidth:1,
//               xaxis: {
//                 title:"Time",
//                 linecolor: '#51ba4c',
//                 linewidth: 2,
//                 gridcolor:'#51ba4c',
//                 mirror: true
//               },
//               yaxis: {
//                 title:"Customers",
//                 linecolor: '#51ba4c',
//                 linewidth: 2,
//                 gridcolor:'#51ba4c',
//                 mirror: true
//               },
//               plot_bgcolor: '#rgba(0,0,0,0)',
//               paper_bgcolor: '#rgba(0,0,0,0)'
            
//             }}
//           />
//         </div>
        
        
//         <div className="graph">
//         <PlotComponent
//             data={[
//               {type: 'bar',marker: {color: 'rgba(255, 167, 14, 0.6)'}, fill: 'tonexty', name: 'Customers', x: [1, 2, 3, 4], y: [2, 5, 3, 4]},
//             ]}
//             // plot_bgcolor:'#17381a', paper_bgcolor:'#17381a'
//             layout={{ width: 523, height: 400, title: {text:'A Fancy Plot', x:0.05}, font: {color: '#51ba4c', size:14} , gridwidth:1,
//               xaxis: {
//                 title:"Time",
//                 linecolor: '#51ba4c',
//                 linewidth: 2,
//                 gridcolor:'#51ba4c',
//                 mirror: true
//               },
//               yaxis: {
//                 title:"Customers",
//                 linecolor: '#51ba4c',
//                 linewidth: 2,
//                 gridcolor:'#51ba4c',
//                 mirror: true
//               },
//               plot_bgcolor: '#rgba(0,0,0,0)',
//               paper_bgcolor: '#rgba(0,0,0,0)'
            
//             }}
//           />
//         </div>
//       </div>


//         <div className="title2">DATA VISUALISATIONS</div>
        
//       </div>
        
//     </div>
//   );
// };

// export default Statbar;

const Statbar = (props) => {

  const [x, setX] = useState([]);
  const [y, setY] = useState([]);

  const [data, setData] = useState([
    {
      x: [0] ,
      y: [0],
      type: 'curve',
      marker: {color: 'orange'},
      fill: 'tonexty',
      name: 'Customers',
    },
    // {type: 'scatter',marker: {color: 'orange'}, fill: 'tonexty', name: 'Customers', x: [1, 2, 3, 4], y: [2, 5, 3, 4]},
                  
  ]);

  useEffect(() => {

    setData((prevData) => {
      const updatedY = [...prevData[0].y, props.servedCustomers];
      const updatedX = [...prevData[0].x, props.totalTime];

      return [{ ...prevData[0], x: updatedX, y: updatedY }];
    });
  }, [props.servedCustomers, props.totalTime]);

  const layout = { width: 533, height: 400, title: {text:'Number of Customers Served over Time', x:0.05}, font: {color: '#51ba4c', size:14} , gridwidth:1,
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
  };

  const handleClear = () => {
    setData([])
  };

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
      <button className="downloadButton" onClick={handleClear}>Clear</button>
      <button className="downloadButton" onClick={downloadCsv}>Download CSV</button>
    </div>
       
        {/* <div className = 'answer'>
        {props.servedCustomers}
          </div> */}

      <div style={{ width: "100%", height: "100%" }}>
        <PlotComponent data={data} layout={layout} />
      </div>

      <div className="graph"></div>
   
      <button className="menuButton">
      <div className="title2" onClick={openStats}  >DATA VISUALISATIONS</div>
      </button>

    </div>
  );
};

export default Statbar;