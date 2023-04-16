import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import "./style.css";
import Spinner from "./Spinner";
const PrivateRoute = () => {
  const { loggedIn, loading } = useAuthStatus();
  if (loading) {
    return (
      // <div className="detailsBannerSkeleton">
      //   <div className="left skeleton"></div>
      //   <div className="right">
      //     <div className="row skeleton"></div>
      //     <div className="row skeleton"></div>
      //     <div className="row skeleton"></div>
      //     <div className="row skeleton"></div>
      //     <div className="row skeleton"></div>
      //     <div className="row skeleton"></div>
      //     <div className="row skeleton"></div>
      //   </div>
      // </div>
      // <div>
      //   <div className="w-full relative overflow-hidden bg-blue-700 before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:translate-x-[-100%] before:bg-gradient-to-r	before:from-cyan-500 to-blue-500 before:animate-[shimmer]"></div>
      //   <div className="w-full relative overflow-hidden bg-blue-700 before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:translate-x-[-100%] before:bg-gradient-to-r	before:from-cyan-500 to-blue-500 before:animate-[shimmer]"></div>
      //   <div className="w-full relative overflow-hidden bg-blue-700 before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:translate-x-[-100%] before:bg-gradient-to-r	before:from-cyan-500 to-blue-500 before:animate-[shimmer]"></div>
      //   <div className="w-full relative overflow-hidden bg-blue-700 before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:translate-x-[-100%] before:bg-gradient-to-r	before:from-cyan-500 to-blue-500 before:animate-[shimmer]"></div>
      //   <div className="w-full relative overflow-hidden bg-blue-700 before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:translate-x-[-100%] before:bg-gradient-to-r	before:from-cyan-500 to-blue-500 before:animate-[shimmer]"></div>
      // </div>

      // <h1>Loading...</h1>

      <Spinner />
    );
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
