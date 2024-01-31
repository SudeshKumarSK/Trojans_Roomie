import { Link } from "react-router-dom";
import roomie from "../assets/roomie_dark.png";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const headerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
  };
  return (
    <div style={headerStyle} className="bg-zinc-800">
      <div className="flex flex-col sm:flex-row justify-between items-center p-2 sm:p-4 ">
        <div className="flex justify-start">
          <Link to="/">
            <h1 className="font-bold text-orange-700  p-2 text-xl sm:text-2xl">
              Trojan Roomie
            </h1>
          </Link>

          <Link to="/">
            <img
              src={roomie}
              className="h-10 w-12 sm:h-11 sm:w-12"
              alt="Roomie Logo"
              style={{ filter: "invert(100%)" }}
            />
          </Link>
        </div>

        <ul className="flex sm:flex-row gap-4 items-center mt-3 md:mt-0">
          <Link to="/about">
            <li className="font-bold text-orange-700  text-base sm:text-lg">
              About
            </li>
          </Link>

          <Link to="/make-listing">
            <li className="font-bold text-orange-700  text-base sm:text-lg">
              Make Listing
            </li>
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile_picture"
                className="h-7 w-7 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <li className="font-bold text-orange-700  text-base sm:text-lg">
                Log In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Header;
