import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import myImage from './icons/rider.png'; 
import myData from './data/road_line.geojson';
import './Map.css';

mapboxgl.accessToken =
'pk.eyJ1IjoiY2xhaXJlb3p6IiwiYSI6ImNsZGp4bmpybTA0d3EzbnFrbHJnMGNjbm0ifQ.VMGh4lz5DFS0na-hJKUPsA';

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(1.5);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [103.85299393647626, 1.3005577339241654],
      zoom: 16
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(myImage, (error, image) =>{
          if (error) throw error;
          map.addImage("custom-marker", image);
          // Add a GeoJSON source with multiple points
          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [{
                'type': 'Feature',
                'geometry': {
                'type': 'Point',
                'coordinates': [
              103.85499393647626,
              1.3005577339241654
            ]
                }
              }]
              
            },
          });
          // Add a symbol layer
          map.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              "icon-size" : 0.07
            },
          });
        }
      );
    });

    //add routes from geojson
    map.on("load", () => {
      map.addSource('route', {
        'type': 'geojson',
        'data': myData
      })
      map.addLayer({
      'id': 'route',
      'type': 'line',
      'source': 'route',

      'layout':{
        'line-join': "round",
        'line-cap': 'round'
      },

      'paint': {
        'line-color': '#4C00b0',
        'line-width': 4
      }
      })
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='sidebarStyle'>
        <div className = 'title'>
          Critical <br/> Checkpoints
        </div>
          {/* Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} */}
        <div className = "optionSection">

          <div className="option">
            <label for="time">Time of Day:</label>
            <select name="time" id="time" >
              <option value="Morning" selected>Morning</option>
              <option value="Afternoon" >Afternoon</option>
              <option value="Night" >Night</option>
            </select>
          </div>

          <div className="option">
            <label for="weather">Weather:</label>
            <select name="weather" id="weather" >
              <option value="Rainy">Rainy</option>
              <option value="Normal" selected>Normal</option>
            </select>
          </div>

          <div className="option">
            <label for="transport">Transport:</label>
            <select name="transport" id="transport">
              <option value="Ebicycle">E-bicycle</option>
              <option value="Motocycle" selected>Motocycle</option>
            </select>
          </div>
        </div>
        
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export default Map;
