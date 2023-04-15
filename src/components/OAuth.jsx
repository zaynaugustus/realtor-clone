import React from "react";
import { FcGoogle } from "react-icons/fc";

const OAuth = () => {
  return (
    <button
      type="submit"
      className="w-full bg-red-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-red-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-red-800 flex items-center justify-center gap-3"
    >
      <FcGoogle className="text-2xl rounded-[50%] bg-white p-[2px]" />
      <p>Continue with Google</p>
    </button>
  );
};

export default OAuth;
