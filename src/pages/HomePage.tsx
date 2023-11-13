// src/pages/HomePage.tsx

import React from "react";
import Navbar from "../components/Navbar"; // Adjust the path as necessary

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <Navbar />
      <br></br>
      <br></br>

      <div>Home Page Content</div>
    </div>
  );
};

export default HomePage;
