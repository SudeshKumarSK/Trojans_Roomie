import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const UserInfo = ({ listingInfo }) => {
  const renderListItem = (label, value) => (
    <ListItem sx={{ borderBottom: "1px solid #ccc" }}>
      <ListItemText primary={label} secondary={value ?? "N/A"} />
    </ListItem>
  );

  const preferredPets = Array.isArray(listingInfo.preferredPets)
    ? listingInfo.preferredPets.join(", ")
    : "None";

  return (
    <Card
      raised
      sx={{
        borderRadius: 8,
        margin: 2,
        boxShadow: 4,
        background: "linear-gradient(135deg, #e6e6e6 0%, #f5f5f5 100%)",
      }}
    >
      <CardContent>
        <Typography
          variant="h4"
          sx={{
            color: "#333",
            paddingBottom: 2,
            borderBottom: "2px solid #ccc",
          }}
        >
          Listing Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List dense>
              {renderListItem("Headline", listingInfo.headline)}
              {renderListItem("Description", listingInfo.description)}
              {renderListItem("Cleanliness", listingInfo.cleanliness)}
              {renderListItem("Party Habits", listingInfo.partyHabits)}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List dense>
              {renderListItem("Overnight Guests", listingInfo.overnightGuests)}
              {renderListItem("Get Up Time", listingInfo.getUpTime)}
              {renderListItem("Go To Bed", listingInfo.goToBed)}
              {renderListItem("Smoker", listingInfo.smoker ? "Yes" : "No")}
              {renderListItem("Food Preference", listingInfo.foodPreference)}
              {renderListItem("Smoke Preference", listingInfo.smokePreference)}
              {renderListItem("Preferred Pets", preferredPets)}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
