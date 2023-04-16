import React from "react";
import spinner from "../assets/svg/spinner.svg";

const Spinner = () => {
  return (
    <div className="bg-black bg-opacity-50 flex items-center justify-center fixed top-0 bottom-0 left-0 right-0 z-50">
      <div>
        <img src={spinner} alt="Loading..." className="h-24" />
      </div>
    </div>
  );
};

export default Spinner;
