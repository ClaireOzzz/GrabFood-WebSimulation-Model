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


