import PathFinder from "geojson-path-finder";
// import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import { point } from "@turf/helpers";
import myData from './data/road_line.js';
import restaurantClosest from './data/restaurants_closest.js';
// drivable roads
import user from './data/userPositions.js';
//all lines on the map 
import mapLines from './data/road_line.json';

export var driverCoordinates = [];
export var userCoordinates = [];
export var shortestPaths = [];
var shortestDistance = Infinity;
var endCoordinates = [];
var userAssignments = {};
var paths = [];
var distances = [];
var spawnpoint =[];
var indices = [];
var permutations = [];

const pathFinder = new PathFinder(mapLines, { tolerance: 1e-4 });
// const nou = 5;
// const nod = 5;

export default function calculations(nod, nou) {
  driverCoordinates = [];
  userCoordinates = [];
  shortestPaths = [];
  endCoordinates = [];
  userAssignments = {};
  distances = [];
  spawnpoint = [];
  paths =[];
  permutations = [];
  indices = [];
 
  // GETS RANDOM DRIVER COORDINATES 
  console.log('calc restart')
  while (driverCoordinates.length < nod) {
      const driverRandomIndex = Math.floor(Math.random() * myData.features.length);
      const driverRandomCoordinate = myData.features[driverRandomIndex].geometry.coordinates[0];
      driverCoordinates.push(driverRandomCoordinate);
  };

  // GETTING RANDOM CUSTOMER COORDINATES FROM USERPOSTIONS.JS AND GETTING ITS CLOSEST ROAD COORDINATE FROM ALL ROADS 
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

  /// GETTING A RANDOM EATERY FOR EACH USER //////////////////////////////////////////////////////////////////////////////////////////////
  const eateryCoords = restaurantClosest.features[0].geometry.coordinates;
  
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

  ////////////////////////////////////////////////////////////////////////////////////////////////

  

  function generatePermutations(numDrivers, numCustomers) {
    
    for (let i = 0; i < numDrivers; i++) {
      indices.push(i);
    }

    permute(permutations, indices, 0, Math.min(numCustomers, numDrivers));

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
  generatePermutations(nod, nou);
  const customerCoords = Object.values(userAssignments);

  for (const assignment of permutations) {

    for (let i = 0; i < Math.min(nod, nou); i++) {
      spawnpoint = [ driverCoordinates[i][0], driverCoordinates[i][1] ];
      // console.log("userAssignments ", userAssignments)
      // console.log("nod ", nod);
      // console.log("i ", i);
      var LatLng = Object.keys(userAssignments)[i].split(",") // keys = eatery, values = CUSTOMER
      var Lat = parseFloat(LatLng[0]);
      var Lng = parseFloat(LatLng[1]); // gets eatery location for assigned user

      const customerCoord = customerCoords[assignment[i]][0];
      // console.log("customerCoord  ",customerCoord)
      const pathToEatery = pathFinder.findPath(
        point([parseFloat(spawnpoint[0]), parseFloat(spawnpoint[1])]),
        point([Lat, Lng]));
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
      // console.log("paths ", paths);
      shortestPaths = paths;
      shortestDistance = totalDistance;
    }
  }
};

calculations(3 , 5);

//Get eatery to customer path
// const pathToEatery = pathFinder.findPath(
let eateryToCustomerArray = []
let eateryToCustomerDist = []
var driverToEateryDict ={}
var driverFullDist = {};

function newCalculations(nod, nou) {
  
  //FINDING DISTANCE BETWEEN EATERY AND CUSTOMER
  var counter = 0;
  for (const eateryCoord of Object.keys(userAssignments)) {
    var LatLng = eateryCoord.replace(",", ", ").split(", ")
    var Lat = parseFloat(LatLng[0]);
    var Lng = parseFloat(LatLng[1]);
    for (const userCoord of userAssignments[eateryCoord]) {
      counter += 1;
      const pathToCustomer =  pathFinder.findPath(
        point([Lat, Lng]),
        point([userCoord[0], userCoord[1]])
      ); 
      eateryToCustomerArray.push(pathToCustomer);
      eateryToCustomerDist.push(pathToCustomer.weight);
    }
    
  }
  console.log("eateryToCustomerDist ", eateryToCustomerDist);
  console.log("userAssignments ", userAssignments);
  //////////////////////////////////////////////
  
  // BUILD THE DICTIONARY THAT HOLDS THE FULL CYCLE DISTANCES FOR ALL DRIVERS
  for (let i = 0; i < nod; i++) {
    var j =0;
    // get the driver's coordinates
    spawnpoint = [ driverCoordinates[i][0], driverCoordinates[i][1] ];
    const driverName = `driver${i}`;
  
    // initialize an empty array to hold the driver's distances to each eatery
    let driverFullDistances = [];
    let driverToEateryPath =[]
    // loop through each eatery in userAssignments
    for (const eateryCoord of Object.keys(userAssignments)) { 
      var LatLng = eateryCoord.replace(",", ", ").split(", ")
      var Lat = parseFloat(LatLng[0]);
      var Lng = parseFloat(LatLng[1]);
  
      // calculate the distance from the driver to the eatery using pathFinder.findPath()
      const ptE = pathFinder.findPath(
        point([parseFloat(spawnpoint[0]), parseFloat(spawnpoint[1])]),
        point([Lat, Lng]));
      driverToEateryPath.push(ptE)

      var fullDistance = 0;
      console.log("j ", j);
      fullDistance = ptE.weight + eateryToCustomerDist[j];  
      console.log("fullDistance= ", fullDistance, "ptE.weight= ", ptE.weight, "eateryToCustomerDist[j]= ", eateryToCustomerDist[j]);
      driverFullDistances.push(fullDistance);
      j += 1;
    }
    // add the driverFullDistances array to the driverFullDist object
    console.log("driverFullDistances ", driverFullDistances);
    driverFullDist[driverName] = driverFullDistances;
    driverToEateryDict[driverName] = driverToEateryPath
    //////////////////////////////////////////////
  }
}

newCalculations(3, 5);

console.log("eateryToCustomerDist ", eateryToCustomerDist);
console.log("driverToEateryDict ", driverToEateryDict);

// let driverFullDist2 = {
//   "driver1": [20, 20, 30, 40, 50],
//   "driver2": [6, 70, 80, 90, 100],
//   "driver3": [110, 120, 130, 140, 150]
// };
// let distances2 = Array(Object.keys(driverFullDist).length).fill(Infinity);
let minDistance2 = Math.min(...Object.values(driverFullDist).flat());
console.log("minDistance2 ", minDistance2);
let index = -1; // Initialize index to -1 as a flag value
let d = "";
for (let driver in driverFullDist) {
  let driverIndex = driverFullDist[driver].indexOf(minDistance2);
  if (driverIndex !== -1) { // Check if 100 is found in the current array
    index = driverIndex;
    console.log("driver ", driver);
    d = driver;
    break; // Exit the loop once min is found
  }
}

console.log("index ", index); // index of eatery with minimum distance
console.log("d ", d); // driver with minimum distance
console.log("CALL 1 ", driverToEateryDict[d][index].weight); // path from driver to eatery
console.log("CALL 2 ", eateryToCustomerDist[index]); // path from eatery to customer









// let distances2 = []

// let assignedDrivers = {};
// let shortdist = [];
// // loop through each index of the distance arrays in the dictionary
// for (let i = 0; i < 5; i++) {
//   let minValue = Infinity;
//   let minKey;
  
//   // loop through each key-value pair in the dictionary
//   for (let key in driverFullDist2) {
//     console.log("key ", key);
//     distances2 = driverFullDist2[key];
//     let distance = distances2[i];
//     // console.log("distance ", distance);
//     // compare the distance to the minimum value found so far
//     if (distance < minValue) {
//       minValue = distance;
//       minKey = key;
//     }
//   }
//   shortdist.push(distances2[i]);
  
//   // add the driver and index of minimum distance to assignedDrivers
//   assignedDrivers[minKey] = i;
//   // remove the driver and all its distances from driverFullDist
//   delete driverFullDist2[minKey];
  
//   // replace all other distances at that index with infinity
//   for (let key in driverFullDist2) {
//     distances2 = driverFullDist2[key];
   
//     distances2[i] = Infinity;
//     console.log(i," ", distances2);
//   }
// }
// console.log("shortdist ", shortdist); 
// console.log("assignedDrivers1 ", assignedDrivers["driver1"]); 



// calculations(5, 3);
// console.log("done with 3, 3")
// console.log("shortestPaths ", shortestPaths)
// console.log("userCoordinates ", userCoordinates)
// console.log("driverCoordinates ", driverCoordinates)

// calculations(3, 1);
// console.log("done with 2ND 2, 3")
// console.log("shortestPaths2 ", shortestPaths)
// console.log("userCoordinates2 ", userCoordinates)
// console.log("driverCoordinates2 ", driverCoordinates)


// // Get the driver key from the assignedDrivers dictionary
// const driverKey = Object.keys(assignedDrivers)[0]; // 'driver1'

// // Use the driver key to retrieve the path from the driverToEateryPath dictionary
// const driverPath = driverToEateryPath[driverKey][assignedDrivers[driverKey]]; // path0
// console.log("driverPath ", driverPath);