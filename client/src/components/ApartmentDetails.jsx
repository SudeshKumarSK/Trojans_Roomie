import React, { useState, useEffect } from "react";
import MapModal from "./MapModal"; // Import the MapModal component
import axios from "axios";

const getLatLngFromAddress = async (address) => {
  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY; // Replace with your actual Google Maps API key
  const gcpBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

  const gcpParams = {
    key: googleApiKey,
    address: address,
  };

  try {
    const response = await axios.get(gcpBaseUrl, {
      params: gcpParams,
    });

    const result = response.data.results[0];

    if (result) {
      const location = result.geometry.location;
      console.log(location);
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to generate "Open in Google Maps" link
const gmapHref = (location) => {
  const url = "https://www.google.com/maps/search/?api=1&query=";
  const completeAddress = encodeURIComponent(location);

  return url + completeAddress;
};

const generateGoogleMapsLink = (fullAddress) => {
  // Generate the Google Maps link using the gmapHref function
  const googleMapsLink = gmapHref(fullAddress);

  // You can render this link wherever you want in your component
  return (
    <a
      className="text-blue-700"
      href={googleMapsLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open in Google Maps
    </a>
  );
};

const ApartmentDetails = ({ apartmentData }) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (apartmentData.address) {
      const formattedAddress = apartmentData.address.split(" ").join("+");

      getLatLngFromAddress(formattedAddress).then((response) => {
        if (response) {
          setLatitude(response.lat);
          setLongitude(response.lng);
        }
      });
    }
    console.log(showMapModal, latitude, longitude);
  }, [showMapModal]);

  // Function to toggle the map modal visibility
  const toggleMapModal = () => {
    setShowMapModal(!showMapModal);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "20px",
      }}
    >
      <div style={{ flexBasis: "60%" }}>
        <h3>Apartment Details</h3>
        <p>
          <strong>Address:</strong> {apartmentData.address}
        </p>
        <p>
          <strong>Rent:</strong> ${apartmentData.rent}
        </p>
        <p>
          <strong>Building Type:</strong> {apartmentData.buildingType}
        </p>

        <button
          onClick={toggleMapModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-4 mb-10"
        >
          Show on Map
        </button>

        <div>{generateGoogleMapsLink(apartmentData.address)}</div>
      </div>
      <div style={{ flexBasis: "40%" }}>
        <img
          src={apartmentData.apartmentImage}
          referrerPolicy="no-referrer"
          alt="Apartment"
          style={{ width: "300px", height: "300px", borderRadius: "8px" }}
        />
      </div>

      {showMapModal && latitude !== null && longitude !== null && (
        <MapModal
          show={showMapModal}
          onClose={toggleMapModal}
          googleApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
          latitude={latitude}
          longitude={longitude}
        />
      )}
    </div>
  );
};

export default ApartmentDetails;
