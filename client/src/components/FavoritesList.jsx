import React from "react";
import { useSelector } from "react-redux";
import ListingsCard from "./ListingsCard"; // Import your listing card component

const FavoritesList = () => {
  // Access favorite listings from the Redux store
  const favoriteListings = useSelector(
    (state) => state.favorite.favoriteListings
  );
  console.log(favoriteListings);

  if (favoriteListings.length === 0) {
    return <div>No favorite listings found.</div>;
  }

  return (
    <div>
      <h2>My Favorites</h2>
      <div>
        {favoriteListings.map((listing, index) => (
          <ListingsCard key={index} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
