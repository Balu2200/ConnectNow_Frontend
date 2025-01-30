import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import Usercard from "./Usercard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0); 

  const getFeed = async () => {
    if (feed.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleNext = () => {
    if (feed.Data && currentIndex < feed.Data.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-300">
      {feed.length === 0 ? (
        <p className="text-gray-500 text-lg font-medium">Loading feed...</p>
      ) : feed.Data && feed.Data.length > 0 ? (
        <div className="my-10">
          <Usercard user={feed.Data[currentIndex]} />{" "}
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
              onClick={handlePrevious}
              disabled={currentIndex === 0} 
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
              onClick={handleNext}
              disabled={currentIndex === feed.Data.length - 1} 
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-lg font-medium">
          There is no feed available.
        </p>
      )}
    </div>
  );
};

export default Feed;
