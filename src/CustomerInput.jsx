import {conditions, customerInput} from './Map';

export var number_of_customers

const generate_number_of_customers = function() {
    console.log("Customer input: ", customerInput)
    console.log(conditions)
    let base_number_of_customers = customerInput;
    if (conditions[0] === 'morning') { //morning
        number_of_customers = base_number_of_customers;
        if (conditions[1] === 'rainy') { //morning + raining
            number_of_customers = number_of_customers*1.34;
        }
    }
    if (conditions[0] === 'afternoon') { //afternoon
        number_of_customers = base_number_of_customers*1.04;
        if (conditions[1] === 'rainy') { //afternoon + raining
            number_of_customers = number_of_customers*1.34;
        }
    }
    if (conditions[0] === 'night') { //night
        number_of_customers = base_number_of_customers*1.38;
        if (conditions[1] === 'rainy') { //night + raining
            number_of_customers = number_of_customers*1.34;
        }
    }
    if (conditions[0] === 'midnight') { //midnight
        number_of_customers = base_number_of_customers*1.26;
        if (conditions[1] === 'rainy') { //midnight + raining
            number_of_customers = number_of_customers*1.34;
        }
    }
    number_of_customers = Math.round(number_of_customers);
    console.log("No. of customers: ", number_of_customers);
    return number_of_customers;
}

export default generate_number_of_customers;