import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    navigate("/");
  };
  return (
    <div className="page-content">
      <button onClick={() => navigate("/")} className="back-home-button">
        Back to Home
      </button>
      <h1>Login In</h1>
      <p>Sign in with Google to continue</p>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  );
};

export default LoginPage;
