import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MakeListing from "./pages/MakeListing";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
export default function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <div className="main-content">
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/make-listing" element={<MakeListing />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
