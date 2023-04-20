import React, { useEffect } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

const EditListing = () => {
  const { listingId } = useParams();
  const auth = getAuth();
  const navigate = useNavigate();
  const [geolocationEnabled, setGeolocationEnabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const handleChange = (e) => {
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData };

      if (e.target.files) {
        newFormData[e.target.id] = e.target.files;
      } else if (
        e.target.id === "parking" ||
        e.target.id === "furnished" ||
        e.target.id === "offer"
      ) {
        newFormData[e.target.id] = e.target.value === "true" ? true : false;
      } else {
        newFormData[e.target.id] = e.target.value;
      }

      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (Number(discountedPrice) >= Number(regularPrice)) {
      setLoading(false);
      toast.error(
        "Discounted price cannot be greater than or equal to regular price"
      );
    } else if (images.length > 6) {
      setLoading(false);
      toast.error("You can only upload a maximum of 6 images");
    } else {
      const geolocation = { lat: latitude, lng: longitude };
      if (geolocationEnabled) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
        );
        const data = await response.json();

        if (!data?.status) {
          setLoading(false);
          toast.error("Invalid address");
          return;
        }

        geolocation.lat = data?.results[0]?.geometry?.location?.lat || latitude;
        geolocation.lng =
          data?.results[0]?.geometry?.location?.lng || longitude;
      }

      async function storeImage(image) {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const fileName = `${auth.currentUser.uid}-${image.name}.${uuidv4()}}`;
          const storageRef = ref(storage, `images/${fileName}`);
          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                default:
                  break;
              }
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      }

      try {
        const imgUrls = await Promise.all(
          [...images].map(async (image) => storeImage(image))
        );

        const formDataCopy = {
          ...formData,
          imgUrls,
          geolocation,
          timestamp: serverTimestamp(),
          userRef: auth.currentUser.uid,
        };

        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;

        const docRef = doc(db, "listings", listingId);
        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success("Listing edited successfully");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
      } catch (error) {
        setLoading(false);
        toast.error("Error uploading images");
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchDataFromFirebase = async () => {
      try {
        const docRef = doc(db, "listings", listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const newFormData = { ...docSnap.data() };
          newFormData.latitude = newFormData.geolocation.lat;
          newFormData.longitude = newFormData.geolocation.lng;
          delete newFormData.geolocation;
          setFormData(newFormData);
        } else {
          toast.error("Listing does not exist");
          //   navigate("/");
        }
      } catch (error) {
        toast.error("Error fetching listing");
        // navigate("/");
      }
      setLoading(false);
    };
    fetchDataFromFirebase();
  }, [listingId, navigate]);

  useEffect(() => {
    if (formData.userRef && formData.userRef !== auth.currentUser.uid) {
      toast.error("You are not authorized to edit this listing");
      navigate("/");
    }
  }, [formData.userRef, navigate]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold ">Edit Listing</h1>
      <form onSubmit={handleSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell/Rent</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={handleChange}
            className={`px-7 py-3 font-md text-sm uppercase shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "sale"
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={handleChange}
            className={`px-7 py-3 font-md text-sm uppercase shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "rent"
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
          >
            Rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleChange}
          placeholder="Name"
          minLength="10"
          maxLength="32"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-slate-600 mb-6"
        />

        <div className="flex space-x-6 mb-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={handleChange}
              min="1"
              max="50"
              required
              className="px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center w-full"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={handleChange}
              min="1"
              max="50"
              required
              className="px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center w-full"
            />
          </div>
        </div>

        <p className="text-lg mt-6 font-semibold">Parking spot</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={handleChange}
            className={`px-7 py-3 font-md text-sm uppercase shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              parking ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={handleChange}
            className={`px-7 py-3 font-md text-sm uppercase shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            No
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={handleChange}
            className={`px-7 py-3 font-md text-sm uppercase shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={handleChange}
            className={`px-7 py-3 font-md text-sm uppercase shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
          >
            No
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          placeholder="Address"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-slate-600 mb-6"
        />

        {!geolocationEnabled && (
          <div className="flex space-x-6 justify-start mb-6">
            <div>
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={handleChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
            <div>
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={handleChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
          </div>
        )}

        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          placeholder="Description"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-900 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Offer</p>
        <div className="flex mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={handleChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={handleChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <div className="flex items-center mb-6">
          <div className="">
            <p className="text-lg font-semibold">Regular price</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={handleChange}
                min="50"
                max="400000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Discounted price</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={handleChange}
                  min="50"
                  max="400000000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div className="">
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div>
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={handleChange}
            accept=".jpg, .png, .jpeg"
            multiple
            required
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6 active:bg-blue-800 active:shadow-lg"
          />
        </div>

        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 font-medium text-white text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg"
        >
          <p className="text-lg font-semibold">Edit listing</p>
        </button>
      </form>
    </main>
  );
};

export default EditListing;
