// src/pages/ProfilePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Adjust the path as necessary
import { signOut } from "firebase/auth";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {/* Other profile information here */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
