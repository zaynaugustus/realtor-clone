import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";

export default function Listing() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListingFromFirebase() {
      try {
        const docRef = doc(db, "listings", listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data());
          setLoading(false);
        } else {
          toast.error("Listing not found");
          navigate("/");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    fetchListingFromFirebase();
  }, [listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidePerView={3}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        // modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${url}) top no-repeat`,
                backgroundSize: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className=" fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
        {shareLinkCopied && (
          <span className="absolute -bottom-10 -right-2 bg-gray-400 font-semibold border-2 border-gray-400 rounded-md text-white text-xs px-2 py-1">
            Copied
          </span>
        )}
      </div>
    </main>
  );
}
