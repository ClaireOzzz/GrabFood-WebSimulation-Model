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
// const beginrandomIndex = Math.floor(Math.random() * myData.features.length);
// export const driverSpawn = myData.features[beginrandomIndex].geometry.coordinates[0];

// 3 random begin coordinates for 3 drivers //////
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
    console.log("driverCoordinates "+ driverCoordinates[0])

// GETTING 5 RANDOM USER COORDINATES FROM USERPOSTIONS.JS AND GETTING ITS CLOSEST ROAD COORDINATE FROM ALL ROADS ///////////////////////////////////////////////////////////////////////////////////////////////////

export const generateCoordinates = (count) => {
  const endCoordinates = [];
  const userCoordinates = [];

  for (let i = 0; i < count; i++) {
    // Generate a random user coordinate
    const endRandomIndex = Math.floor(Math.random() * user.features[0].geometry.coordinates.length);
    const endRandomCoordinate = user.features[0].geometry.coordinates[endRandomIndex];
    userCoordinates.push(endRandomCoordinate);

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
  return {
    endCoordinates,
    userCoordinates
  };
};

export const { endCoordinates, userCoordinates } = generateCoordinates(5);


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
  export const assignments =  userAssignments;
  
// GETTING DISTANCE BETWEEN USER AND EATERY + GETTING DISTANCE BETWEEN DRIVER AND EATERY + SUMMING THEM TO GET FULL CYCLE DISTANCE ////////////////////////////////////////////

export function calculateFullCycle(userAssignments, spawnpoint) {
  const pathFinder = new PathFinder(mapLines, { tolerance: 1e-4 });
  const length1 = [];
  const length2 = [];
  const length3 = [];
  const paths1 = [];
  const paths2 = [];

  // Find the path between driverSpawn and each eatery
  for (const eateryCoord of Object.keys(userAssignments)) {
    var LatLng = eateryCoord.replace(",", ", ").split(", ")
    var Lat = parseFloat(LatLng[0]);
    var Lng = parseFloat(LatLng[1]);

    const path1 = pathFinder.findPath(
      point([spawnpoint[0], spawnpoint[1]]),
      point([Lat, Lng]),
    );
    
    paths1.push(path1);
    length1.push(path1.weight);

    // Find the path between eatery and each user coordinate
    for (const userCoord of userAssignments[eateryCoord]) {
      const path2 = pathFinder.findPath(
        point([Lat, Lng]),
        point([userCoord[0], userCoord[1]]),
      );
      paths2.push(path2);
      length2.push(path2.weight);
    }
  }

  // Calculate the full cycle distance for each eatery and its associated user coordinates
  for (let i = 0; i < length2.length; i++) {
    length3.push(length1[i] + length2[i]);
  }

  const minIndex = length3.indexOf(Math.min(...length3));
  const shortestPath1 = paths1[minIndex];
  const shortestPath2 = paths2[minIndex];
  return { shortestPath1, shortestPath2 };
}


export const { shortestPath1, shortestPath2 } = calculateFullCycle(userAssignments, driverCoordinates[0]);
export const { shortestPath3, shortestPath4 } = calculateFullCycle(userAssignments, driverCoordinates[1]);
console.log("shortestPath3 "+shortestPath3);

const fullCycle1 = calculateFullCycle(userAssignments, driverCoordinates[0]);
const fullCycle2 = calculateFullCycle(userAssignments, driverCoordinates[1]);

// Export the outputs
export { fullCycle1, fullCycle2 };
console.log("fullCycle1 "+fullCycle1[0]);

// GETTING ROUTE ///////////////////////////////////////////////////////////////////////////////////////////////////
// export var path = shortestPath1;
// console.log("endCoordinates "+ endCoordinates); //The closest road coordinate to the customers  
// console.log("userCoordinates "+ userCoordinates); //actual user coordinates
// console.log("shortestPath1 "+ shortestPath2.path[(shortestPath2.path.length)-1]);
