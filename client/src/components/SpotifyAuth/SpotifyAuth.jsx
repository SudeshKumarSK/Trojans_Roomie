import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  spotifyStart,
  spotifySuccess,
  spotifyFailure,
  spotifyDisconnect,
} from "../../redux/spotify/spotifySlice";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";

import "./SpotifyAuth.css";

const SpotifyAuth = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const isSpotifyConnected = currentUser?.isSpotifyConnected ? true : false;
  const { spotifyLoading, spotifyError, spotifyData } = useSelector(
    (state) => state.spotify
  );

  const [hasDisconnected, setHasDisconnected] = useState(false);

  const handleConnect = () => {
    setHasDisconnected(false);
    window.location.href = import.meta.env.VITE_SPOTIFY_AUTH_URL;
    dispatch(spotifyStart());
  };

  const handleDisconnect = async () => {
    setHasDisconnected(true);
    dispatch(spotifyStart());
    dispatch(updateUserStart());
    try {
      const response = await fetch(
        `/api/spotify/disconnect/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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

      const { spotify_data, user_data } = data;
      dispatch(updateUserSuccess(user_data));
      dispatch(spotifyDisconnect());
    } catch (error) {
      dispatch(
        spotifyFailure({
          message: error.message || "Something went wrong!",
        })
      );
    }
  };

  const setSpotifyAccessToken = async () => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      window.history.pushState({}, null, "/profile");

      try {
        dispatch(updateUserStart());
        dispatch(spotifyStart());
        const response = await fetch(
          `/api/spotify/callback/${currentUser._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${code}`,
            },
          }
        );
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
        const { spotify_data, user_data } = data;
        dispatch(spotifySuccess(spotify_data));
        dispatch(updateUserSuccess(user_data));
      } catch (error) {
        dispatch(
          spotifyFailure({
            message: error.message || "Something went wrong!",
          })
        );
      }
    }
  };
  useEffect(() => {
    setSpotifyAccessToken();
  }, [dispatch, currentUser?._id]);

  return (
    <div>
      {spotifyLoading ? (
        <div className="flex flex-col items-center justify-center">
          {/* Loading animation and message */}
          <div className="loader"></div>
          <p className="text-center mt-2">
            Fetching information from Spotify...
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center font-semibold">
          {/* Connect and Disconnect buttons */}
          <button
            onClick={handleConnect}
            disabled={isSpotifyConnected}
            className={`bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 border border-green-800 rounded mr-5 ${
              isSpotifyConnected ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Connect To Spotify
          </button>

          <button
            onClick={handleDisconnect}
            disabled={!isSpotifyConnected}
            className={`bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-800 rounded ${
              !isSpotifyConnected ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Disconnect Spotify
          </button>
        </div>
      )}

      <p className="text-green-700 mt-5 text-center text-md font-semibold">
        {isSpotifyConnected && "Spotify User Connected Successfully!"}
      </p>
      <p className="text-red-700 mt-5 text-center text-md font-semibold">
        {hasDisconnected && !isSpotifyConnected && "Spotify Disconnected!"}
      </p>
    </div>
  );
};

export default SpotifyAuth;
