import React, { useState } from 'react';

const SideBar  = (props) => {
  const [inputValue, setInputValue] = useState(1);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleReset = () => {
    props.handleReset();
  };

  return (
    <div>
      <div className='sidebarStyle'>
        <div className = 'title'>
          Critical <br/> Checkpoints
        </div>
          {/* Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} */}

        <div className="optionSection">
          <div className="option">
            <label htmlFor="number"> No. Of Drivers:</label>
            <input type="number" name="number" id="number" min="1" max="50"  ref={props.inputRef} value={inputValue} onChange={handleInputChange} />
          </div>
        </div>


        <div className = "variableSection">

          <div className="variable">
            <label htmlFor="time">Time of Day:</label>
            <select name="time" id="time" >
              <option value="Morning" >Morning</option>
              <option value="Afternoon" >Afternoon</option>
              <option value="Night" >Night</option>
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
              <option value="Motocycle" >Motocycle</option>
            </select>
          </div>
          
        </div>
        {/* output */}
        <div className = 'output'>
          <div className = 'header'>
            Average Waiting Time: 
          </div>
          <div className = 'header'>
            Occupied to Unoccupied Drivers:
          </div>
          <div className = 'header'>
            Average Customers Served/h:
          </div>
        </div>
        <div className='header'> Speed: </div>
        <div className ="overlay">
          <div className='speedContainer'>
            
            <div className='speedButtons'>
              <button className='speedbutton active' id='1x-speed'>1x </button>
              <button className='speedbutton' id='2x-speed'>2x </button>
              <button className='speedbutton' id='4x-speed'>4x </button>
              <button className='speedbutton' id='8x-speed'>8x </button>
              <button className='speedbutton' id='16x-speed'>16x </button>
            </div>
          </div>

       
          <button className ="resetbutton" id="reset" onClick={handleReset} >Reset</button>
        </div>
      </div>
      
    </div>
  );

};
export default SideBar;