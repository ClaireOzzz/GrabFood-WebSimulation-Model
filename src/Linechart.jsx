import React, { useState, useEffect } from 'react';
import PlotComponent from 'react-plotly.js';
import{nod} from './Map';

const LineChart = (props) => {
    const [x2, setX2] = useState([]);
    const [y2, setY2] = useState([]);


  const [data2, setData2] = useState([
    {
      x2: [] ,
      y2: [],
      type: 'curve',
      marker: {color: 'orange'},
      fill: 'tonexty',
      name: 'Customers',
    },
    // {type: 'scatter',marker: {color: 'orange'}, fill: 'tonexty', name: 'Customers', x: [1, 2, 3, 4], y: [2, 5, 3, 4]},
                  
  ]);

  useEffect(() => {
    setData((prevData) => {
      const updatedY2 = [...prevData[0].y2,  (props.occupied / nod)*100];
      const updatedX2 = [...prevData[0].x2, props.totalTime];

      return [{ ...prevData[0], x2: updatedX2, y2: updatedY2 }];
    });
  }, [props.occupied]);
    
}