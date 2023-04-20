import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function Category() {
  const { categoryName } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const q = query(
          collection(db, "listings"),
          where("type", "==", categoryName),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        setLastDoc(querySnap.docs[querySnap.docs.length - 1]);
        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({ id: doc.id, data: doc.data() });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listing");
      }
    }

    fetchListings();
  }, [categoryName]);

  if (loading) {
    return <Spinner />;
  }

  async function fetchMoreListings() {
    try {
      const q = query(
        collection(db, "listings"),
        where("type", "==", categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastDoc),
        limit(4)
      );
      const querySnap = await getDocs(q);
      setLastDoc(querySnap.docs[querySnap.docs.length - 1]);
      const listings = [];
      querySnap.forEach((doc) => {
        listings.push({ id: doc.id, data: doc.data() });
      });
      setListings((prevListings) => [...prevListings, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listing");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 mb-6 font-bold">
        Places for {categoryName === "rent" ? "Rent" : "Sale"}
      </h1>
      {listings.length == 0 ? (
        <p className="text-center text-2xl mt-6">
          There are no current places for{" "}
          {categoryName === "rent" ? "Rent" : "Sale"}
        </p>
      ) : (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {lastDoc && (
            <div className="flex justify-center items-center">
              <button
                onClick={fetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
