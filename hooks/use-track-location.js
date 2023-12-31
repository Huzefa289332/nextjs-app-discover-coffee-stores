import { ACTION_TYPES, StoreContext } from '@/store/store-context';
import { useContext, useState } from 'react';

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const { dispatch } = useContext(StoreContext);

  const success = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch({
      type: ACTION_TYPES.SET_LAT_LNG,
      payload: { latLng: `${latitude},${longitude}` },
    });
    setLocationErrorMsg('');
    setIsFindingLocation(false);
  };

  const error = err => {
    setLocationErrorMsg('Unable to retrieve your location');
    setIsFindingLocation(false);
    console.log(err);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported by your browser');

      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  };
};

export default useTrackLocation;
