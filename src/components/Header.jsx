import React from "react";
import Img from "./Img";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { loggedIn } = useAuthStatus();

  function pathMatchRoute(route) {
    return route === location.pathname;
  }

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div onClick={() => navigate("/")}>
          <Img
            src="https://1000logos.net/wp-content/uploads/2023/01/Airbnb-logo.png"
            alt="realtor logo"
            className="h-8 cursor-pointer"
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 ${
                pathMatchRoute("/") &&
                "text-black border-b-[3px] border-b-red-500"
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 ${
                pathMatchRoute("/offers") &&
                "text-black  border-b-[3px] border-b-red-500"
              }`}
              onClick={() => navigate("/offers")}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 whitespace-nowrap ${
                (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
                "text-black border-b-[3px]  border-b-red-500"
              }`}
              onClick={() => navigate(`${loggedIn ? "/profile" : "/sign-in"}`)}
            >
              {loggedIn ? "Profile" : "Sign In"}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
