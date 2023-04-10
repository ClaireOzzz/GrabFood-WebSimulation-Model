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
var driverPathDist ={}
var driverDist = {};
function newCalculations(nod, nou) {
  
  //FINDING DISTANCE BETWEEN EATERY AND CUSTOMER
  for (const eateryCoord of Object.keys(userAssignments)) {
    var LatLng = eateryCoord.replace(",", ", ").split(", ")
    var Lat = parseFloat(LatLng[0]);
    var Lng = parseFloat(LatLng[1]);
    for (const userCoord of userAssignments[eateryCoord]) {
      const pathToCustomer =  pathFinder.findPath(
        point([Lat, Lng]),
        point([userCoord[0], userCoord[1]])
      );
      eateryToCustomerArray.push(pathToCustomer);
      eateryToCustomerDist.push(pathToCustomer.weight);
    }
  }
  //////////////////////////////////////////////

  // BUILD THE DICTIONARY THAT HOLDS THE FULL CYCLE DISTANCES FOR ALL DRIVERS
  for (let i = 0; i < driverCoordinates.length; i++) {
    // get the driver's coordinates
    spawnpoint = [ driverCoordinates[i][0], driverCoordinates[i][1] ];
    // const driverLatLng = driverCoordinates[i];
    // const driverLat = driverLatLng[0];
    // const driverLng = driverLatLng[1];
    const driverName = `driver${i+1}`;
  
    // initialize an empty array to hold the driver's distances to each eatery
    let driverDistances = [];
    let driverDistancesPath =[]
    // loop through each eatery in userAssignments
    for (const eateryCoord of Object.keys(userAssignments)) {
      var LatLng = eateryCoord.replace(",", ", ").split(", ")
      var Lat = parseFloat(LatLng[0]);
      var Lng = parseFloat(LatLng[1]);
  
      // calculate the distance from the driver to the eatery using pathFinder.findPath()
      const ptE = pathFinder.findPath(
        point([parseFloat(spawnpoint[0]), parseFloat(spawnpoint[1])]),
        point([Lat, Lng]));
      const distanceToEatery = ptE.weight;
      var fullDistance = 0;
      for (let j = 0; j < eateryToCustomerDist.length; j++) { //so that the 1st driver does not get the only users
        fullDistance = ptE.weight + eateryToCustomerDist[j];  
      }
      // add the distance to the driverDistances array
      driverDistances.push(fullDistance);
      driverDistancesPath.push(ptE)
    }
    // add the driverDistances array to the driverDist object
    driverDist[driverName] = driverDistances;
    driverPathDist[driverName] = driverDistancesPath
    //////////////////////////////////////////////

    // GET THE MINIMUM DISTANCE FROM THE WHOLE DICTIONARY, THEN REMOVE THAT DRIVER UNTIL THERE ARE NONE LEFT


  }
}

newCalculations(3, 5);
console.log("driverDist ", driverDist);
console.log("driverPathDist ", driverPathDist);

let driverDist2 = {
  "driver1": [50, 20, 30, 40, 10],
  "driver2": [60, 70, 80, 90, 100],
  "driver3": [110, 120, 130, 140, 150]
};
// let distances2 = Array(Object.keys(driverDist).length).fill(Infinity);
let distances2 = []

let assignedDrivers = {};
let shortdist = [];
// loop through each index of the distance arrays in the dictionary
for (let i = 0; i < 5; i++) {
  let minValue = Infinity;
  let minKey;
  
  // loop through each key-value pair in the dictionary
  for (let key in driverDist2) {
    console.log("key ", key);
    distances2 = driverDist2[key];
    let distance = distances2[i];
    // console.log("distance ", distance);
    // compare the distance to the minimum value found so far
    if (distance < minValue) {
      minValue = distance;
      minKey = key;
    }
  }
  shortdist.push(distances2[i]);
  
  // add the driver and index of minimum distance to assignedDrivers
  assignedDrivers[minKey] = i;
  // remove the driver and all its distances from driverDist
  delete driverDist2[minKey];
  
  // replace all other distances at that index with infinity
  for (let key in driverDist2) {
    distances2 = driverDist2[key];
   
    distances2[i] = Infinity;
    console.log(i," ", distances2);
  }
}
console.log("shortdist ", shortdist); 
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

// // Use the driver key to retrieve the path from the driverDistancesPath dictionary
// const driverPath = driverDistancesPath[driverKey][assignedDrivers[driverKey]]; // path0
// console.log("driverPath ", driverPath);