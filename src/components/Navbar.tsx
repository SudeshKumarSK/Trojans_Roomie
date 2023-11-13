// src/components/Navbar.tsx

import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/make-a-post">Make a Post</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
};

export default Navbar;
