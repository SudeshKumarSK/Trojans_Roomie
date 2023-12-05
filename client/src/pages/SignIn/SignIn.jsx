import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import "./SignIn.css";

const SignIn = () => {
  useEffect(() => {
    document.body.classList.add("bg-img");
    return () => {
      document.body.classList.remove("bg-img");
    };
  }, []);
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(
          signInFailure({ message: data.message || "Something went wrong!" })
        );
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.error("Error during the API call", error);
      dispatch(
        signInFailure({
          message: `Error during the API call: ${error.message}`,
        })
      );
    }
  };

  return (
    <div>
      <div className="signin-container my-20 w-3/4 md:max-w-xl mx-auto rounded-lg">
        <div className="flex items-center justify-center ">
          <h1 className="font-bold text-slate-200 p-2 text-2xl sm:text-3xl">
            Log In 
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center p-2">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center"
          >
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="w-3/4 p-3 bg-slate-100 text-slate-900 rounded-lg mb-4 text-lg"
              onChange={handleChange}
              autoComplete="off"
              required
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="w-3/4 p-3 bg-slate-100 text-slate-900 rounded-lg mb-4 text-lg"
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="bg-slate-700 text-white rounded-md mb-4 w-1/2 h-10 text-lg sm:text-xl uppercase hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Loading ..." : "Sign In"}
            </button>
            <OAuth authType="signin" />
          </form>

          <div className="flex flex-row gap-2 text-lg ">
            <p>Dont have an account?</p>
            <Link to="/sign-up">
              <span className="text-blue-800 underline">Sign Up</span>
            </Link>
          </div>
          <p className="text-red-700 mt-5">{error ? error : ""}</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
