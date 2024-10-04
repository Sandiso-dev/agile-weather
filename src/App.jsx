import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import Loader from './components/Loader';
import WeatherDisplay from './components/WeatherDisplay';
import SearchBar from './components/SearchBar';
import { getWeatherByLocation, getWeatherByQuery, getWeatherForecastByQuery } from './services/WeatherServices';
import '../src/styles/weatherDisplay.css'
import Current from './components/Current';
import { GEO_API_URL } from './api';

const App = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (!showModal) {
            if (navigator.geolocation) {
                setLoading(true);
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                setErrorMessage('Geolocation is not supported by this browser.');
                setLoading(false);
            }
        }
    }, [showModal]);

    const success = async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherData(latitude, longitude);
    };

    const error = () => {
        setErrorMessage('Unable to retrieve your location.');
        setLoading(false);
    };

    const fetchWeatherData = async (latitude, longitude) => {
        try {
            const data = await getWeatherByLocation(latitude, longitude);
            setWeatherData(data);

            const forecastData = await getWeatherForecastByQuery(data.name); // Fetch forecast using the city name
            setForecastData(forecastData); // Set forecast data state

        } catch (error) {
            setErrorMessage('Error fetching weather data. Please try again later.'); // More user-friendly message
        } finally {
            setLoading(false);
        }
    };

    const handleSearchOnChange = async (searchData) => {
        const query = searchData.value;

        try {
            const data = await getWeatherByQuery(query);
            setWeatherData(data);

            const forecastData = await getWeatherForecastByQuery(query); // Fetch forecast data
            setForecastData(forecastData); // Set forecast data state

        } catch (error) {
            setErrorMessage('Error fetching weather data. Please check your input and try again.'); // More specific error message
        }
    };

    // Debounce function to limit API calls
    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`${GEO_API_URL}/cities?minPopuplation=1000000&namePrefix=${query}`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '8dc4ba0d4dmshc6b58da71f7cf6cp1bd6d2jsnf8bf82a63d9d', 
                    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`); // Check for response status
            }

            const data = await response.json();
            // Ensure data is in the expected format before mapping
            if (Array.isArray(data.data)) {
                setSuggestions(data.data.map(city => `${city.name}`)); // Adjust field names as necessary
            } else {
                console.error("Unexpected data format:", data);
                setSuggestions([]); // Set suggestions to empty if data is not an array
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    // Debounced version of fetchSuggestions
    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300); // Adjust delay as needed

    return (
        <div className="weather-app">
            {showModal && (
                <Modal
                    onAllow={() => setShowModal(false)}
                    onDeny={() => setErrorMessage('Location permission denied')}
                />
            )}

            {!showModal && (
                <>
                    <div className="weatherSearch">
                        <SearchBar 
                            onSearchChange={handleSearchOnChange} 
                            fetchSuggestions={debouncedFetchSuggestions} // Use debounced function
                            suggestions={suggestions}
                            setSuggestions={setSuggestions}
                        />
                    </div>

                    {loading && <Loader />}
                    {errorMessage && <p>{errorMessage}</p>} {/* Display error message if exists */}

                    <div className="weather_info">
                        <div className="upper_part">
                            {weatherData && <WeatherDisplay currentData={weatherData} forecastData={forecastData} />} {/* Pass forecastData */}
                        </div>
                        
                        <div className="today">
                            {weatherData && <Current data={weatherData} />}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
