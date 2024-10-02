import React, { useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const mapcontainerStyle = {
  width: "100%",
  height: "calc(100vh - 64px)",
};

const Mapcomponent = ({ mapCenter, handleMapClick, selectedLocation }) => {
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={12}
      onClick={handleMapClick}
    >
      {selectedLocation && (
        <Marker
          position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
          icon={{
            path: "M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z",
            fillColor: "#0891b2",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#0891b2",
            scale: 0.075,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default Mapcomponent;
