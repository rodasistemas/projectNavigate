import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { Map } from 'core-js';


const Directions = ({ destination, origin, onReady }) => (
    <MapViewDirections
        destination={destination}
        origin={origin}
        onReady={onReady}
        apikey="AIzaSyA28ip2SI_LyVQd0Cqq_hzS4tdUCAhYNWA"
        strokeWidth={3}
        strokeColor="#222"
    />
);

export default Directions;
