// src/pages/ProfilePage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase"; // Adjust the path as necessary
import { signOut } from "firebase/auth";

const ProfilePage: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="page-content">
      <button onClick={() => navigate("/")} className="back-home-button">
        Back to Home
      </button>
      <h1>Profile Page</h1>
      {user && (
        <div>
          <img
            src={user.photoURL || ""}
            alt={user.displayName || "User profile"}
            className="profile-image" // Ensure this class is defined in your CSS
          />
          <h2>{user.displayName}</h2>
          <p>{user.email}</p>
          {/* Additional profile information here */}
          <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
