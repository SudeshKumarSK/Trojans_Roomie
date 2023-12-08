import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import {
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = ({ authType, isAuthenticating, setIsAuthenticating }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      setIsAuthenticating(true);
      const provider = new GoogleAuthProvider();
      // provider.setCustomParameters({
      //   hd: "usc.edu",
      // });
      const auth = getAuth(app);

      if (authType === "signup") {
        dispatch(signUpStart());
      } else {
        dispatch(signInStart());
      }
      const result = await signInWithPopup(auth, provider);

      // Retrieve ID token
      const idToken = await result.user.getIdToken();

      // User details
      const userDetails = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      };

      console.log(result);
      const oauthResponse = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(userDetails),
      });

      const data = await oauthResponse.json();

      if (data.success === false) {
        setIsAuthenticating(false);
        if (authType === "signup") {
          dispatch(
            signUpFailure({ message: data.message || "Something went wrong!" })
          );
        } else {
          dispatch(
            signInFailure({ message: data.message || "Something went wrong!" })
          );
        }
        return;
      }
      setIsAuthenticating(false);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      setIsAuthenticating(false);
      console.error("Error during Google OAuth", error);
      let errorMessage = "";

      switch (error.code) {
        case "auth/network-request-failed":
          errorMessage = "Network error. Please try again.";
          break;

        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in popup closed by user.";
          break;

        default:
          errorMessage = `Error during Google OAuth: ${error.message}`;
      }

      if (authType === "signup") {
        dispatch(
          signUpFailure({
            message: `Error during Google OAuth: ${error.message}`,
          })
        );
      } else {
        dispatch(
          signInFailure({
            message: `Error during Google OAuth: ${error.message}`,
          })
        );
      }
    }
  };
  return (
    <button
      type="button"
      className={`bg-red-700 text-white rounded-md mb-4 w-1/2 h-10 text-lg sm:text-xl hover:opacity-80 ${
        isAuthenticating ? "disabled:opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleGoogleClick}
      disabled={isAuthenticating}
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
