import React, { useState } from 'react';

const SideBar  = (props) => {

    const [inputValue, setInputValue] = useState(1);
    const [inputValue2, setInputValue2] = useState(5);


    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleInputChange2 = (event) => {
        setInputValue2(event.target.value);
    };
    

    const handleReset = () => {
        props.handleReset();
    };
  
    return (
        <div className="wrapper">
      
        <div className="sidebar">
             <div className="profile">
                
                <h6>Dashboard</h6>
                <h1>GrabFood Agent Based Simulation</h1>
            </div>

            <ul>
                <li>
                    <span className="item">Agents</span>
                </li>

                <div className="optionSection">
                    <div className="option">
                    <label htmlFor="number"> Number of Drivers:</label>
                    <input type="number" name="number" id="number" min="1" max="50"  ref={props.inputRef} value={inputValue} onChange={handleInputChange} />
                    </div>

                    <div className="option" >
                    <label htmlFor="number2"> Number of Customers:</label>
                    <select className="optionDrop" name="number2" id="number2" >
                        <option value="range1" > 5 - 10</option>
                        <option value="range2" > 10 - 20</option>
                    </select>
                    </div>

                    <div className="option" >
                    <label htmlFor="number3"> Food Preparation Time:</label>
                    <select className="optionDrop" name="number3" id="number3" >
                        <option value="range1" > 0 - 5 mins </option>
                        <option value="range2" > 5 - 15 mins </option>
                        <option value="range3" > 15 - 30 mins </option>
                    </select>
                    </div>

                </div>

                <li>
                    <span className="item">Variables</span>
                </li>

                <div className = "variableSection">
                    <div className="variable">
                    <label htmlFor="time">Time of Day:</label>
                    <select name="time" id="time" >
                        <option value="Morning" >Morning</option>
                        <option value="Afternoon" >Afternoon</option>
                        <option value="Night" >Night</option>
                        <option value="Midnight" >Midnight</option>
                    </select>
                    </div>

                    <div className="variable">
                    <label htmlFor="weather">Weather:</label>
                    <select name="weather" id="weather" >
                        <option value="Normal" >Normal</option>
                        <option value="Rainy">Heavy Rain</option>
                    </select>
                    </div>

                    <div className="variable">
                    <label htmlFor="transport">Transport:</label>
                    <select name="transport" id="transport">
                        <option value="Ebicycle">E-bicycle</option>
                        <option value="Motorcycle" >Motorcycle</option>
                    </select>
                    </div>
                    
                </div>
                
                <li>
                    <span className="item">Ouput</span>
                </li>
               
                    <div className = 'output'>
                    Average Waiting Time:
                    </div>
                    <div className = 'answer'>
                    {props.totalTime} minutes
                    </div>
                    <div className = 'output'>
                    Occupied to Unoccupied Drivers:
                    </div>
                    <div className = 'answer'>
                    {props.totalTime} minutes
                    </div>
                    <div className = 'output'>
                    Average Customers Served/h:
                    </div>
                    <div className = 'answer'>
                    {props.totalTime} minutes
                    </div>
                
                <li>
                    <span className="item">Settings</span>
                </li>
                
                <div className='speedContainer'>
                    <div className='speedText'> Speed: </div>
                    <div className='speedButtons'>
                        <button className='speedbutton active' id='1x-speed'>Real time </button>
                        <button className='speedbutton' id='8x-speed'>8x </button>
                        <button className='speedbutton' id='16x-speed'>16x </button>
                        <button className='speedbutton' id='32x-speed'>32x </button>
                        <button className='speedbutton' id='64x-speed'>64x </button>
                    </div>
                </div>
            
                <button className ="resetbutton" id="reset" onClick={handleReset} >Simulate</button>
                
            </ul>
        </div>

        

        </div>
    );
  
  };

  export default SideBar;