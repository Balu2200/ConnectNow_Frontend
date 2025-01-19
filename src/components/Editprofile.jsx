import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import Usercard from "./Usercard";

const Editprofile = () => {
  const user = useSelector((store) => store.user);

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [about, setAbout] = useState(user.about || "");
  const [age, setAge] = useState(user.age || "");
  const [skills, setSkills] = useState(user.skills || "");

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
    <div className="flex justify-center my-10">
      {viewProfile ? (
        <div className="flex flex-col items-center justify-center text-center">
          <Usercard
            user={{ firstName, lastName, photoUrl, age, about, skills }}
          />
          <button
            className="btn btn-secondary mt-4"
            onClick={() => setViewProfile(false)}
          >
            Back to Edit
          </button>
        </div>
      ) : !success ? (
        <div className="card bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl rounded-lg w-96">
          <div className="card-body">
            <h2 className="card-title text-center font-bold text-2xl">
              Edit Profile
            </h2>
            <p className="text-sm text-center mb-4">
              Update your personal information below.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                className="input input-bordered w-full rounded-lg p-3 bg-gray-50 text-black"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                className="input input-bordered w-full rounded-lg p-3 bg-gray-50 text-black"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="number"
                className="input input-bordered w-full rounded-lg p-3 bg-gray-50 text-black"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <input
                type="text"
                className="input input-bordered w-full rounded-lg p-3 bg-gray-50 text-black"
                placeholder="Enter your photo URL"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
              <input
                type="text"
                className="input input-bordered w-full rounded-lg p-3 bg-gray-50 text-black"
                placeholder="Tell us about yourself"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
              <input
                type="text"
                className="input input-bordered w-full rounded-lg p-3  bg-gray-50 text-black"
                placeholder="Enter your skills (comma-separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center font-semibold">
                {error}
              </p>
            )}
            <div className="card-actions justify-between mt-6">
              <button
                onClick={() => setViewProfile(true)}
                className="btn btn-secondary rounded-lg text-white font-semibold"
              >
                View Profile
              </button>
              <button
                onClick={saveProfile}
                className={`btn btn-primary w-full rounded-lg text-white font-semibold ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-green-600">
            Profile Updated Successfully!
          </h2>
          <p className="text-gray-600 mt-2">Your changes have been saved.</p>
          <Usercard
            user={{ firstName, lastName, photoUrl, age, about, skills }}
          />
        </div>
      )}
    </div>
  );
};

export default Editprofile;
