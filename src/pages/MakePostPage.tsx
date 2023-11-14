import React, { useState, ChangeEvent, FormEvent } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase"; // Adjust the path as necessary
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Define the type for post details
type PostDetails = {
  Pet_friendly: boolean;
  No_Pets: boolean;
  allergy: boolean;
  Smoker: boolean;
  Shared_Chores: boolean;
  Vegan: boolean;
  Studious: boolean;
  Relaxed: boolean;
  Introvert: boolean;
  Extrovert: boolean;
  Night_Owl: boolean;
  Early_bird: boolean;
  geolocation: string;
};

const MakePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [postDetails, setPostDetails] = useState<PostDetails>({
    Pet_friendly: false,
    No_Pets: false,
    allergy: false,
    Smoker: false,
    Shared_Chores: false,
    Vegan: false,
    Studious: false,
    Relaxed: false,
    Introvert: false,
    Extrovert: false,
    Night_Owl: false,
    Early_bird: false,
    geolocation: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPostDetails((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      try {
        await addDoc(collection(db, "posts"), {
          uid: user.uid,
          username: user.displayName,
          email: user.email,
          ...postDetails,
        });
        alert("Post created successfully");
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <div className="page-content">
      <button onClick={() => navigate("/")} className="back-home-button">
        Back to Home
      </button>
      <h1>Make a Post</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(postDetails).map((key) => {
          if (key !== "geolocation") {
            return (
              <label key={key}>
                {key}:
                <input
                  type="checkbox"
                  name={key}
                  onChange={handleInputChange}
                  checked={postDetails[key as keyof PostDetails] === true}
                />
              </label>
            );
          } else {
            return (
              <label key={key}>
                Geolocation:
                <input
                  type="text"
                  name="geolocation"
                  onChange={handleInputChange}
                  value={postDetails.geolocation}
                />
              </label>
            );
          }
        })}
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default MakePostPage;
