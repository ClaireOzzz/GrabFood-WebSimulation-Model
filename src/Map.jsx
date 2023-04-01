import React, { useRef, useEffect, useState } from 'react';
import PathFinder from "geojson-path-finder";
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { gsap } from 'gsap';

//Seperate components
import SideBar from './Sidebar';
import calculations, { driverCoordinates, userCoordinates, 
      shortestPaths} from './Calculations';

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
  const [userInput2, setUserInput2] = useState(1);
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  const IDLE = 0;
  const FETCHING = 1;   // GETTING THE FOOD FROM THE EATERY
  const DELIVERING = 2; // DELIVERING THE FOOD TO THE CUSTOMER
  const DONE = 3;

  const DRIVER = 0;
  const CUSTOMER = 1;

  const handleReset = () => {
    setUserInput(inputRef.current.value);
    setUserInput2(inputRef2.current.value);
    // console.log("userInput2222 "+ userInput);
  };

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [103.85299393647626, 1.3005577339241654],
      zoom: 15.5,
      fadeDuration: 0
    });
    
    const nod = userInput; // NOD = number of drivers
    const nou = 5;
    // calculations(nod, nou);
    console.log("userInput ", userInput);
    console.log("userInput2 ", userInput2);

    const drivers =[];
    
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

    var animations = [];          // will contain routes
    var animationPoints = [];     // will contain the single point that animates along the route
    var steps = [];               // will contain steps
    var animations2 = [];  
    var animationPoints2 = [];    // for the second part of the cycle
    var steps2 = [];

    function prepAnimate(path, begin, i) {
      var point2 = {
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
      var route = 
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

      // Calculate the distance in kilometers between route start/end point.
      const lineDistance = path.weight;
      var vehicleSpeed = 25;
      const stepDistance = ((vehicleSpeed*1000)/3600);
      const arc = [];
      const calcSteps = ((lineDistance*1000)/(stepDistance/60))*(1/(currentSpeed*weatherSpeed))/16;
      
      // Draw an arc between the `origin` & `destination` of the two points
      for (let i = 0; i < lineDistance; i += lineDistance / calcSteps) {
          const segment = turf.along(route.features[0], i);
          arc.push(segment.geometry.coordinates);  
      };

      // Update the route with calculated arc coordinates
      route.features[0].geometry.coordinates = arc;

      if ( drivers[i].state === FETCHING) {
        animations.push(route);
        animationPoints.push(point2);
        steps.push(calcSteps);
      };

      if ( drivers[i].state === DELIVERING) {
        animations2.push(route);
        animationPoints2.push(point2);
        steps2.push(calcSteps);
        console.log(` animations2length `, animations2.length);
      };
    }

    function restart() {
      // setDriverCoordinates([], {});
      // calculations(nod);
      
      for (let i = 0; i < Math.min(nod, nou); i++) {
        const driver = {
          "type": DRIVER,
          "index": i,
          "location": [driverCoordinates[i]],
          "pathobj1": shortestPaths[i][0], // TO EATERY
          "pathobj2": shortestPaths[i][1], // TO CUSTOMER
          "state": FETCHING,
          "counter": 0
        };
        drivers.push(driver);
      }
      setDrivers(drivers);
      animations = [];
      animations2 = [];
      animationPoints = [];
      animationPoints2 = [];
      steps = [];
      steps2 = [];
      console.log("new restart function");
      for (let i = 0; i < Math.min(nod, nou); i++) {
        if (drivers[i].state === FETCHING) {
          prepAnimate(drivers[i].pathobj1, drivers[i].pathobj1.path[0], i)
        };
      };
  
      for (let i = 0; i < Math.min(nod, nou); i++) {
        drivers[i].state = DELIVERING
        setDrivers(drivers);
        prepAnimate(drivers[i].pathobj2, drivers[i].pathobj2.path[0], i)
        drivers[i].state = FETCHING
        setDrivers(drivers);
      };

      console.log("stepD ", steps2);
      console.log("stepF ", steps);
    }
    restart();
   

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

        animations.forEach((animation, index) => {
          map.addSource(`route-${index}`, {
            'type': 'geojson',
            'data': animation
            });

          map.addLayer({
            'id': `route-${index}`,
            'source': `route-${index}`,
            'type': 'line',
            'paint': {
            'line-width': 2,
            'line-color': '#d12e15'
            }
            });
        });
        
        animations2.forEach((animation2, index) => {
          map.addSource(`route2-${index}`, {
            'type': 'geojson',
            'data': animation2
            });

          map.addLayer({
            'id': `route2-${index}`,
            'source': `route2-${index}`,
            'type': 'line',
            'paint': {
            'line-width': 2,
            'line-color': '#d12e15'
            }
            });
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
        function animateFetching(i) {
          // var counter = drivers[i].counter;
          if (drivers[i].counter === 0) {
            // capture the start time when counter is zero
            startTime = new Date().getTime();
          }
          // calculate the time delta based on the selected speed
          const timeDelta = (new Date().getTime() - startTime);
          
          const start =
          animations[i].features[0].geometry.coordinates[
            drivers[i].counter >= steps[i] ? drivers[i].counter - 1 : drivers[i].counter
              ];
          const end =
          animations[i].features[0].geometry.coordinates[
            drivers[i].counter >= steps[i] ? drivers[i].counter : drivers[i].counter + 1
              ];
          if (!start || !end) return;

          animationPoints[i].features[0].geometry.coordinates =
          animations[i].features[0].geometry.coordinates[drivers[i].counter];

          animationPoints[i].features[0].properties.bearing = turf.bearing(
              turf.point(start),
              turf.point(end)
          );

          // Update the source with this new data
          map.getSource(`point-${i}`).setData(animationPoints[i]);

          // Request the next frame of animation as long as the end has not been reached
          if (drivers[i].counter < steps[i]) {
            requestAnimationFrame(() => animateFetching(i));
          }
          drivers[i].counter += 1 ;
          setDrivers(drivers);
        
          if (drivers[i].counter === Math.floor(steps[i])) {
            // Set the animation to run again with a different path and update the driver state
            console.log(`done for - ${i}`);
            drivers[i].state = DELIVERING;
            setDrivers(drivers);
            // console.log(`driver.state${i} = ` + drivers[i].state);
            setTimeout(() => {
              drivers[i].counter = 0;
              // timeline.add(() => animateDelivering(i));
              animateDelivering(i)
            }, 5000*(1/currentSpeed));
          }; 
        };
          
        function animateDelivering(i) {
          if (drivers[i].counter === 0) {
            // capture the start time when counter is zero
            startTime = new Date().getTime();
            
            // update the animationPoints and animations variables to reflect the starting position
            animationPoints2[i].features[0].geometry.coordinates = animations[i].features[0].geometry.coordinates[0];
          }
          // calculate the time delta based on the selected speed
          const timeDelta = new Date().getTime() - startTime;
        
          const start =
          animations2[i].features[0].geometry.coordinates[    drivers[i].counter >= steps2[i] ? drivers[i].counter - 1 : drivers[i].counter
              ];
          const end =
          animations2[i].features[0].geometry.coordinates[    drivers[i].counter >= steps2[i] ? drivers[i].counter : drivers[i].counter + 1
              ];
          if (!start || !end) return;
        
          animationPoints2[i].features[0].geometry.coordinates =
          animations2[i].features[0].geometry.coordinates[drivers[i].counter];
        
          animationPoints2[i].features[0].properties.bearing = turf.bearing(
              turf.point(start),
              turf.point(end)
          );
            
          map.getSource(`point-${i}`).setData(animationPoints2[i]);
        
          if (drivers[i].counter < steps2[i]) {
            requestAnimationFrame(() => animateDelivering(i));
          }
          drivers[i].counter += 1 ;
          setDrivers(drivers);
        
          if (drivers[i].counter === Math.floor(steps2[i])) {
            // Update the driver state when the second animation is complete
            drivers[i].state = DONE;
            setDrivers(drivers);
            elapsedTime = timeDelta;
            elapsed = elapsedTime* (currentSpeed);
            console.log(`Elapsed time: ${elapsed} ms`);
            console.log(`${i} DONE`);
          }; 
        };
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const timeline = gsap.timeline();
        function run() {
          for (let i = 0; i < Math.min(nod, nou); i++) {
            if ( drivers[i].state === FETCHING) {
              timeline.add(() => animateFetching(i));
            };
            if ( drivers[i].state === DELIVERING) {
              timeline.add(() => animateDelivering(i));
            };
          };
        };
    
        document.getElementById('reset').addEventListener('click', () => { 
          console.log("reset clicked");
          timeline.pause();
          timeline.clear();
          for (let i = 0; i < Math.min(nod, nou); i++) {
            drivers[i].state = FETCHING; //RESETTING THE STATE BACK TO THE START
            drivers[i].counter = 0; // RESET THE DRIVER'S COUNTER
          };      
          setDrivers(drivers);
          restart();
          for (let i = 0; i < Math.min(nod, nou); i++) {
            animateFetching(i);
          };
          run();
        });

        run();
     
      });});

    // Clean up on unmount
    // return () => map.update();
    if (typeof map.update === 'function') {
      map.update();
    }

  },[userInput, userInput2]); 


//SIDE BAR /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <SideBar 
        handleReset={handleReset}
        inputRef={inputRef}
        inputRef2={inputRef2}/>
        <div id="elapsed-time"></div>
      {/* <script src="/Listeners.jsx"></script> */}
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
}

export default Map;

