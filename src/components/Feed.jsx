import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Usercard from "./Usercard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

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
      setDirection(1);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 transition-all duration-700 relative">
      {feed.length === 0 ? (
        <p className="text-gray-500 text-lg font-medium">Loading feed...</p>
      ) : feed.Data && feed.Data.length > 0 ? (
        <div className="relative flex items-center justify-center">
         
          <button
            className="absolute left-[-3.5rem] p-3 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 transition"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <FaArrowLeft size={24} />
          </button>

      
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 100 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative flex items-center justify-center"
          >
            <Usercard user={feed.Data[currentIndex]} />
          </motion.div>

      
          <button
            className="absolute right-[-3.5rem] p-3 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 transition"
            onClick={handleNext}
            disabled={currentIndex === feed.Data.length - 1}
          >
            <FaArrowRight size={24} />
          </button>
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
