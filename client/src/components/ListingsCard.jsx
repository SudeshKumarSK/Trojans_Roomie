import React, { useState } from "react";
import PropTypes from "prop-types";
import { AppBar, Tabs, Tab, Box, Typography } from "@mui/material";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import UserInfo from "./UserInfo";
import SpotifyDetails from "./SpotifyDetails";
import ApartmentDetails from "./ApartmentDetails";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      style={{ marginTop: "20px", padding: "10px" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const ListingsCard = ({ listing }) => {
  console.log("ListingsCard listing prop:", listing.listingInfo);

  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false); // Track favorite status

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFavorite = () => {
    // Toggle favorite status
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        marginBottom: "20px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <img
          src={listing.user.profilePicture}
          referrerPolicy="no-referrer"
          alt={`${listing.user.username}'s profile`}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
        <h3>{listing.user.username}</h3>
        <div
          style={{
            fontSize: "24px",
            cursor: "pointer",
            color: isFavorite ? "red" : "gray",
          }}
          onClick={handleFavorite}
        >
          {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
        </div>
      </div>

      <AppBar position="relative">
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="User Info" />
          <Tab label="Spotify" />
          <Tab label="Apartment" />
        </Tabs>
      </AppBar>

      <TabPanel value={activeTab} index={0}>
        <UserInfo listingInfo={listing.listingInfo} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <SpotifyDetails spotifyData={listing.spotifyData} />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <ApartmentDetails apartmentData={listing.apartmentData} />
      </TabPanel>
    </div>
  );
};

ListingsCard.propTypes = {
  listing: PropTypes.object.isRequired,
};

export default ListingsCard;
