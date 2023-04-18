import { Link } from "react-router-dom";
import Img from "../components/Img";
// import Moment from "react-moment";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ id, listing }) => {
  console.log(listing);
  return (
    <li className="relative bg-white flex flex-col hover:shadow-xl rounded-md transition-shadow duration-150 w-full sm:w-[32%] md:w-[24%] overflow-hidden ">
      <Link to={`/category/${listing.type}/${id}`} className="">
        <Img
          src={listing.imgUrls[0]}
          alt={`${listing.name}`}
          className="hover:scale-105 sm:h-[170px] object-contain"
        />
        {/* <Moment
          fromNow
          className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
        >
          {listing.timestamp?.toDate()}
        </Moment> */}
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold m-0 text-xl truncate">{listing.name}</p>
          <p className="text-[#457b9d] mt-2 font-semibold">
            ${" "}
            {(listing.offer ? listing.discountedPrice : listing.regularPrice)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-2">
            <div>
              <p className="font-bold text-xs">
                {listing.beds > 1 ? `${listing.beds} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.baths > 1 ? `${listing.baths} Baths` : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
export default ListingItem;
