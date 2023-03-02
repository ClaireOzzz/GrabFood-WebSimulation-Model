import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import mapLines from './data/road_line.json';
import * as turf from '@turf/turf';

//Seperate components
import SideBar from './Sidebar';
import { start, path, endCoordinates } from './Calculations';

//icons
import motoIcon from './icons/moto.png'; 
import userIcon from './icons/user (7).png'; 
import user from './data/userPositions.js';
import myData from './data/road_line.js';

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
      zoom: 15.5,
      fadeDuration: 0
    });
    console.log("test"+myData.features[0].geometry.coordinates.length);
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
    // low frame rate. multiplied by lineDistance for consistancy
    const steps = 400*lineDistance;

    // Draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(route.features[0], i);
        arc.push(segment.geometry.coordinates);  
    };

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;
    

    // Used to increment the value of the point measurement against the route.
    let counter = 0;


    // CUSTOMER ICONS //////////////////////////////////////////////////////////////////////////////////////////////////////////
    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(userIcon, (error, image) => {
        if (error) throw error;
        map.addImage("custom-marker", image);
    
        // Define an array of coordinates for the markers
        const coordinates = endCoordinates;
    
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
              'line-width': 4,
              'line-color': '#4C00b0'
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



    // Clean up on unmount
    return () => map.update();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps




//SIDE BAR /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div>
      <SideBar/>
      
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
}

export default Map;
