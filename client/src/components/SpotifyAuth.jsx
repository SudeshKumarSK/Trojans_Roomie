import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  spotifyStart,
  spotifySuccess,
  spotifyFailure,
} from "../redux/user/userSlice";
const SpotifyAuth = () => {
  const dispatch = useDispatch();
  const { currentUser, spotifyLoading, spotifyError } = useSelector((state) => state.user);
  const isSpotifyConnected = currentUser.spotifyAccessToken ? true : false;

  const handleConnect = () => {
    window.location.href = import.meta.env.VITE_SPOTIFY_AUTH_URL;
    dispatch(spotifyStart());
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  useEffect(() => {
    const fetchSpotifyData = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        window.history.pushState({}, null, "/profile");

        try {
          const response = await fetch(`/api/spotify/callback/${currentUser._id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${code}`,
            },
          });
          const data = await response.json();
          console.log(data);
          if (data.success === false) {
            dispatch(
              spotifyFailure({
                message: data.message || "Something went wrong!",
              })
            );
            return;
          }
          dispatch(spotifySuccess(data));
        } catch (error) {
          dispatch(
            spotifyFailure({
              message: error.message || "Something went wrong!",
            })
          );
        }
      }
    };
    fetchSpotifyData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center font-semibold">
        <button
          onClick={handleConnect}
          disabled={isSpotifyConnected}
          className={`bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-800 rounded mr-5 ${
            isSpotifyConnected ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {spotifyLoading ? "Loading ..." : "Connect To Spotify"}
        </button>

        <button
          onClick={handleDisconnect}
          disabled={!isSpotifyConnected}
          className={`bg-red-800 text-white font-bold py-2 px-4 border border-red-800 rounded ${
            !isSpotifyConnected ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Disconnect Spotify
        </button>
      </div>
      <p className="text-green-700 mt-5 text-center text-md font-semibold">
        {isSpotifyConnected && "Spotify User Connected Successfully!"}
      </p>
      <p className="text-red-700 mt-5 text-center text-md font-semibold">
        {!isSpotifyConnected && "Spotify Disconnected!"}
      </p>
    </div>
  );
};

export default SpotifyAuth;
