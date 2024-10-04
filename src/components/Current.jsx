import React from 'react'
import '../styles/weatherDisplay.css';

const Current = ({data}) => {
    return (

      <div
      style={{
        display: "flex"
      }}
      >

            <div className="icon">
            <img 
            style={{
              height: "100px",
              width: "100px",
              marginRight: "20px"
            }}
            src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} 
            alt={data.weather[0].description} 
          />
            </div>

            <div className="des">
            <h3>Today</h3>               
            <p>Temp: {Math.round(data.main.temp)}°C</p>
            <p>Weather: {data.weather[0].description}</p>
            </div>
     </div>
    )
}

export default Current
