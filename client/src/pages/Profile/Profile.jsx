import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
  signOutFailure,
} from "../../redux/user/userSlice";

import {
  spotifyStart,
  spotifySuccess,
  spotifyFailure,
  spotifyDisconnect,
} from "../../redux/spotify/spotifySlice";

import SpotifyAuth from "../../components/SpotifyAuth";
import FavoritesList from "../../components/FavoritesList";
import spotifyIcon from "../../assets/spotify_final.png";
import "./profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasDisconnected, setHasDisconnected] = useState(false);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  useEffect(() => {
    document.body.classList.add("bg-tommy");
    return () => {
      document.body.classList.remove("bg-tommy");
    };
  }, []);
  const handleFileUpload = async (image) => {
    setIsUpdating(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        setIsUpdating(false);
      },
      () => {
        setImageError(false);
        setIsUpdating(false);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(
          deleteUserFailure({
            message: data.message || "Something went wrong!",
          })
        );
        return;
      }
      dispatch(spotifyDisconnect());
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(
        deleteUserFailure({
          message: error.message || "Something went wrong!",
        })
      );
    }
  };

  const handleSubmit = async (e) => {
    setUpdateSuccess(false);
    setImageError(false);
    setImagePercent(0);
    e.preventDefault();
    setIsUpdating(true);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(
          updateUserFailure({
            message: data.message || "Something went wrong!",
          })
        );
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setIsUpdating(false);
    } catch (error) {
      setUpdateSuccess(false);
      dispatch(
        updateUserFailure({ message: error.message || "Something went wrong!" })
      );
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(spotifyDisconnect());
      const response = await fetch("/api/auth/signout");
      const data = await response.json();

      if (data.success === false) {
        dispatch(
          signOutFailure({
            message: error.message || "Something went wrong!",
          })
        );

        return;
      }

      dispatch(signOut());
    } catch (error) {
      console.log(error);
      dispatch(
        signOutFailure({ message: error.message || "Something went wrong!" })
      );
    }
  };

  return (
    <div>
      <div className="account-container mt-10 mb-10 w-3/4 md:max-w-xl mx-auto rounded-lg">
        <div className="flex flex-col items-center justify-center p-2">
          <h1 className="font-bold text-slate-100 text-2xl sm:text-3xl mb-4">
            Account Settings
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center "
          >
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <img
              src={formData.profilePicture || currentUser.profilePicture}
              alt="Profile Picture"
              className="h-28 w-28 self.center cursor-pointer rounded-full object-cover mb-4"
              onClick={() => fileRef.current.click()}
              referrerPolicy={
                formData.profilePicture ? "no-referrer" : "origin"
              }
            />

            <p className="text-sm self-center mb-4">
              {imageError ? (
                <span className="text-red-700">
                  Error uploading image (file size must be less than 2 MB)
                </span>
              ) : imagePercent > 0 && imagePercent < 100 ? (
                <span className="text-slate-100">{`Uploading: ${imagePercent} %`}</span>
              ) : imagePercent === 100 ? (
                <span className="text-green-700">
                  Image uploaded successfully
                </span>
              ) : (
                ""
              )}
            </p>

            <input
              defaultValue={currentUser.username}
              type="text"
              placeholder="Username"
              id="username"
              className="w-3/4 p-3 bg-slate-100 text-slate-900 rounded-lg b-4 text-lg mb-6"
              autoComplete="off"
              onChange={handleChange}
            />

            <input
              defaultValue={currentUser.email}
              type="email"
              placeholder="Email"
              id="email"
              className="w-3/4 p-3 bg-slate-100 text-slate-900 rounded-lg text-lg mb-6"
              autoComplete="off"
              onChange={handleChange}
            />

            <input
              type="password"
              placeholder="Password"
              id="password"
              className="w-3/4 p-3 bg-slate-100 text-slate-900 rounded-lg text-lg mb-6"
              autoComplete="off"
              onChange={handleChange}
            />

            <button
              type="submit"
              className={`bg-slate-700 text-white rounded-md mb-4 w-1/2 h-10 text-lg sm:text-xl uppercase hover:opacity-90 ${
                isUpdating || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isUpdating || loading}
            >
              {loading ? "Loading..." : "Update"}
            </button>
          </form>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span
            className="text-red-700 cursor-pointer"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </span>
          <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
            Sign Out
          </span>
        </div>
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-700 mt-5">
          {updateSuccess && "User Information updated successfully!!"}
        </p>
      </div>

      <div className="account-container mb-20 w-3/4 md:max-w-xl mx-auto rounded-lg">
        <div className="flex flex-col items-center justify-center p-2">
          <div className="flex justify-start gap-4 mb-4">
            <h1 className="font-bold text-slate-100 text-2xl sm:text-3xl mb-4">
              Spotify Settings
            </h1>
            <img
              src={spotifyIcon}
              className="h-12 w-15 rounded-md object-cover "
              alt="Spotify Icon"
            />
          </div>
          <p className="text-md font-semibold text-center">
            Authorize to connect your Spotify Account with Trojan Roomie to
            experience Music-Based Roommate Matching{" "}
          </p>
          <p className="mb-4 text-sm text-red-700">*Terms & Conditions Apply</p>

          <SpotifyAuth
            hasDisconnected={hasDisconnected}
            setHasDisconnected={setHasDisconnected}
          />
        </div>
      </div>
      <div>
        {/* Other Profile content */}
        <FavoritesList /> {/* Include the FavoritesList component */}
      </div>
    </div>
  );
};

export default Profile;
