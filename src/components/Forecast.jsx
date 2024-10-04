import React from 'react';
import '../styles/weatherDisplay.css';

const Forecast = ({ data }) => {
  // Safety check: If data or data.list is undefined, return null or a loading state
  if (!data || !data.list) {
    return <p>Loading forecast...</p>; // Or any loading indicator
  }

  // Function to filter unique days
  const getUniqueDays = (forecastList) => {
    const seenDates = new Set();
    return forecastList.filter((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
      if (seenDates.has(date)) {
        return false; // If date is already seen, skip it
      }
      seenDates.add(date);
      return true; // Otherwise, add to seenDates and include it
    });
  };

  // Get unique days
  const uniqueDays = getUniqueDays(data.list);

  // Filter out the current day (today)
  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });

  // Filter to exclude today and sort the remaining days
  const sortedDays = uniqueDays
    .filter((item) => {
      const forecastDate = new Date(item.dt * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
      return forecastDate !== today; // Exclude today
    })
    .sort((a, b) => new Date(a.dt * 1000) - new Date(b.dt * 1000));

  return (
    <div className="otherDays">
      {sortedDays.slice(0, 7).map((item, idx) => (
        <div className="day" key={idx}>

          <div className="icon"
          style={{
            width: "50px",
            height: "70px",
            marginBottom: "20px"
          }}
          >
            <img
              src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} 
              alt={item.weather[0].description} 
            />
          </div>

          <div className="des">
          <h3
          style={{
            color:"yellow",
            fontWeight: "bold"
          }}
          >{new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</h3>
          <p>{item.weather[0].description}</p>
          <p>Temp: {Math.round(item.main.temp)}°C</p>
          <p>Wind: {item.wind.speed} m/s</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Forecast;
