import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import PathFinder from "geojson-path-finder";
import * as turf from '@turf/turf';
import { point } from "@turf/helpers";
import { gsap } from 'gsap';

//Seperate components
import SideBar from './Sidebar';
import Statbar from './Statbar';
import calculations, { secondCalculations, eateryToCustomerArray, driverToEateryDict, driverAssignments, 
                      userAssignments, driverCoordinates, userCoordinates, totalDistTravelled } from './Calculations';
import generate_speeds, {all_drivers_speeds} from './SpeedInputs';
import generate_number_of_customers, {number_of_customers} from './CustomerInput'

//icons
import motoIcon from './icons/moto.png'; 
import userIcon from './icons/user.png'; 
import userIcon2 from './icons/userON.png'; 
import restaurantIcon from './icons/restaurant.png'; 

//geojson
import mapLines from './data/road_line.json';
import restaurantCoords from './data/restaurants.js';

import './Map.css';

mapboxgl.accessToken =
'pk.eyJ1IjoiY2xhaXJlb3p6IiwiYSI6ImNsZGp4bmpybTA0d3EzbnFrbHJnMGNjbm0ifQ.VMGh4lz5DFS0na-hJKUPsA';

let currentSpeed = 64;

//food prep time
var randomValue = Math.floor(Math.random() * 6);
var foodPrepTime = randomValue;
var prevCustomerNumber = 0;
var distElapsed = 0;
var minSpeed;
var maxSpeed;
var meanSpeed;
var nou;
var minInput;
var customercount = 0;
var sumElapsed = 0;
var averageSumElapsed = 0;

export var nod; 
export var customerInput = 5;
export var conditions = ['morning', 'normal', 'ebicycle'];
export var driver_speed_array = [];

