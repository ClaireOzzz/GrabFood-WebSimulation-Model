# Systems-Design-Studio-2023

npm cache clean --force  (run only if there are errors after npm i)

npm i

npm i @turf/turf

npm install --save geojson-path-finder

npm start


layer for routes was extracted using:
https://mygeodata.cloud/osm/data/download/

How the path is chosen between driver and closest user: (26th Feb)

1. Get random driver position from road_line.js coordinates ->  start coordinate

2. Get random list of 5 user positions from userPositions.js -> gives endCoordinates
3. Get closest user to driver -> user position
4. Calculate the closest road coordinate to the user (who is in a building) -> finish coordinate

5. Use pathFinder

// define drivers and customers
const drivers = [
  { name: "driver1", coordinates: [lng1, lat1], state: "idle", assignedCustomer: null },
  { name: "driver2", coordinates: [lng2, lat2], state: "idle", assignedCustomer: null },
  { name: "driver3", coordinates: [lng3, lat3], state: "idle", assignedCustomer: null }
];
const customers = [
  { name: "customer1", coordinates: [lng4, lat4], assignedDriver: null },
  { name: "customer2", coordinates: [lng5, lat5], assignedDriver: null },
  { name: "customer3", coordinates: [lng6, lat6], assignedDriver: null },
  { name: "customer4", coordinates: [lng7, lat7], assignedDriver: null },
  { name: "customer5", coordinates: [lng8, lat8], assignedDriver: null }
];

// calculate distances between drivers and customers
const distances = [];
for (const driver of drivers) {
  const driverDistances = [];
  for (const customer of customers) {
    const distance = turf.distance(driver.coordinates, customer.coordinates);
    driverDistances.push({ customer: customer, distance: distance });
  }
  driverDistances.sort((a, b) => a.distance - b.distance);
  distances.push({ driver: driver, distances: driverDistances });
}

// assign closest customer to each driver
for (const item of distances) {
  const driver = item.driver;
  const closestCustomer = item.distances[0].customer;
  driver.assignedCustomer = closestCustomer;
  closestCustomer.assignedDriver = driver;
}

// animate drivers to assigned customers
for (const driver of drivers) {
  const assignedCustomer = driver.assignedCustomer;
  const path = pathFinder.findPath(point(driver.coordinates), point(assignedCustomer.coordinates));
  const route = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': path.path
        }
      }
    ]
  };
  const point2 = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': driver.coordinates
        }
      }
    ]
  };
  const lineDistance = path.weight;
  const steps = 400 * lineDistance;
  const arc = [];
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route.features[0], i);
    arc.push(segment.geometry.coordinates);
  };
  route.features[0].geometry.coordinates = arc;
  let counter =
