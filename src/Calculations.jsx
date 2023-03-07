import PathFinder from "geojson-path-finder";
// import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import { point } from "@turf/helpers";
import myData from './data/road_line.js';
import restaurantClosest from './data/restaurants_closest.js';
// drivable roads
import user from './data/userPositions.js';
//all lines on the map 
import mapLines from './data/road_line.json';


 // Generating random begin point ///////////////////////////////////////////////////////////////////////////////////////////////////
const beginrandomIndex = Math.floor(Math.random() * myData.features.length);
// Get a random coordinate from the selected feature
export const begin = myData.features[beginrandomIndex].geometry.coordinates[0];


// 1. 3 radnom begin coordinates for 3 drivers //////
    // const getDriverCoordinates = () => {
    //   const driverCoordinates = [];
    //   while (driverCoordinates.length < 4) {
    //       const driverRandomIndex = Math.floor(Math.random() * myData.features.length);
    //       const driverRandomCoordinate = myData.features[driverRandomIndex].geometry.coordinates[0];
    //       driverCoordinates.push(driverRandomCoordinate);
    //       }
      
    //   return driverCoordinates;
    // };
    // export const driverCoordinates = getDriverCoordinates();



// GETTING 5 RANDOM USER COORDINATES FROM USERPOSTIONS.JS AND GETTING ITS CLOSEST ROAD COORDINATE FROM ALL ROADS ///////////////////////////////////////////////////////////////////////////////////////////////////
export const endCoordinates = [];
for (let i = 0; i < 5; i++) {
    // Generate a random user coordinate
    const endRandomIndex = Math.floor(Math.random() * user.features[0].geometry.coordinates.length);
    const endRandomCoordinate = user.features[0].geometry.coordinates[endRandomIndex];

    // Find the closest road coordinate to the user coordinate
    const distances = myData.features.map(feature => {
        const [x, y] = feature.geometry.coordinates[0];
        return Math.sqrt(Math.pow(endRandomCoordinate[0] - x, 2) + Math.pow(endRandomCoordinate[1] - y, 2));
    });
    const minDistance = Math.min(...distances);
    const minDistanceIndex = distances.indexOf(minDistance);
    const closestRoadCoordinate = myData.features[minDistanceIndex].geometry.coordinates[0];

    endCoordinates.push(closestRoadCoordinate);
}

/// GETTING A RANDO EATERY FOR EACH USER, CAN BE REPEATED //////////////////////////////////////////////////////////////////////////////////////////////
const eateryCoords = restaurantClosest.features[0].geometry.coordinates;

// Shuffle the eatery coordinates array
for (let i = eateryCoords.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [eateryCoords[i], eateryCoords[j]] = [eateryCoords[j], eateryCoords[i]];
}

// Assign each user to an eatery
const userAssignments = {};
for (let i = 0; i < endCoordinates.length; i++) {
  const eateryCoord = eateryCoords[i % eateryCoords.length];
  if (!userAssignments[eateryCoord]) {
    userAssignments[eateryCoord] = [];
  }
  userAssignments[eateryCoord].push(endCoordinates[i]);
}
//userAssignments is a dict with restaurant coords as its keys
// console.log(userAssignments["103.8537167571647,1.304991130893086"]);

const jsonString = JSON.stringify(userAssignments);
console.log("userAssignments "+jsonString);

// GETTING DISTANCE BETWEEN USER AND EATERY + GETTING DISTANCE BETWEEN DRIVER AND EATERY + SUMMING THEM TO GET FULL CYCLE DISTANCE ////////////////////////////////////////////
const pathFinder = new PathFinder(mapLines, { tolerance: 1e-4 });
const length1 = [];
const length2 = [];
const length3 = [];
const paths1 = [];
const paths2 = [];
for (const [eateryCoord, endCoordinates] of Object.entries(userAssignments)) {
  var LatLng = eateryCoord.replace(",", ", ").split(", ")
  var Lat = parseFloat(LatLng[0]);
  var Lng = parseFloat(LatLng[1]);
  for (const userCoord of endCoordinates) {
    const path1 = pathFinder.findPath(
      point([Lat, Lng]),
      point([userCoord[0], userCoord[1]]),
    );
    paths1.push(path1);
    length1.push(path1.weight);
  }

  for (let i = 0; i < 5; i++) {
    const path2 = pathFinder.findPath(
      point([begin[0], begin[1]]),
      point([Lat, Lng]),
    );
    paths2.push(path2);
    length2.push(path2.weight);
  }
  
}
//length3 array contains 5 total full cycle distances the driver has to do from spawning
for (let i = 0; i < length1.length; i++) {
  length3.push(length1[i] + length2[i]);
}


// FINDING FASTEST DELIVERY FOR DRIVER /////////////////////////////////////////////////////////////////////////////////////////////////////

const minLength = Math.min(...length3);
const minIndex = length3.indexOf(minLength);
const shortestPath1 = paths1[minIndex];
const shortestPath2 = paths2[minIndex];


// FINDING CLOSEST USER (out of random list) TO DRIVER /////////////////////////////////////////////////////////////////////////////////////////////////////
const pickDistances = endCoordinates.map(feature => {
    const [x, y] = feature;
    return Math.sqrt(Math.pow(begin[0] - x, 2) + Math.pow(begin[1] - y, 2));
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
export var path = shortestPath1;
console.log("weight "+ path.weight);
