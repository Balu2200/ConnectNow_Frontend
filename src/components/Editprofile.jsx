import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { motion, AnimatePresence } from "framer-motion";

const EditProfile = () => {
  const user = useSelector((store) => store.user) || {};

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [about, setAbout] = useState(user?.about || "");
  const [age, setAge] = useState(user?.age || "");
  const [skills, setSkills] = useState(user?.skills || "");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);

  const dispatch = useDispatch();

  const saveProfile = async () => {
    if (!firstName || !lastName || !age || !about) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/update`,
        {
          firstName,
          lastName,
          photoUrl,
          age: Number(age),
          skills,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data?.data));
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
      <AnimatePresence mode="wait">
        {viewProfile ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center"
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold mb-8 text-white border-b-2 border-blue-500 pb-3"
            >
              Profile Details
            </motion.h2>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="mb-8"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-40 h-40 rounded-full mx-auto border-4 border-blue-500 shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                />
              ) : (
                <div className="w-40 h-40 rounded-full mx-auto bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-2xl font-semibold text-white shadow-lg">
                  No Image
                </div>
              )}
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-left space-y-4"
            >
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-[120px_1fr] gap-4 bg-gray-700/50 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-gray-700/70 transition-colors"
              >
                <span className="font-semibold text-blue-400">Name:</span>
                <span className="text-white">
                  {firstName} {lastName}
                </span>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-[120px_1fr] gap-4 bg-gray-700/50 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-gray-700/70 transition-colors"
              >
                <span className="font-semibold text-blue-400">Age:</span>
                <span className="text-white">{age}</span>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-[120px_1fr] gap-4 bg-gray-700/50 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-gray-700/70 transition-colors"
              >
                <span className="font-semibold text-blue-400">About:</span>
                <span className="text-white">{about}</span>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-[120px_1fr] gap-4 bg-gray-700/50 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-gray-700/70 transition-colors"
              >
                <span className="font-semibold text-blue-400">Skills:</span>
                <span className="text-white">{skills}</span>
              </motion.div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
              onClick={() => setViewProfile(false)}
            >
              Back to Edit
            </motion.button>
          </motion.div>
        ) : !success ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-lg"
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-center mb-8 text-white"
            >
              Edit Profile
            </motion.h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div variants={itemVariants}>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <input
                  type="number"
                  className="w-full p-4 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                  placeholder="Photo URL"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <textarea
                  className="w-full p-4 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32 transition-all duration-300"
                  placeholder="About"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                  placeholder="Skills (comma-separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </motion.div>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-4 text-center"
              >
                {error}
              </motion.p>
            )}

            <div className="flex justify-between items-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                onClick={() => setViewProfile(true)}
              >
                View Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-700 hover:shadow-lg hover:shadow-green-500/30"
                }`}
                onClick={saveProfile}
                disabled={loading}
              >
                {loading ? "Saving..." : "Submit"}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center text-center bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4"
            >
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold text-green-400"
            >
              Profile Updated Successfully!
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfile;
