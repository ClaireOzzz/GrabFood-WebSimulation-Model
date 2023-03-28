import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

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
  
  const [userInput, setUserInput] = useState(1);
  const inputRef = useRef(null);

  const handleUserInput = (input) => {
    setUserInput(input);
  };

  const handleReset = () => {
    // Update the userInput state with the current input field value
    setUserInput(inputRef.current.value);
    // Do something with userInput, like reset the app's state
  };

  useEffect(() => {
  console.log("userInput "+userInput);
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

    let driverState = 'food_attaining';

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
        // speedIndex = 5;
        const rando = Math.random() * (16 - 3.6) + 3.6;
        weatherSpeed = (1+ rando/100)
        console.log("rando "+rando);
      } else {
        weatherSpeed = 1;
      }
    });


    var point2, route, counter, steps;
    console.log("driverCoordinates0 "+ driverCoordinates[0]);
    
    function prepAnimate(path, begin) {
      // A single point that animates along the route.
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

      // Calculate the distance in kilometers between route start/end point.
      const lineDistance = path.weight;
      var vehicleSpeed = 25;
      const stepDistance = ((vehicleSpeed*1000)/3600);
      const arc = [];
      steps = ((lineDistance*1000)/(stepDistance/60))*(1/(currentSpeed*weatherSpeed));
      console.log("steps "+steps);
      console.log("lineDistance "+ lineDistance)
      // Draw an arc between the `origin` & `destination` of the two points
      for (let i = 0; i < lineDistance; i += lineDistance / steps) {
          const segment = turf.along(route.features[0], i);
          arc.push(segment.geometry.coordinates);  
      };

      // Update the route with calculated arc coordinates
      route.features[0].geometry.coordinates = arc;
      // Used to increment the value of the point measurement against the route.
      counter = 0;
    }
    if (driverState === 'food_attaining') {
      prepAnimate(shortestPaths[0][0], shortestPaths[0][0].path[0])
      // prepAnimate(shortestPaths[1][0], driverCoordinates[1][0])
      console.log('food_attaining')
    };


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
              'line-width': 2,
              'line-color': '#305c16'
          }
        });

        map.addLayer({
          'id': 'point',
          'source': 'point',
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


        // ANIMATION UPDATE FUNCTION ///////////////////////////////////////////////////////////////////////////////////////

        function animate() {
          if (counter === 0) {
            // capture the start time when counter is zero
            startTime = new Date().getTime();
          }
          // calculate the time delta based on the selected speed
          const timeDelta = (new Date().getTime() - startTime);

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

          counter += 1 ;

          if (counter === Math.floor(steps) && driverState === 'food_attaining') {
            // Set the animation to run again with a different path and update the driver state
            driverState = 'food_delivering';
            setTimeout(() => {
              prepAnimate(shortestPaths[0][1], shortestPaths[0][1].path[0])
              steps = route.features[0].geometry.coordinates.length - 1;
              counter = 0;
              animate();
            }, 5000*(1/currentSpeed));

            console.log('food_delivering now');
            
          } else if (counter === Math.floor(steps) && driverState === 'food_delivering') {
            // Update the driver state when the second animation is complete
            driverState = 'done';

            elapsedTime = timeDelta;
            elapsed = elapsedTime* (currentSpeed);
            console.log(`Elapsed time: ${elapsed} ms`);
            console.log('done');
          }

        }
        document.getElementById('reset').addEventListener('click', () => {
          driverState = 'food_attaining';
          prepAnimate(shortestPaths[0][0], shortestPaths[0][0].path[0])
          // prepAnimate(shortestPaths[1][0], driverCoordinates[1][0])
          // Reset the counter
          counter = 0;
          // Restart the animation
          animate(counter);
        });

        // Start the animation
        animate(counter);

      });});



    // Clean up on unmount
    return () => map.update();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


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
