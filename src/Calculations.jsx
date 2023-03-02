import PathFinder from "geojson-path-finder";
// import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import { point } from "@turf/helpers";
import myData from './data/road_line.js';
// drivable roads
import user from './data/userPositions.js';
//all lines on the map 
import mapLines from './data/road_line.json';


 // Generating random start point ///////////////////////////////////////////////////////////////////////////////////////////////////
const startrandomIndex = Math.floor(Math.random() * myData.features.length);
// Get a random coordinate from the selected feature
export const start = myData.features[startrandomIndex].geometry.coordinates[0];



// 1. 3 radnom start coordinates for 3 drivers //////
    const getDriverCoordinates = () => {
      const driverCoordinates = [];
      while (driverCoordinates.length < 4) {
          const driverRandomIndex = Math.floor(Math.random() * myData.features.length);
          const driverRandomCoordinate = myData.features[driverRandomIndex].geometry.coordinates[0];
          driverCoordinates.push(driverRandomCoordinate);
          }
      
      return driverCoordinates;
    };
    export const driverCoordinates = getDriverCoordinates();
    



// GETTING 5 RANDOM USER COORDINATES FROM USERPOSTIONS.JS ///////////////////////////////////////////////////////////////////////////////////////////////////
const getEndCoordinates = () => {
    const endCoordinates = [];
    while (endCoordinates.length < 5) {
        const endRandomIndex = Math.floor(Math.random() * user.features[0].geometry.coordinates.length);
        const endRandomCoordinate = user.features[0].geometry.coordinates[endRandomIndex];
        // ensuring no duplicates occur
        if (!endCoordinates.some(coord => coord.toString() === endRandomCoordinate.toString())) {
            endCoordinates.push(endRandomCoordinate);
        }
    }
    return endCoordinates;
}
export const endCoordinates = getEndCoordinates();
// console.log("endCoordinates " + endCoordinates);

/// 2. return 3 closest customers to those 3 driver ///// has to loop and compare mimnimum dist out of 15 distances




// FINDING CLOSEST USER (out of random list) TO DRIVER /////////////////////////////////////////////////////////////////////////////////////////////////////
const pickDistances = endCoordinates.map(feature => {
    const [x, y] = feature;
    return Math.sqrt(Math.pow(start[0] - x, 2) + Math.pow(start[1] - y, 2));
});
const shortest = Math.min(...pickDistances);
const shortestIndex = pickDistances.indexOf(shortest);
const userPosition = endCoordinates[shortestIndex];
// console.log("userPosition" + userPosition);




// Finding closest road coordinate to the user /////////////////////////////////////////////////////////////////////////////////////
// const userPosition = [103.85213017208162,1.298779620518431];
const distances = myData.features.map(feature => {
    const [x, y] = feature.geometry.coordinates[0];
    return Math.sqrt(Math.pow(userPosition[0] - x, 2) + Math.pow(userPosition[1] - y, 2));
});

// Find the minimum distance and its index in the distances array
const minDistance = Math.min(...distances);
const minDistanceIndex = distances.indexOf(minDistance);

// Get the closest coordinate
export const finish = myData.features[minDistanceIndex].geometry.coordinates[0];



// Getting shortest route ///////////////////////////////////////////////////////////////////////////////////////////////////
var pathFinder = new PathFinder(mapLines, { tolerance: 1e-4 });
export var path = pathFinder.findPath(point(start), point(finish));