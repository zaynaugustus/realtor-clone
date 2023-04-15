import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";

const OAuth = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  };
  return (
    <button
      type="button"
      className="w-full bg-red-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-red-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-red-800 flex items-center justify-center gap-3"
      onClick={handleClick}
    >
      <FcGoogle className="text-2xl rounded-[50%] bg-white p-[2px]" />
      <p>Continue with Google</p>
    </button>
  );
};

export default OAuth;
