import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import { point } from "@turf/helpers";

//icons
import motoIcon from './icons/moto.png'; 
import userIcon from './icons/user.png'; 

import myData from './data/road_line.js';
// drivable roads
import help from './data/road.js';
//all lines on the map 
import mapLines from './data/road_line.json';
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
      zoom: 15.5
    });


    var pathFinder = new PathFinder(mapLines, { tolerance: 1e-4 });

    // const start = [ 103.8523476, 1.3054701 ];
    const finish = [103.850603, 1.297765];

    // Get a random feature index
    const randomIndex = Math.floor(Math.random() * myData.features.length);
    // Get a random coordinate from the selected feature
    const start = myData.features[randomIndex].geometry.coordinates[0];
    
    
    var path = pathFinder.findPath(point(start), point(finish));
    console.log(start);
    

    const route = 
    {
      'type': 'FeatureCollection',
      'features': [
          {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': path.path
          }}
      ]
    };
   
    // A single point that animates along the route.
    const point2 = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
              'type': 'Point',
              'coordinates': start
          }
        }
      ]
    };

    // Calculate the distance in kilometers between route start/end point.
    const lineDistance = path.weight;
    
    // console.log(route.features[0].geometry.coordinates );
    const arc = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    const steps = 500*lineDistance;

    // Draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(route.features[0], i);
        arc.push(segment.geometry.coordinates);
       
    }

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;
    

    // Used to increment the value of the point measurement against the route.
    let counter = 0;


    //MOTOCYCLE ICON ADDING & ANIMATION /////////////////////////////////////////////////////////////
    map.on("load", function () {
      // const coordinates = help.features[0].geometry.coordinates;
      // console.log("geojson " + coordinates);
      // Add an image to use as a custom marker
      map.loadImage(motoIcon, (error, image) =>{
        if (error) throw error;
        map.addImage("taxi", image);
        // Add a GeoJSON source with multiple points
        map.addSource('route', {
          'type': 'geojson',
          'data': mapLines
        });
        map.addSource('point', {
          'type': 'geojson',
          'data': point2
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
          point2.features[0].geometry.coordinates =
          route.features[0].geometry.coordinates[counter];

          // Calculate the bearing to ensure the icon is rotated to match the route arc
          // The bearing is calculated between the current point and the next point, except
          // at the end of the arc, which uses the previous point and the current point
          point2.features[0].properties.bearing = turf.bearing(
              turf.point(start),
              turf.point(end)
          );

          // Update the source with this new data
          map.getSource('point').setData(point2);

          // Request the next frame of animation as long as the end has not been reached
          if (counter < steps) {
              requestAnimationFrame(animate);
          }

          counter = counter + 1;
        }
        document.getElementById('reset').addEventListener('click', () => {
          // Set the coordinates of the original point back to origin
          point2.features[0].geometry.coordinates = start;

          // Update the source layer
          map.getSource('point').setData(point2);

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
                'coordinates': finish
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






//SIDE BAR ///////////////////////////////////////////////////////////////////////////////////////
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
        {/* output */}
        <div className = 'output'>
          <div className = 'header'>
            Average Waiting Time: 
          </div>
          <div className = 'header'>
            Occupied to Unoccupied Drivers:
          </div>
          <div className = 'header'>
            Average Customers Served/h:
          </div>
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
