import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFromFeed } from "../utils/feedSlice";

const Usercard = ({ user }) => {
  const { _id, photoUrl, firstName, lastName, about, skills } = user;
  const dispatch = useDispatch();
  const [responseStatus, setResponseStatus] = useState(null);

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      // Set response message based on status
      setResponseStatus(status === "interested" ? "Interested" : "Ignored");

      // Remove the user from feed
      dispatch(removeFromFeed(userId));
    } catch (err) {
      console.error(
        "Error in request:",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-sm">
      <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="User"
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-12 h-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        )}
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        {firstName} {lastName}
      </h2>

      <div className="mb-6">
        {skills && (
          <p className="text-sm font-medium text-slate-700 mb-2">
            Skills: {skills}
          </p>
        )}
        <p className="text-sm text-slate-600">
          {about || "No description available"}
        </p>
      </div>

      {responseStatus && (
        <div
          className={`mb-6 p-3 rounded-lg ${
            responseStatus === "Interested"
              ? "bg-accent/10 text-accent"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <p className="font-medium">
            {responseStatus === "Interested"
              ? "✓ Connection request sent!"
              : "User ignored"}
          </p>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            responseStatus === "Ignored"
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
          onClick={() => handleSendRequest("ignore", _id)}
          disabled={responseStatus !== null}
        >
          {responseStatus === "Ignored" ? "Ignored" : "Ignore"}
        </button>

        <button
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            responseStatus === "Interested"
              ? "bg-accent text-white cursor-not-allowed"
              : "bg-accent hover:bg-emerald-600 text-white"
          }`}
          onClick={() => handleSendRequest("interested", _id)}
          disabled={responseStatus !== null}
        >
          {responseStatus === "Interested" ? "Request Sent" : "Interested"}
        </button>
      </div>
    </div>
  );
};

Usercard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    photoUrl: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string,
    about: PropTypes.string,
    skills: PropTypes.string,
  }).isRequired,
};

export default Usercard;
