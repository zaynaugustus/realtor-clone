import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function Contact({ userId, listing }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function fetchUserFromFirebase() {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        toast.error("User not found");
        navigate("/");
      }
    }

    fetchUserFromFirebase();
  }, [userId]);
  function onChange(e) {
    setMessage(e.target.value);
  }
  return (
    <>
      {user !== null && (
        <div className="flex flex-col w-full">
          <p>
            Contact {user.name} for the {listing.name.toLowerCase()}
          </p>
          <div className="mt-3 mb-6">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            ></textarea>
          </div>
          <a
            href={`mailto:${user.email}?Subject=${listing.name}&body=${message}`}
          >
            <button
              className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6"
              type="button"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
}
