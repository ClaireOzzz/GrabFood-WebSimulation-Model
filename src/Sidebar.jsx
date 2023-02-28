import React from 'react';

const SideBar = () => {
  
    return (
        <div>
          <div className='sidebarStyle'>
            <div className = 'title'>
              Critical <br/> Checkpoints
            </div>
              {/* Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} */}
            <div className = "optionSection">
    
              <div className="option">
                <label htmlFor="time">Time of Day:</label>
                <select name="time" id="time" >
                  <option value="Morning" >Morning</option>
                  <option value="Afternoon" >Afternoon</option>
                  <option value="Night" >Night</option>
                </select>
              </div>
    
              <div className="option">
                <label htmlFor="weather">Weather:</label>
                <select name="weather" id="weather" >
                  <option value="Rainy">Rainy</option>
                  <option value="Normal" >Normal</option>
                </select>
              </div>
    
              <div className="option">
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
            <div className ="overlay">
              <button className ="resetbutton" id="reset">Reset</button>
            </div>
          </div>
          
        </div>
      );

};
export default SideBar;