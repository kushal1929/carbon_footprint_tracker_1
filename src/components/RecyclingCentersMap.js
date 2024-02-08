import React, { useEffect, useState } from 'react';
import {maps_api} from '../APIkeys';

const RecyclingCentersMap = () => {
  const [infowindow, setInfowindow] = useState(null);
  const [map, setMap] = useState(null);
  const [service, setService] = useState(null);

  useEffect(() => {
    let mapInstance;
    let serviceInstance;
    let infowindowInstance;

    const initialize = (userLocation) => {
      mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15,
      });

      infowindowInstance = new window.google.maps.InfoWindow();
      setInfowindow(infowindowInstance);

      setMap(mapInstance);

      const request = {
        location: userLocation,
        radius: 15000,
        query: [
          'Recycling near me',
          'recycling',
          'recycle near me',
          'recycle centres near me',
          'recycle centres',
          'RECYCLING CENTRES NEAR ME',
          'recycling centres',
        ],
      };

      serviceInstance = new window.google.maps.places.PlacesService(mapInstance);
      setService(serviceInstance);

      serviceInstance.textSearch(request, callback);
    };

    const callback = (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    };

    const createMarker = (place) => {
      if (!place.geometry || !place.geometry.location) return;

      const marker = new window.google.maps.Marker({
        map: mapInstance,
        position: place.geometry.location,
        title: place.name,
      });

      window.google.maps.event.addListener(marker, 'click', () => {
        fetchPlaceDetails(place.place_id, marker);
      });
    };

    const fetchPlaceDetails = (placeId, marker) => {
      const detailsRequest = {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'url'],
      };

      serviceInstance.getDetails(detailsRequest, (details, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const content = `
            <div>
              <h3>${details.name}</h3>
              <p>${details.formatted_address}</p>
              <a href="${details.url}" target="_blank">Visit on Google Maps</a>
            </div>
          `;
          infowindowInstance.setContent(content);
          infowindowInstance.open(mapInstance, marker);
        }
      });
    };

    const handlePositionError = (error) => {
      
      // Fallback location (default to Sydney, Australia)
      const fallbackLocation = new window.google.maps.LatLng(-33.867, 151.195);
      initialize(fallbackLocation);
    };

    const handleGetPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = new window.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          initialize(userLocation);
        },
        handlePositionError,
        { enableHighAccuracy: true }
      );
    };

    // Check if the Google Maps API is already loaded
    if (window.google && window.google.maps) {
      handleGetPosition();
    } else {
      // Load the Google Maps API script
      const script = document.createElement('script');
      script.src = maps_api;
      script.async = true;

      script.onload = () => {
        // Ensure the script is loaded before calling initialize
        handleGetPosition();
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
        delete window.initialize;
      };
    }
  }, []);
 
  return <div id="map" className='h-full w-full' ></div>;
};
//style={{ height: '500px', width: '100%' }}
export default RecyclingCentersMap;