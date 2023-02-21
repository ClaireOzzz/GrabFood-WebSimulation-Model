import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import motoIcon from './icons/moto.png'; 
import userIcon from './icons/user.png'; 
import myData from './data/road_line.geojson';
import myTemp from './data/road.geojson';
import * as turf from '@turf/turf';

import './Map.css';

mapboxgl.accessToken =
'pk.eyJ1IjoiY2xhaXJlb3p6IiwiYSI6ImNsZGp4bmpybTA0d3EzbnFrbHJnMGNjbm0ifQ.VMGh4lz5DFS0na-hJKUPsA';

const Map = () => {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [103.85299393647626, 1.3005577339241654],
      zoom: 16
    });

    const origin = [103.855906, 1.300603];

    const route = 
    {
      'type': 'FeatureCollection',
      'features': [
          {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': [
                [103.855906, 1.300603],
                [103.855811, 1.300499],
                [103.85577, 1.300454],
                [103.85577, 1.300454],
                [103.855681, 1.300357],
                [103.85533, 1.299919],
                [103.855308, 1.299892],
                [103.854814, 1.299326]
                ]
            }
          }
      ]
    };
   
    // A single point that animates along the route.
    // Coordinates are initially set to origin.
    const point = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
              'type': 'Point',
              'coordinates': origin
          }
        }
      ]
    };

    // Calculate the distance in kilometers between route start/end point.
    const lineDistance = turf.length(route.features[0]);
    console.log(myTemp);
    // console.log(route.features[0].geometry.coordinates );
    const arc = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    const steps = 500;

    // Draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(route.features[0], i);
        arc.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;

    // Used to increment the value of the point measurement against the route.
    let counter = 0;

    //MOTOCYCLE ADDING & ANIMATION /////////////////////////////////////////////////////////////
    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(motoIcon, (error, image) =>{
        if (error) throw error;
        map.addImage("taxi", image);
        // Add a GeoJSON source with multiple points
        map.addSource('route', {
          'type': 'geojson',
          'data': myData
        });
        map.addSource('point', {
          'type': 'geojson',
          'data': point
        });
        // Add a symbol layer
        map.addLayer({
          'id': 'route',
          'source': 'route',
          'type': 'line',
          'paint': {
              'line-width': 4,
              'line-color': '#4C00b0'
          }
        });

        map.addLayer({
          'id': 'point',
          'source': 'point',
          'type': 'symbol',
          'layout': {
              
              'icon-image': 'taxi',
              'icon-size': 0.1,
              'icon-rotate': ['get', 'bearing'],
              'icon-rotation-alignment': 'map',
              'icon-allow-overlap': true,
              'icon-ignore-placement': true
          }
        });

        function animate() {
          const start =
              route.features[0].geometry.coordinates[
                  counter >= steps ? counter - 1 : counter
              ];
          const end =
              route.features[0].geometry.coordinates[
                  counter >= steps ? counter : counter + 1
              ];
          if (!start || !end) return;

          // Update point geometry to a new position based on counter denoting
          // the index to access the arc
          point.features[0].geometry.coordinates =
              route.features[0].geometry.coordinates[counter];

          // Calculate the bearing to ensure the icon is rotated to match the route arc
          // The bearing is calculated between the current point and the next point, except
          // at the end of the arc, which uses the previous point and the current point
          point.features[0].properties.bearing = turf.bearing(
              turf.point(start),
              turf.point(end)
          );

          // Update the source with this new data
          map.getSource('point').setData(point);

          // Request the next frame of animation as long as the end has not been reached
          if (counter < steps) {
              requestAnimationFrame(animate);
          }

          counter = counter + 1;
        }
        document.getElementById('reset').addEventListener('click', () => {
          // Set the coordinates of the original point back to origin
          point.features[0].geometry.coordinates = origin;

          // Update the source layer
          map.getSource('point').setData(point);

          // Reset the counter
          counter = 0;

          // Restart the animation
          animate(counter);
          });

        // Start the animation
        animate(counter);
    });});

    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(userIcon, (error, image) =>{
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
              <option value="Morning" >Morning</option>
              <option value="Afternoon" >Afternoon</option>
              <option value="Night" >Night</option>
            </select>
          </div>

          <div className="option">
            <label for="weather">Weather:</label>
            <select name="weather" id="weather" >
              <option value="Rainy">Rainy</option>
              <option value="Normal" >Normal</option>
            </select>
          </div>

          <div className="option">
            <label for="transport">Transport:</label>
            <select name="transport" id="transport">
              <option value="Ebicycle">E-bicycle</option>
              <option value="Motocycle" >Motocycle</option>
            </select>
          </div>
        </div>
        <div className = 'header'>
          Average Waiting Time:
        </div>
        <div className ="overlay">
          <button className ="resetbutton" id="reset">Reset</button>
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
}

export default Map;
