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
import InfiniteScroll from "react-infinite-scroll-component";
import spinner from "../assets/svg/spinner.svg";

export default function Offers() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const q = query(
          collection(db, "listings"),
          where("offer", "==", true),
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
  }, []);

  if (loading) {
    return <Spinner />;
  }

  async function fetchMoreListings() {
    try {
      const q = query(
        collection(db, "listings"),
        where("offer", "==", true),
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
      <h1 className="text-3xl text-center mt-6 mb-6 font-bold">Offers</h1>
      {listings.length == 0 ? (
        <p className="text-center text-2xl mt-6">There are no current offers</p>
      ) : (
        <>
          <main>
            <InfiniteScroll
              className="sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              dataLength={listings.length || []}
              next={fetchMoreListings}
              hasMore={lastDoc}
              loader={
                <div className="col-span-full">
                  <img
                    src={spinner}
                    alt="Loading..."
                    className="h-16 mx-auto"
                  />
                </div>
              }
            >
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </InfiniteScroll>
          </main>
          {/* {lastDoc && (
            <div className="flex justify-center items-center">
              <button
                onClick={fetchMoreListings}
                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
              >
                Load more
              </button>
            </div>
          )} */}
        </>
      )}
    </div>
  );
}