const Map = () => {
  var elapsedArray = [];
  const mapContainerRef = useRef(null);
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [userInput, setUserInput] = useState(1);
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);
  const [totalTime, setTotalTime] = useState(0);
  const [averageTime, setAverageTime] = useState(0);
  const [occupied, setOccupied] = useState(0);
  const [unoccupied, setUnoccupied] = useState(0);
  const [servedCustomers, setServedCustomers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [mapStyle, setMapStyle] = useState('streets-v10');
  const [iconStyle, setIconStyle] = useState(userIcon);

  const IDLE = 0;
  const FETCHING = 1;   // GETTING THE FOOD FROM THE EATERY
  const DELIVERING = 2; // DELIVERING THE FOOD TO THE CUSTOMER

  const ORDERING = 0;
  const WAITING = 1;

  const DRIVER = 0;
  const CUSTOMER = 1;

  function handleResetClick() {
    setResetCount(resetCount + 1);
    setTotalTime(0);
  }

  const handleReset = () => {
    setUserInput(inputRef.current.value);
    setOccupied(0);
    setUnoccupied(0);
    setServedCustomers(0);
    prevCustomerNumber = 0;
    setTotalCustomers(0);
    customercount = 0;
    sumElapsed = 0;
    averageSumElapsed = 0;
    setAverageTime(0);
  };
  

  const changeMapStyle = (style) => {
    setMapStyle(style);
  };

  useLayoutEffect(() => {
  setTotalTime(0);
  
  const speeds = [1, 8, 16, 32, 64]; // define the available speeds
  console.log("START  AT USEFFECT");
  const speedButtons = document.querySelectorAll('.speedbutton');
  // Add event listeners to each speed button
  speedButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      currentSpeed = speeds[index];
      console.log("currentSpeed ", currentSpeed);
      speedButtons.forEach(button => button.classList.remove('active'));
      button.classList.add('active');
    });
  });

  document.getElementById('weather').addEventListener('change', (event) => {
    if (event.target.value === 'Rainy') {
      conditions[1] = 'rainy';
      console.log(conditions);
    }
  });

  document.getElementById('weather').addEventListener('change', (event) => {
    if (event.target.value === 'Normal') {
      conditions[1] = 'normal';
      console.log(conditions);
    }
  });

  document.getElementById('time').addEventListener('change', (event) => {
    if (event.target.value === 'Morning') {
      conditions[0] = 'morning';
      changeMapStyle('streets-v10');
      setIconStyle(userIcon)
      console.log(conditions);
    }
  });

  document.getElementById('time').addEventListener('change', (event) => {
    if (event.target.value === 'Afternoon') {
      conditions[0] = 'afternoon';
      changeMapStyle('streets-v10');
      setIconStyle(userIcon)
      console.log(conditions);
    }
  });

  document.getElementById('time').addEventListener('change', (event) => {
    if (event.target.value === 'Night') {
      conditions[0] = 'night';
      changeMapStyle('dark-v10');
      setIconStyle(userIcon2)
      console.log(conditions);
    }
  });

  document.getElementById('time').addEventListener('change', (event) => {
    if (event.target.value === 'Midnight') {
      conditions[0] = 'midnight';
      changeMapStyle('dark-v10');
      setIconStyle(userIcon2)
      console.log(conditions);
    }
  });

  document.getElementById('transport').addEventListener('change', (event) => {
    if (event.target.value === 'Motorcycle') {
      conditions[2] = 'motorcycle';
      console.log(conditions);
    }
  });

  document.getElementById('transport').addEventListener('change', (event) => {
    if (event.target.value === 'Ebicycle') {
      conditions[2] = 'ebicycle';
      console.log(conditions);
    }
  });

  document.getElementById('noc').addEventListener('change', (event) => {
    if (event.target.value === "5 - 10") {
      console.log("5 - 10");
      customerInput = 5;
    }
  });

  document.getElementById('noc').addEventListener('change', (event) => {
    if (event.target.value === "10 - 20") {
      console.log("10 - 20");
      customerInput = 10;
    }
  });

  document.getElementById('noc').addEventListener('change', (event) => {
    if (event.target.value === "20 - 40") {
      console.log("20 - 40");
      customerInput = 20;
    }
  });


  document.getElementById('fpt').addEventListener('change', (event) => {
    if (event.target.value === "0 - 5 mins") {
      console.log("0 - 5 mins");
      randomValue = Math.floor(Math.random() * 6);
      foodPrepTime = randomValue;
    }
  });

  document.getElementById('fpt').addEventListener('change', (event) => {
    if (event.target.value === "5 - 15 mins") {
      console.log("5 - 15 mins");
      randomValue = Math.floor(Math.random() * 10) + 5;
      foodPrepTime = randomValue;
    }
  });

  document.getElementById('fpt').addEventListener('change', (event) => {
    if (event.target.value === "15 - 30 mins") {
      console.log("15 - 30 mins");
      randomValue = Math.floor(Math.random() * 16) + 15;
      foodPrepTime = randomValue;
    }
  });

}, []); 

  // Initialize map when component mounts
  useEffect(() => {
    //time & speed
    let startTime; // declare a variable to store the start time
    let elapsedTime; // declare a variable to store the elapsed time
    let elapsed;
    let startTime2; // declare a variable to store the start time
    let elapsedTime2; // declare a variable to store the elapsed time
    let elapsed2;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: [103.85299393647626, 1.3005577339241654],
      zoom: 15.5,
      fadeDuration: 0
    });

    nod = userInput; // NOD = number of drivers
    generate_number_of_customers()
    console.log("number_of_customers ", number_of_customers);
    nou = number_of_customers;
    minInput = Math.min(nod, nou);
    var maxInput = Math.max(nod, nou);
    setOccupied(minInput);
    setUnoccupied(nod-minInput);
    var drivers =[];
  
    generate_speeds();

    var animations = [];          // will contain routes
    var animationPoints = [];     // will contain the single point that animates along the route
    var steps = [];               // will contain steps
    var animations2 = [];  
    var animationPoints2 = [];    // for the second part of the cycle
    var steps2 = [];
    minSpeed = Math.min.apply(Math, all_drivers_speeds);
    maxSpeed = Math.max.apply(Math, all_drivers_speeds);
    meanSpeed= (all_drivers_speeds.reduce((accumulator, currentValue) => accumulator + currentValue, 0))/nod;

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
      var vehicleSpeed = all_drivers_speeds[i];
      const stepDistance = ((vehicleSpeed*1000)/3600);
      const arc = [];
      const calcSteps = ((lineDistance*1000)/(stepDistance/60))*(1/(currentSpeed));
      // Draw an arc between the `origin` & `destination` of the two points
      for (let i = 0; i < lineDistance; i += lineDistance / calcSteps) {
          const segment = turf.along(route.features[0], i);
          arc.push(segment.geometry.coordinates);  
      };

      //theorhetical time calculation
      const theorheticaltime = currentSpeed*((calcSteps * 16.67)/60000);
      console.log("THEORY TIME ", theorheticaltime);
      console.log("DISTANCE KM ", lineDistance);
      console.log("VEHICLE SPEED ", vehicleSpeed);

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
      };
    }
    restart(nod, nou);

    function restart(nod, nou) {
      console.log("NOU ", nou);
      console.log("NOD ", nod);
      console.log("MININPUT ", minInput);
      console.log("FOOD PREP TIME ", foodPrepTime);
  
      calculations(nod, nou);
      secondCalculations(nod, nou, userAssignments);
      distElapsed = (totalDistTravelled.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
      console.log("DISTANCE ELAPSED ", distElapsed);
      drivers = [];
      setDrivers(drivers);

      for (let i = 0; i < nod; i++) {
        const driver = {
          "type": DRIVER,
          "index": i,
          "location": [driverCoordinates[i]],
          "pathobj1": driverToEateryDict[`driver${i}`][driverAssignments[`driver${i}`]], // TO EATERY
          "pathobj2": eateryToCustomerArray[driverAssignments[`driver${i}`]], // TO CUSTOMER
          "state": FETCHING,
          "counter": 0
        };
        drivers.push(driver);
      }
      setDrivers(drivers);

      for (let i = 0; i < nou; i++) {
        const customer = {
          "type": CUSTOMER,
          "index": i,
          "location": [userCoordinates[i]],
          "state": WAITING,
        };
        customers.push(customer);
      }
      setCustomers(customers);
    
      animations = [];
      animations2 = [];
      animationPoints = [];
      animationPoints2 = [];
      steps = [];
      steps2 = [];
  
      for (let i = 0; i < nod; i++) {
        console.log("pathobj1 ", drivers[i].pathobj1);
        if (drivers[0].state === FETCHING) {
          prepAnimate(drivers[i].pathobj1, drivers[i].pathobj1.path[0], i)
        };

        console.log("nou ", nou);
        console.log("userAssignments ", userAssignments);
      };
  
      for (let i = 0; i < nod; i++) {
        drivers[i].state = DELIVERING
        setDrivers(drivers);
        prepAnimate(drivers[i].pathobj2, drivers[i].pathobj2.path[0], i)
        drivers[i].state = FETCHING
        setDrivers(drivers);
      };
    }
   

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
            "icon-allow-overlap" : true,
            "text-allow-overlap": true,
            "icon-size": 0.035,
          },
        });
      });
    });

    // CUSTOMER ICONS //////////////////////////////////////////////////////////////////////////////////////////////////////////
    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(iconStyle, (error, image) => {
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
            "icon-allow-overlap" : true,
            "text-allow-overlap": true,
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
              'line-color': '#52942b'
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
              "text-allow-overlap": true,
              'icon-ignore-placement': true,
              'icon-image': 'taxi',
              'icon-size': 0.09,
              'icon-rotate': ['get', 'bearing'],
              'icon-rotation-alignment': 'map',
            }
          });     
        });

        // ANIMATION UPDATE FUNCTION ///////////////////////////////////////////////////////////////////////////////////////
        function animateFetching(i) {
         
          if ( ((drivers[i].pathobj1).path).length < 2) {
            console.log("BUSTED");
            return;
          }

          else {

            if (drivers[i].counter === 0) {
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
              elapsed = (timeDelta);
              console.log("elapsed ", elapsed);
              //elapsedArray.push(elapsed);
              console.log("elapsedArray ", elapsedArray);
              setTimeout(() => {
                drivers[i].counter = 0;
                drivers[i].state = DELIVERING;
                setDrivers(drivers);
  
                animateDelivering(i);
                function animateDelivering(i) {
                  if (drivers[i].counter === 0) {
                    // capture the start time when counter is zero
                    startTime2 = new Date().getTime();
                 
                    // update the animationPoints and animations variables to reflect the starting position
                    animationPoints2[i].features[0].geometry.coordinates = animations[i].features[0].geometry.coordinates[0];
                  }
                  // calculate the time delta based on the selected speed
                  const timeDelta2 = new Date().getTime() - startTime;
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
                  
                    setOccupied(prevOccupied => {
                      const newOccupied = prevOccupied - 1;
                      return newOccupied < 0 ? 0 : newOccupied;
                    });
                    
                    setUnoccupied(prevUnoccupied => prevUnoccupied + 1);
                  
                   
                    drivers[i].state = IDLE;
                    setDrivers(drivers);
                    elapsed2 = (timeDelta2);
                    elapsedArray.push(elapsed2);
                    customercount++;
                    console.log("elapsed2 ", elapsed2);
                    console.log("elapsedArray ", elapsedArray);
                    //var sumElapsed = Math.floor(((elapsedArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0))*(currentSpeed/60000))/nod) + foodPrepTime;
                    sumElapsed = Math.floor(((elapsedArray[elapsedArray.length - 1]))*(currentSpeed/60000)) + foodPrepTime;
                    setTotalTime(sumElapsed);

                    averageSumElapsed = Math.floor(((elapsedArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0))*(currentSpeed/60000))/customercount) + foodPrepTime;
                    setAverageTime(averageSumElapsed);
        
                    prevCustomerNumber += 1;
                    setServedCustomers((60/averageSumElapsed).toFixed(3));
                    setTotalCustomers(customercount);
        
                    console.log(`Elapsed time: ${sumElapsed} ms`);
                    console.log(`${i} IDLE`);
  
                    // delete userAssignments[`${Object.keys(userAssignments)[[driverAssignments[`driver${i}`]]]}`];
        
                    // secondCalculations(1, nou, userAssignments);
                    // restart(1, nou);
                    // animateFetching(i);
                    
                  }; 
                };
  
              }, 5000*(1/currentSpeed));
             
            }; 

          }
  
          
        };
        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const timeline = gsap.timeline();
        function run() {
          for (let i = 0; i < nod; i++) {
            if ( drivers[i].state === FETCHING) {
              timeline.add(() => animateFetching(i));
            };
          };
        };
    
        run();
     
      });});

    // Clean up on unmount
    // return () => map.update();
    if (typeof map.update === 'function') {
      map.update();
    }

  },[userInput, resetCount]); 


  //SIDE BAR /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <SideBar 
        servedCustomers ={servedCustomers}
        //totalTime ={totalTime}
        averageTime ={averageTime}
        occupied ={occupied}
        unoccupied ={unoccupied}
        handleResetClick={handleResetClick}
        handleReset={handleReset}
        inputRef={inputRef}
        inputRef2={inputRef2}/>

      <Statbar
        servedCustomers ={servedCustomers}
        totalCustomers = {totalCustomers}
        totalTime ={totalTime}
        averageTime ={averageTime}
        occupied ={occupied}
        unoccupied ={unoccupied}
        foodPrepTime={foodPrepTime}
        minSpeed={minSpeed}
        maxSpeed={maxSpeed}
        meanSpeed={meanSpeed}
        distElapsed={distElapsed}
        nou={nou}
        minInput={minInput}
      
        ></Statbar>

        <div id="elapsed-time"></div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
}

export default Map;

