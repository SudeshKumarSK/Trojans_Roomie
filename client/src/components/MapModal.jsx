import React, { useEffect } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const MapModal = ({ show, latitude, longitude, googleApiKey, onClose }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleApiKey,
    id: "script-loader",
    version: "weekly",
  });

  // Add an useEffect to log props whenever they change
  useEffect(() => {
    console.log("show:", show);
    console.log("latitude:", latitude);
    console.log("longitude:", longitude);
    console.log("googleApiKey:", googleApiKey);
  }, [show, latitude, longitude, googleApiKey]);

  return (
    <div
      className={`${
        show ? "fixed" : "hidden"
      } inset-0 flex items-center justify-center z-50`}
    >
      <div className="bg-white w-full max-w-md mx-auto p-4 rounded border border-gray-300 shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-xl text-red-700 font-bold text-center">Google Map View</h2>
          <button
          onClick={onClose}
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 border border-gray-950 rounded mt-4 mb-10"
        >
          Close Map
        </button>
        </div>
        <div className="mt-4">
          {isLoaded ? (
            <GoogleMap
              id="marker-example"
              mapContainerStyle={{
                height: "300px", // Adjust the height as needed
                width: "100%",
              }}
              zoom={15}
              center={{
                lat: latitude,
                lng: longitude,
              }}
            >
              <MarkerF position={{ lat: latitude, lng: longitude }} />
            </GoogleMap>
          ) : (
            <div className="container">
              <p>Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapModal;
