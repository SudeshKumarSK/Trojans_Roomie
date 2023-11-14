// src/pages/HomePage.tsx

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Post } from "../types"; // Assuming you have defined this type
import Navbar from "../components/Navbar";

type ExtendedPost = Post & {
  username?: string;
  email?: string;
};

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsData = querySnapshot.docs.map((doc) => {
          const data = doc.data() as ExtendedPost;
          return {
            ...data,
          };
        });
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="page-content">
      <Navbar></Navbar>
      <h1>Home Page</h1>
      {posts.map((post) => (
        <div key={post.uid} className="post-card">
          <div className="post-userinfo">
            <strong>{post.username}</strong> ({post.email})
          </div>
          {Object.entries(post).map(([key, value]) => {
            if (
              key !== "uid" &&
              key !== "geolocation" &&
              key !== "username" &&
              key !== "email" &&
              value === true
            ) {
              return (
                <span key={key} className="post-tag">
                  {key.replace(/_/g, " ")}
                </span>
              );
            }
            return null;
          })}
          {post.geolocation && (
            <div className="geolocation">Geolocation: {post.geolocation}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HomePage;
