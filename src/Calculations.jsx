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
var endCoordinates = [];
var userAssignments = {};
var paths = [];
var distances = [];
var spawnpoint =[];

// second calculations
export var driverAssignments = {};
let driverFullDistances = [];
let driverToEateryPath =[]

const pathFinder = new PathFinder(mapLines, { tolerance: 1e-4 });


export default function calculations(nod, nou) {
  driverCoordinates = [];
  userCoordinates = [];
  endCoordinates = [];
  userAssignments = {};
  distances = [];
  spawnpoint = [];
  paths =[];
 
 
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
};

// calculations(2, 3);

export var eateryToCustomerArray = []
let eateryToCustomerDist = []
export var driverToEateryDict ={}
var driverFullDist = {};

export function secondCalculations(nod, nou) {
  eateryToCustomerArray = []
  eateryToCustomerDist = []
  driverToEateryDict ={}
  driverFullDist = {};
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
  ////////////////////////////////////////////////
  var ptE;
  // BUILD THE DICTIONARY THAT HOLDS THE FULL CYCLE DISTANCES FOR ALL DRIVERS
  for (let i = 0; i < nod; i++) {
    var j =0;
    // get the driver's coordinates
    spawnpoint = [ driverCoordinates[i][0], driverCoordinates[i][1] ];
    const driverName = `driver${i}`;

    driverFullDistances = [];
    driverToEateryPath =[];

    // loop through each eatery in userAssignments
    for (const eateryCoord of Object.keys(userAssignments)) { 
      var LatLng = eateryCoord.replace(",", ", ").split(", ")
      var Lat = parseFloat(LatLng[0]);
      var Lng = parseFloat(LatLng[1]);
  
      // calculate the distance from the driver to the eatery using pathFinder.findPath()
      ptE = pathFinder.findPath(
        point([parseFloat(spawnpoint[0]), parseFloat(spawnpoint[1])]),
        point([Lat, Lng]));
      driverToEateryPath.push(ptE)

      var fullDistance = 0;
      // console.log("j ", j);
      fullDistance = ptE.weight + eateryToCustomerDist[j];  
      // console.log("fullDistance= ", fullDistance, "ptE.weight= ", ptE.weight, "eateryToCustomerDist[j]= ", eateryToCustomerDist[j]);
      driverFullDistances.push(fullDistance);
      j += 1;
    }
    // add the driverFullDistances array to the driverFullDist object

    driverFullDist[driverName] = driverFullDistances;
    // console.log("driverFullDistances33 ", driverFullDistances);
    driverToEateryDict[driverName] = driverToEateryPath
   
    //////////////////////////////////////////////
  }

  // move inside 
  var d = "";
  let index = -1; // Initialize index to -1 as a flag value
  function getMinDistance(driverFullDist) {
    let minDistance2 = Math.min(...Object.values(driverFullDist).flat());
    console.log("minDistance2 ", minDistance2);
    index = -1
    for (let driver in driverFullDist) {
      let driverIndex = driverFullDist[driver].indexOf(minDistance2);
      if (driverIndex !== -1) { // Check if 100 is found in the current array
        index = driverIndex;
        console.log("driver ", driver);
        d = driver;
        if (minDistance2 === Infinity) break;
        else driverAssignments[d] = index;
        break; // Exit the loop once min is found
      }
    }
    //1. remove driver
    console.log("driverFullDist ", driverFullDist);
    delete driverFullDist[d];
    console.log("driverFullDist ", driverFullDist);

    //2. replace eatery index with infinity
    // console.log("index ", index); // index of eatery with minimum distance
    for (let driver in driverFullDist) {
      driverFullDist[driver][index] = Infinity;
    }

    console.log("driverFullDist ", driverFullDist);
    console.log("d ", d);       // driver with minimum distance
  }

    //LOOP THROUGH DRIVERS
    for (let k = 0; k < nod; k++ ) {
      console.log("k ", k);
      getMinDistance(driverFullDist) 

      console.log("CALL 1 ", driverToEateryDict[d][index].weight); // path from driver to eatery
      console.log("CALL 2 ", eateryToCustomerDist[index]); // path from eatery to customer
    }
}



// secondCalculations(2, 3);


// console.log("driverAssignments ", driverAssignments);
// console.log("Object.keys(driverAssignments)[0] ", Object.keys(driverAssignments)[0]);
// console.log("driverToEateryPath ", driverToEateryPath);

// //gives path 1
// console.log("driverToEateryPath333 ", driverToEateryDict["driver0"][driverAssignments["driver0"]]);

// //gives path 2
// console.log("eateryToCustomerArray ", eateryToCustomerArray[driverAssignments["driver0"]])


//driverToEateryDict[driverName] = driverToEateryPath
//eateryToCustomerArray.push(pathToCustomer);

