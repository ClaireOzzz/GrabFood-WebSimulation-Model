import randomNormal from 'random-normal';
import {conditions, driver_speed_array, nod} from './Map';
//import {nod} from './Map';
//import { driver_speed_array } from './Map';

var all_drivers_speeds;
var speed = 1

const generate_speeds = function() {
  console.log(nod)
  console.log("function print",conditions)
  console.log("test print", driver_speed_array)
  var driver_speed_array = [];
  speed = 1
  all_drivers_speeds = driver_speed_array
    for (let i = 0; i < nod; i++) {
      if (conditions[0] === 'night' || conditions[0] === 'midnight') {
        console.log('ran1');
        speed = speed/1.68;
      }
      else if (conditions[1] === 'rainy') {
        console.log('ran2');
        const slow_down = Math.random()*(6-3.6)+3.6;
        var will_slow_down = Math.random();
        if (will_slow_down < 0.34) {
          speed = speed;
          console.log('ran3');
        }
        else {
          console.log('ran4');
          speed = speed*(1-(slow_down/100));
        }
      }
      else if (conditions[2] === 'ebicycle') {
        console.log('ran5');
        speed = speed * (randomNormal({mean:19.5, dev:3.42}));
        if (speed >25) {
          console.log('ran6');
          speed = 25;
        }
        else {
          console.log('ran7');
          speed = speed;
        }
      }
      else if (conditions[2] === 'motorcycle') {
        console.log('ran8');
        speed = speed*(randomNormal({mean: 38.28, dev: 10.94}));
        if (speed > 50) {
          console.log('ran9');
          speed = 50;
        }
        else {
          console.log('ran10');
          speed = speed;
        }
      }
    all_drivers_speeds.push(speed);
  }
  console.log("All driver speeds: ", all_drivers_speeds);
  return all_drivers_speeds;
}

export default generate_speeds;
export var all_drivers_speeds;