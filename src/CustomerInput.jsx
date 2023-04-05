import randomNormal from 'random-normal';
import conditions from './Map';

let base_number_of_customers = 5;
var number_of_customers

const generate_number_of_customers = function() {
    console.log(conditions)
    if (conditions[0] === 'morning') {
        number_of_customers = base_number_of_customers;
    }
    if (conditions[0] === 'afternoon') {
        number_of_customers = base_number_of_customers*1.04;
    }
    if (conditions[0] === 'night') {
        number_of_customers = base_number_of_customers*1.38;
    }
    if (conditions[0] === 'midnight') {
        number_of_customers = base_number_of_customers*1.26;
    }
    if (conditions[1] === 'rainy') {
        number_of_customers = number_of_customers*1.34;
    }
    number_of_customers = Math.round(number_of_customers);
    console.log("No. of customers: ", number_of_customers);
    return number_of_customers;
}

export default generate_number_of_customers;
export var number_of_customers; 