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

// const pathFinder = new PathFinder(mapLines, { tolerance: 1e-4 });
const prepnod = 5;
const prepnou = 5;
export var driverCoordinates = [];
export var userCoordinates = [];
export let shortestPaths = [];
let shortestDistance = Infinity;
var endCoordinates = [];
var userAssignments = {};

export default function calculations(nod, nou) {
  console.log('calc restart');
  const pathFinder = new PathFinder(mapLines, { tolerance: 1e-4 });
  while (driverCoordinates.length < nod) {
      const driverRandomIndex = Math.floor(Math.random() * myData.features.length);
      const driverRandomCoordinate = myData.features[driverRandomIndex].geometry.coordinates[0];
      driverCoordinates.push(driverRandomCoordinate);
  };

  // GETTING 5 RANDOM USER COORDINATES FROM USERPOSTIONS.JS AND GETTING ITS CLOSEST ROAD COORDINATE FROM ALL ROADS 
  for (let i = 0; i < nou; i++) {
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
  };

  /// GETTING A RANDO EATERY FOR EACH USER, CAN BE REPEATED //////////////////////////////////////////////////////////////////////////////////////////////
  const eateryCoords = restaurantClosest.features[0].geometry.coordinates;
  
  // Shuffle the eatery coordinates array
  for (let i = eateryCoords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [eateryCoords[i], eateryCoords[j]] = [eateryCoords[j], eateryCoords[i]];
  }
  // Assign each user to an eatery
  for (let i = 0; i < endCoordinates.length; i++) {
    const eateryCoord = eateryCoords[i % eateryCoords.length];
    if (!userAssignments[eateryCoord]) {
      userAssignments[eateryCoord] = [];
    }
    userAssignments[eateryCoord].push(endCoordinates[i]);
  }


  function generatePermutations(numDrivers, numCustomers) {
    const permutations = [];
    const indices = [];

    for (let i = 0; i < numDrivers; i++) {
      indices.push(i);
    }

    permute(permutations, indices, 0, numCustomers);

    return permutations;
  };

  function permute(permutations, indices, start, end) {
    if (start === end) {
      permutations.push([...indices]);
    } else {
      for (let i = start; i < end; i++) {
        [indices[start], indices[i]] = [indices[i], indices[start]];
        permute(permutations, indices, start + 1, end);
        [indices[start], indices[i]] = [indices[i], indices[start]];
      }
    }
  };


  //SHORTEST PATHS 

  const permutations = generatePermutations(driverCoordinates.length, Object.values(userAssignments).length);
  const customerCoords = Object.values(userAssignments);

  for (const assignment of permutations) {
    const paths = [];
    const distances = [];

    for (let i = 0; i < driverCoordinates.length; i++) {
      var spawnpoint = [ driverCoordinates[i][0], driverCoordinates[i][1] ];
      var LatLng = Object.keys(userAssignments)[i].replace(",", ", ").split(", ") // keys = eatery, values = user
      var Lat = parseFloat(LatLng[0]);
      var Lng = parseFloat(LatLng[1]); // gets eatery location for assigned user
      const customerCoord = customerCoords[assignment[i]][0];
      // console.log("customerCoord  ",customerCoord)
      const pathToEatery = pathFinder.findPath( point([parseFloat(spawnpoint[0]), parseFloat(spawnpoint[1])]), point([Lat, Lng]));
      const pathToCustomer =  pathFinder.findPath(
        point([Lat, Lng]),
        point([customerCoord[0], customerCoord[1]]),
      );
      paths.push([pathToEatery, pathToCustomer]);
      distances.push(pathToEatery.weight + pathToCustomer.weight);
    }
    // console.log(paths[0][0]);

    // const totalDistance = distances.reduce((acc, distance) => acc + distance, 0);
    const totalDistance = paths.reduce((acc, path) => acc + path[0].weight + path[1].weight, 0);


    if (totalDistance < shortestDistance) {
      shortestPaths = paths;
      shortestDistance = totalDistance;
    }
  }
};

calculations(prepnod, prepnou);



