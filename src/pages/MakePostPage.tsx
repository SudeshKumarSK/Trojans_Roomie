import React from "react";
import { useNavigate } from "react-router-dom";

const MakePostPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <button onClick={() => navigate("/")} className="back-home-button">
        Back to Home
      </button>
      <h1>Make a Post Page</h1>
    </div>
  );
};

export default MakePostPage;
