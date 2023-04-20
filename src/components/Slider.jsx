import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default function Slider() {
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllListingsFromFirebase() {
      try {
        const q = query(
          collection(db, "listings"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const querySnap = await getDocs(q);
        const allListings = [];
        querySnap.forEach((doc) => {
          allListings.push({ id: doc.id, ...doc.data() });
        });
        setListings(allListings);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
      }
    }
    fetchAllListingsFromFirebase();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Swiper
      slidesPerView={1}
      navigation
      pagination={{ type: "progressbar" }}
      effect="fade"
      modules={[EffectFade]}
      autoplay={{ delay: 3000 }}
    >
      {listings.map((listing, index) => (
        <SwiperSlide
          key={index}
          onClick={() => {
            navigate(`/category/${listing.type}/${listing.id}`);
          }}
        >
          <div
            className="relative w-full overflow-hidden h-[300px] cursor-pointer"
            style={{
              background: `url(${listing.imgUrls[0]}) top no-repeat`,
              backgroundSize: "cover",
            }}
          >
            <p className="absolute text-[#f1faee] left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-xl opacity-90 p-2 rounded-br-3xl">
              {listing.name}
            </p>
            <p className="absolute text-[#f1faee] left-1 bottom-3 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
              {(listing.offer ? listing.discountedPrice : listing.regularPrice)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.type === "rent" ? " / month" : ""}
            </p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
