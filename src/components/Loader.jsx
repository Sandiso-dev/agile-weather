import React from 'react';
import animationData from '../assets/WEATHER_LOADER.json';
import Lottie from 'lottie-react';
import '../styles/loader.css';

const Loader = () => {
  return <div className="loader" > 
   <div className="loaderComp" >
   <Lottie animationData={animationData} background="##FFFFFF"/>
   </div>
  </div>;
};

export default Loader;
