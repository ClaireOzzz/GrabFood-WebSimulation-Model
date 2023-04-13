import randomNormal from 'random-normal';
import {conditions, driver_speed_array, nod} from './Map';

var all_drivers_speeds;
var speed = 1

const generate_speeds = function() {
  var driver_speed_array = [];
  speed = 1
  all_drivers_speeds = driver_speed_array
    for (let i = 0; i < nod; i++) {
      speed = 1;
      if (conditions[2] === 'ebicycle') { //if ebike
        speed = speed * (randomNormal({mean:19.5, dev:3.42}));
        if (conditions[0] === 'night' || conditions[0] === 'midnight') { //if ebike + night
          speed = speed/1.68;
          if (conditions[1] === 'rainy') {  //if ebike + night + rain (2 cases)
            const slow_down = Math.random()*(6-3.6)+3.6;
            var will_slow_down = Math.random();
            if (will_slow_down < 0.34) { // if ebike + night + rain + driver did not slow down
              speed = speed;
              console.log("speed before speed cap: ", speed);
              if (speed >25) { // if  ebike + night + rain + did not slow down + speeding
                speed = 25;
              }
              else { //if  ebike + night + rain + did not slow down + not speeding
                speed = speed;
              }
            }
            else {  //if  ebike + night + rain + slow down
              speed = speed*(1-(slow_down/100));

              if (speed >25) { // if  ebike + night + rain + slow down + speeding
                speed = 25;
              }
              else { //if  ebike + night + rain + slow down + not speeding
                speed = speed;
              }
            }
          }
          else {  //if ebike + night + normal (2 cases)
            speed = speed;
            if (speed >25) { // if  ebike + night + normal + speeding
              speed = 25;
            }
            else { //if  ebike + night + normal + not speeding
              speed = speed;
            }
          }
        }
        else {  //if ebike + day
          if (conditions[1] === 'rainy') {  //if ebike + day + rain (2 cases)
            const slow_down = Math.random()*(6-3.6)+3.6;
            var will_slow_down = Math.random();
            if (will_slow_down < 0.34) {  // if  ebike + day + rain + did not slow down
              speed = speed;
              if (speed >25) { // if  ebike + day + rain + did not slow down + speeding
                speed = 25;
              }
              else { //if  ebike + day + rain + did not slow down + not speeding
                speed = speed;
              }
            }
            else {  // if  ebike + day + rain + slow down
              speed = speed*(1-(slow_down/100));
              if (speed >25) { // if  ebike + day + rain + slow down + speeding
                speed = 25;
              }
              else { //if  ebike + day + rain + slow down + not speeding
                speed = speed;
              }
            }
          }
          else {  //if ebike + day + normal (2 cases)
            speed = speed
            if (speed >25) { // if ebike + day + normal + speeding
              speed = 25;
            }
            else { //if ebike + day + normal + not speeding
              speed = speed;
            }
          }
        }
      }

      else if (conditions[2] === 'motorcycle') { //if motorcycle
        console.log('ran21');
        speed = speed*(randomNormal({mean: 38.28, dev: 10.94}));
        if (conditions[0] === 'night' || conditions[0] === 'midnight') { //if motorcycle + night
          console.log('ran22');
          speed = speed/1.68;
          if (conditions[1] === 'rainy') {  //if motorcycle + night + rain (2 cases)
            console.log('ran23');
            const slow_down = Math.random()*(6-3.6)+3.6;
            var will_slow_down = Math.random();
            if (will_slow_down < 0.34) { // if motorcycle + night + rain + driver did not slow down
              speed = speed;
              console.log('ran24');
              if (speed >50) { // if  motorcycle + night + rain + did not slow down + speeding
                console.log('ran25');
                speed = 50;
              }
              else { //if  motorcycle + night + rain + did not slow down + not speeding
                console.log('ran26');
                speed = speed;
              }
            }
            else {  //if  motorcycle + night + rain + slow down
              console.log('ran27');
              speed = speed*(1-(slow_down/100));
              if (speed >50) { // if  motorcycle + night + rain + slow down + speeding
                console.log('ran28');
                speed = 50;
              }
              else { //if  motorcycle + night + rain + slow down + not speeding
                console.log('ran29');
                speed = speed;
              }
            }
          }
          else {  //if motorcycle + night + normal (2 cases)
            speed = speed
            if (speed >50) { // if  motorcycle + night + normal + speeding
              console.log('ran30');
              speed = 50;
            }
            else { //if  motorcycle + night + normal + not speeding
              console.log('ran31');
              speed = speed;
            }
          }
        }
        else {  //if motorcycle + day
          if (conditions[1] === 'rainy') {  //if motorcycle + day + rain (2 cases)
            console.log('ran32');
            const slow_down = Math.random()*(6-3.6)+3.6;
            var will_slow_down = Math.random();
            if (will_slow_down < 0.34) {  // if  motorcycle + day + rain + did not slow down
              speed = speed;
              console.log('ran33');
              if (speed >50) { // if  motorcycle + day + rain + did not slow down + speeding
                console.log('ran34');
                speed = 50;
              }
              else { //if  motorcycle + day + rain + did not slow down + not speeding
                console.log('ran35');
                speed = speed;
              }
            }
            else {  // if  motorcycle + day + rain + slow down
              console.log('ran36');
              speed = speed*(1-(slow_down/100));
              if (speed >50) { // if  motorcycle + day + rain + slow down + speeding
                console.log('ran37');
                speed = 50;
              }
              else { //if  motorcycle + day + rain + slow down + not speeding
                console.log('ran38');
                speed = speed;
              }
            }
          }
          else {  //if motorcycle + day + normal (2 cases)
            speed = speed
            if (speed >50) { // if motorcycle + day + normal + speeding
              console.log('ran39');
              speed = 50;
            }
            else { //if motorcycle + day + normal + not speeding
              console.log('ran40');
              speed = speed;
            }
          }
        }
      }
      all_drivers_speeds.push(speed);
      //speed = 0
    }
    console.log("All driver speeds: ", all_drivers_speeds);
    return all_drivers_speeds;
  }

export default generate_speeds;
export var all_drivers_speeds;