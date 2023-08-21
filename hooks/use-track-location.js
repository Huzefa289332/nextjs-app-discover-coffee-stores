import { useState } from 'react';

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  const [latLng, setLatLng] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const success = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLatLng(`${latitude},${longitude}`);
    setLocationErrorMsg('');
    setIsFindingLocation(false);
  };

  const error = err => {
    setLocationErrorMsg('Unable to retrieve your location');
    setLatLng('');
    setIsFindingLocation(false);
    console.log(err);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported by your browser');
      setLatLng('');
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    latLng,
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  };
};

export default useTrackLocation;
