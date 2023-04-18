import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcHome } from "react-icons/fc";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const [changeDetails, setChangeDetails] = useState(false);

  const navigate = useNavigate();

  // const [loggedIn, setLoggedIn] = useState(false);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setFormData({
  //          name: auth.currentUser.displayName,
  //          email: auth.currentUser.email,
  //        });
  //     }
  //   });
  // }, []);

  const { name, email } = formData;

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });

        toast.success("Profile details updated successfully");
      }
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        listings.push({ data: doc.data(), id: doc.id });
      });

      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  return (
    <>
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3 mx-auto">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              className={
                "mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" +
                (changeDetails && " border-2 border-blue-500")
              }
              disabled={!changeDetails}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              id="email"
              defaultValue={email}
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex items-center">
                Do you want to change your name?
                <span
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                  onClick={() => {
                    setChangeDetails((prevChangeDetails) => !prevChangeDetails);
                    changeDetails && handleSubmit();
                  }}
                >
                  {changeDetails ? "Apply Changes" : "Edit"}
                </span>
              </p>
              <p
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
                onClick={handleLogout}
              >
                Sign out
              </p>
            </div>
          </form>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-sm uppercase px-7 py-3 font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-int-out hover:shadow-lg active:bg-blue-800"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center gap-5"
            >
              <FcHome className="text-3xl bg-red-200 rounded-full p-1 border-2" />{" "}
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>

      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold">My Listings</h2>

            <ul className="flex flex-wrap gap-[1%]">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
