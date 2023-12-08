import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import ListingsCard from "../../components/ListingsCard";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/listings/show/${currentUser._id}`);
      const data = await response.json();

      if (data.success === false) {
        console.log(data.message);
        setError(data.message);
        return;
      }
      console.log(data);
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {listings.map((listing, index) => (
        <ListingsCard key={index} listing={listing} />
      ))}
    </div>
  );
};

export default Home;
