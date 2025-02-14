import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

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

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
      {viewProfile ? (
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-lg text-center">
          <h2 className="text-2xl font-bold mb-6 text-white border-b-2 border-gray-600 pb-2">
            Profile Details
          </h2>

          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-400 shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-gray-600 flex items-center justify-center text-xl font-semibold text-white shadow-lg">
              No Image
            </div>
          )}

          <div className="text-left space-y-4">
            <div className="grid grid-cols-[120px_1fr] gap-4 bg-gray-700 px-4 py-2 rounded-md">
              <span className="font-semibold text-blue-400">Name:</span>
              <span className="text-white">
                {firstName} {lastName}
              </span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4 bg-gray-700 px-4 py-2 rounded-md">
              <span className="font-semibold text-blue-400">Age:</span>
              <span className="text-white">{age}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4 bg-gray-700 px-4 py-2 rounded-md">
              <span className="font-semibold text-blue-400">About:</span>
              <span className="text-white">{about}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4 bg-gray-700 px-4 py-2 rounded-md">
              <span className="font-semibold text-blue-400">Skills:</span>
              <span className="text-white">{skills}</span>
            </div>
          </div>

          <button
            className="mt-6 px-5 py-2.5 rounded-md bg-blue-500 hover:bg-blue-400 text-white font-medium transition shadow-lg"
            onClick={() => setViewProfile(false)}
          >
            Back to Edit
          </button>
        </div>
      ) : !success ? (
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Edit Profile</h2>

          <div className="space-y-3">
            <input
              type="text"
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              type="text"
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <input
              type="number"
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <input
              type="text"
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />

            <textarea
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
              placeholder="About"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            <input
              type="text"
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Skills (comma-separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}

          <div className="flex justify-between items-center mt-5">
            <button
              onClick={() => setViewProfile(true)}
              className="px-5 py-2.5 rounded-md bg-blue-500 hover:bg-blue-400 text-white font-medium transition"
            >
              View Profile
            </button>
            <button
              onClick={saveProfile}
              className={`px-5 py-2.5 rounded-md text-white font-medium transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-400"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-400">Profile Updated!</h2>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
