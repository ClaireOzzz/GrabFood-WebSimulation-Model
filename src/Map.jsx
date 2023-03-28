import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { gsap } from 'gsap';

//Seperate components
import SideBar from './Sidebar';
import { shortestPaths, userCoordinates, driverCoordinates } from './Calculations';

//icons
import motoIcon from './icons/moto.png'; 
import userIcon from './icons/user.png'; 
import restaurantIcon from './icons/restaurant.png'; 

//geojson
import mapLines from './data/road_line.json';
import restaurantCoords from './data/restaurants.js';

import './Map.css';

mapboxgl.accessToken =
'pk.eyJ1IjoiY2xhaXJlb3p6IiwiYSI6ImNsZGp4bmpybTA0d3EzbnFrbHJnMGNjbm0ifQ.VMGh4lz5DFS0na-hJKUPsA';

const Map = () => {
  const mapContainerRef = useRef(null);
  const [drivers, setDrivers] = useState([]);
  const [userInput, setUserInput] = useState(1);
  const inputRef = useRef(null);

  const IDLE = 0;
  const FETCHING = 1;   // GETTING THE FOOD FROM THE EATERY
  const DELIVERING = 2; // DELIVERING THE FOOD TO THE CUSTOMER
  const DONE = 3;

  const DRIVER = 0;
  const CUSTOMER = 1;

  const handleUserInput = (input) => {
    setUserInput(input);
  };

  const handleReset = () => {
    // Update the userInput state with the current input field value
    setUserInput(inputRef.current.value);
    // console.log("userInput2222 "+ userInput);
  };

  useEffect(() => {
    // console.log("userInput2222 " + userInput);
  }, [userInput]);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [103.85299393647626, 1.3005577339241654],
      zoom: 15.5,
      fadeDuration: 0
    });

    const nod = 3; // NOD = number of drivers

    const drivers =[];
    for (let i = 0; i < nod; i++) {
      const driver = {
        "type": DRIVER,
        "index": (i),
        "location": [driverCoordinates[i]],
        "pathobj1": shortestPaths[i][0], // TO EATERY
        "pathobj2": shortestPaths[i][1], // TO CUSTOMER
        "state": FETCHING
      };
      drivers.push(driver);
    }
    setDrivers(drivers);
    console.log("shortestPaths " + shortestPaths);
    
    //time & speed
    const speeds = [1, 4, 8, 16, 32, 0.4]; // define the available speeds
    let speedIndex = 0; 
    let startTime; // declare a variable to store the start time
    let elapsedTime; // declare a variable to store the elapsed time
    let elapsed;
    let currentSpeed = 1;
    let weatherSpeed = 1;

    document.getElementById('1x-speed').addEventListener('click', () => {
      speedIndex = 0;
      currentSpeed = speeds[speedIndex];
      document.querySelectorAll('.speedbutton').forEach(button => {
        button.classList.remove('active');
      });
      document.getElementById('1x-speed').classList.add('active');
    });
    
    document.getElementById('4x-speed').addEventListener('click', () => {
      speedIndex = 1;
      currentSpeed = speeds[speedIndex];
      document.querySelectorAll('.speedbutton').forEach(button => {
        button.classList.remove('active');
      });
      document.getElementById('4x-speed').classList.add('active');
    });

    document.getElementById('8x-speed').addEventListener('click', () => {
      speedIndex = 2;
      currentSpeed = speeds[speedIndex];
      document.querySelectorAll('.speedbutton').forEach(button => {
        button.classList.remove('active');
      });
      document.getElementById('8x-speed').classList.add('active');
    });
    
    document.getElementById('16x-speed').addEventListener('click', () => {
      speedIndex = 3;
      currentSpeed = speeds[speedIndex];
      document.querySelectorAll('.speedbutton').forEach(button => {
        button.classList.remove('active');
      });
      document.getElementById('16x-speed').classList.add('active');
    });
    
    document.getElementById('32x-speed').addEventListener('click', () => {
      speedIndex = 4;
      currentSpeed = speeds[speedIndex];
      document.querySelectorAll('.speedbutton').forEach(button => {
        button.classList.remove('active');
      });
      document.getElementById('32x-speed').classList.add('active');
    });
    document.getElementById('weather').addEventListener('change', (event) => {
      if (event.target.value === 'Rainy') {
        console.log("rainy");
        const rando = Math.random() * (16 - 3.6) + 3.6;
        weatherSpeed = (1+ rando/100)
      } else {
        weatherSpeed = 1;
      }
    });

    var point2, route, counter;
    var animations = [];          // will contain routes
    var animationPoints = [];     // will contain the single point that animates along the route
    var steps = [];               // will contain steps

    function prepAnimate(path, begin) {
      point2 = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Point',
                'coordinates': begin
            }
          }
        ]
      };

      route = 
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
      animationPoints.push(point2);

      // Calculate the distance in kilometers between route start/end point.
      const lineDistance = path.weight;
      var vehicleSpeed = 25;
      const stepDistance = ((vehicleSpeed*1000)/3600);
      const arc = [];
      const calcSteps = ((lineDistance*1000)/(stepDistance/60))*(1/(currentSpeed*weatherSpeed));
      steps.push(calcSteps);
      console.log("stepsss ", steps);
      // Draw an arc between the `origin` & `destination` of the two points
      for (let i = 0; i < lineDistance; i += lineDistance / calcSteps) {
          const segment = turf.along(route.features[0], i);
          arc.push(segment.geometry.coordinates);  
      };

      // Update the route with calculated arc coordinates
      route.features[0].geometry.coordinates = arc;
      animations.push(route);
      // Used to increment the value of the point measurement against the route.
      counter = 0;
    }
 
    for (let i = 0; i < nod; i++) {
      if (drivers[i].state === FETCHING) {
        // prep for the first part of full cycle: fetching
        prepAnimate(drivers[i].pathobj1, drivers[i].pathobj1.path[0])
      };
    };
    setDrivers(drivers);
    // console.log("animationPoints "+ animationPoints);
    // console.log("animations[1].features[0].geometry.coordinates "+ animations[2].features[0].geometry.coordinates);

    // RESTURANT ICONS /////////////////////////////////////////////////////////////////////////////////////////////////////
    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(restaurantIcon, (error, image) => {
        if (error) throw error;
        map.addImage("eatery", image);
    
        // Define an array of coordinates for the markers
        const eatCoordinates = restaurantCoords.features[0].geometry.coordinates;
    
        // Add a GeoJSON source with multiple points
        const geojson = {
          type: "FeatureCollection",
          features: eatCoordinates.map((eatcoord) => {
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: eatcoord,
              },
            };
          }),
        };
        map.addSource("markers", {
          type: "geojson",
          data: geojson,
        });
    
        // Add a symbol layer
        map.addLayer({
          id: "markers",
          type: "symbol",
          source: "markers",
          layout: {
            "icon-image": "eatery",
            "icon-size": 0.035,
          },
        });
      });
    });
    

    // CUSTOMER ICONS //////////////////////////////////////////////////////////////////////////////////////////////////////////
    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(userIcon, (error, image) => {
        if (error) throw error;
        map.addImage("custom-marker", image);
    
        // Define an array of coordinates for the markers
        const coordinates = userCoordinates;
    
        // Add a GeoJSON source with multiple points
        const geojson = {
          type: "FeatureCollection",
          features: coordinates.map((coord) => {
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: coord,
              },
            };
          }),
        };
        map.addSource("points", {
          type: "geojson",
          data: geojson,
        });
    
        // Add a symbol layer
        map.addLayer({
          id: "points",
          type: "symbol",
          source: "points",
          layout: {
            "icon-image": "custom-marker",
            "icon-size": 0.035,
          },
        });
      });
    });
    

    //MOTOCYCLE ICON ADDING & ANIMATION ////////////////////////////////////////////////////////////////////////////////////////
    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(motoIcon, (error, image) =>{
        if (error) throw error;
        map.addImage("taxi", image);

        // Add a GeoJSON source with multiple points
        map.addSource('route', {
          'type': 'geojson',
          'data': mapLines
        });

        map.addLayer({
          'id': 'route',
          'source': 'route',
          'type': 'line',
          'paint': {
              'line-width': 2,
              'line-color': '#305c16'
          }
        });
        
        // Loop through the animations array and add each point2 as a separate source and layer
        animationPoints.forEach((animationPoint, index) => {
          // console.log('point-', index);
            map.addSource(`point-${index}`, {
              'type': 'geojson',
              'data': animationPoint
            });

          map.addLayer({
            'id': `point-${index}`,
            'source': `point-${index}`,
            'type': 'symbol',
            'layout': {
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-image': 'taxi',
              'icon-size': 0.1,
              'icon-rotate': ['get', 'bearing'],
              'icon-rotation-alignment': 'map',
            }
          });     
        });

        // ANIMATION UPDATE FUNCTION ///////////////////////////////////////////////////////////////////////////////////////
        function animate(i) {
          console.log("i ", i);
          if (counter === 0) {
            // capture the start time when counter is zero
            startTime = new Date().getTime();
          }
          // calculate the time delta based on the selected speed
          const timeDelta = (new Date().getTime() - startTime);

          const start =
          animations[i].features[0].geometry.coordinates[
                  counter >= steps[i] ? counter - 1 : counter
              ];
          const end =
          animations[i].features[0].geometry.coordinates[
                  counter >= steps[i] ? counter : counter + 1
              ];
          if (!start || !end) return;

          // Update point geometry to a new position based on counter denoting
          // the index to access the arc
          animationPoints[i].features[0].geometry.coordinates =
          animations[i].features[0].geometry.coordinates[counter];

          // Calculate the bearing to ensure the icon is rotated to match the route arc
          // The bearing is calculated between the current point and the next point, except
          // at the end of the arc, which uses the previous point and the current point
          animationPoints[i].features[0].properties.bearing = turf.bearing(
              turf.point(start),
              turf.point(end)
          );

          // Update the source with this new data
          map.getSource(`point-${i}`).setData(animationPoints[i]);
         

          // Request the next frame of animation as long as the end has not been reached
          if (counter < Math.floor(steps[i])) {
            requestAnimationFrame(() => animate(i));
          }

          counter += 1 ;

          if (counter === Math.floor(steps[i]) && drivers[i].state === FETCHING) {
            // Set the animation to run again with a different path and update the driver state
            drivers[i].state = DELIVERING;
            setDrivers(drivers);
            // console.log(`driver.state${i} = ` + drivers[i].state);
            setTimeout(() => {
              prepAnimate(drivers[i].pathobj2, drivers[i].pathobj2.path[0]);
              counter = 0;
              animate(i);
            }, 5000*(1/currentSpeed));

          } else if (counter === Math.floor(steps[i]) && drivers[i].state === DELIVERING) {
            // Update the driver state when the second animation is complete
            drivers[i].state = DONE;
            setDrivers(drivers);
            elapsedTime = timeDelta;
            elapsed = elapsedTime* (currentSpeed);
            console.log(`Elapsed time: ${elapsed} ms`);
            console.log(`${i} DONE`);
          };
        };

        function runSimultaneously() {
          const timeline = gsap.timeline();
          for (let i = 0; i < nod; i++) {
            timeline.add(() => animate(i));
          }
          // timeline.add(() => animate(1)).add(() => animate(0), 0);
          console.log("all running");
        }

        document.getElementById('reset').addEventListener('click', () => {
          animations = []; // EMPTYING THE ARRAYS FOR REFILL (CANNOT REUSE AS SPEED MIGHT CHANGE)
          animationPoints =[];
          steps = [];
          counter = 0;
          for (let i = 0; i < nod; i++) {
            drivers[i].state = FETCHING; //RESETTING THE STATE BACK TO THE START
            prepAnimate(drivers[i].pathobj1, drivers[i].pathobj1.path[0])
          };      
          setDrivers(drivers);

          // Restart the animation
          runSimultaneously();
        });

        runSimultaneously();
     
      });});

    // Clean up on unmount
    return () => map.update();

  },[]); 


//SIDE BAR /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <SideBar handleUserInput={handleUserInput}
        handleReset={handleReset}
        inputRef={inputRef}/>
        <div id="elapsed-time"></div>
      {/* <script src="/Listeners.jsx"></script> */}
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
}

export default Map;
