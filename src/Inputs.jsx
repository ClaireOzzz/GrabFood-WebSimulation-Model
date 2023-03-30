//$ npm install --save random-normal 

let Speed = 1;
let Customers = 5;

document.getElementById('weather').addEventListener('change', (event) => {
    if (event.target.value === 'Normal') {
      console.log("normal");
      Speed = Speed
      Customers = Customers 
    }
  });

document.getElementById('weather').addEventListener('change', (event) => {
    if (event.target.value === 'Rainy') {
      console.log("rainy");
      const random = Number((0.94 + Math.random() * 0.024).toFixed(3));
      Speed = Speed *  random
      Customers = Customers * (143/98)
    }
  });

document.getElementById('time of day').addEventListener('change', (event) => {
    if (event.target.value === 'Morning') {
      console.log("morning");
      Speed = Speed
      Customers = Customers 
    }
  });

document.getElementById('time of day').addEventListener('change', (event) => {
    if (event.target.value === 'Afternoon') {
      console.log("afternoon");
      Speed = Speed 
      Customers = Customers * (119/76)
    } 
  });

document.getElementById('time of day').addEventListener('change', (event) => {
    if (event.target.value === 'Night') {
      console.log("night");
      Speed = Speed / 1.68
      Customers = Customers * (156/76)
    } 
  });

document.getElementById('time of day').addEventListener('change', (event) => {
    if (event.target.value === 'Midnight') {
      console.log("midnight");
      Speed = Speed / 1.68
      Customers = Customers * (137/76)
    } 
  });

document.getElementById('mode of transport').addEventListener('change', (event) => {
    if (event.target.value === 'Motorcycle') {
      console.log("motorcycle");      
      Speed = Speed * randomNormal({mean: 38.28, dev: 10.94})
      const maxSpeed = 50;
      if (Speed > maxSpeed) {
        Speed = maxSpeed;
      }
    } 
  });

document.getElementById('mode of transport').addEventListener('change', (event) => {
    if (event.target.value === 'Ecycle') {
      console.log("ecycle");      
      Speed = Speed * randomNormal({mean: 19.5, dev: 3.42})
      const maxSpeed = 25;
      if (Speed > maxSpeed) {
        Speed = maxSpeed;
      }
    } 
  });



console.log(myNumber)
Customers = Math.round(Customers)  
export default (Speed, Customers)

    

  
