import randomNormal from 'random-normal';
import {conditions, nod} from './Map';

var all_drivers_speeds = [];
var speed

const generate_speeds = function() {
    for (let i = 0; i < nod; i++) {
      if (conditions[2] === 'ebicycle') {
        speed = randomNormal({mean:19.5, dev:3.42});
      }
      if (conditions[2] === 'motorcycle') {
        speed = randomNormal({mean: 38.28, dev: 10.94});
      }
      if (conditions[0] === 'night' || conditions[0] === 'midnight') {
        speed = speed/1.68;
      }
      if (conditions[1] === 'rainy') {
        const slow_down = Math.random()*(6-3.6)+3.6;
        var will_slow_down = Math.random();
        if (will_slow_down < 0.34) {
          speed = speed;
        }
        else {
          speed = speed*(1-(slow_down/100));
      }
      if (conditions[2] === 'ebicycle') {
        if (speed >25) {
          speed = 25;
        }
        else {
          speed = speed;
        }
      }
      if (conditions[2] === 'motorcycle') {
        if (speed > 50) {
          speed = 50;
        }
        else {
          speed = speed;
        }
      }
      all_drivers_speeds.push(speed);
    }
    console.log("All driver speeds: ", all_drivers_speeds);
  return all_drivers_speeds;
  }
}

export default generate_speeds;
export var all_drivers_speeds;