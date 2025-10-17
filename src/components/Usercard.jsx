import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFromFeed, addUserToFeed } from "../utils/feedSlice";
import { addToast } from "../utils/notificationsSlice";
import { Link } from "react-router-dom";

const Usercard = ({ user }) => {
  const { _id, photoUrl, firstName, lastName, about, skills } = user;
  const dispatch = useDispatch();
  const [responseStatus, setResponseStatus] = useState(null);
  const [reqInfo, setReqInfo] = useState(user.requestInfo || null);
  const [withdrawing, setWithdrawing] = useState(false);

  const handleSendRequest = async (status, userId) => {
    if (reqInfo) return; // prevent sending if a request already exists
    // Optimistic UI: remove immediately
    setResponseStatus(status === "interested" ? "Interested" : "Ignored");
    dispatch(removeFromFeed(userId));

    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      // Success: mark this user as having an outgoing pending request when coming from a context that doesn't remove them
      // In our current flow we remove from feed; if that changes, we could uncomment the following line:
      // dispatch(updateUserRequestInfo({ userId, requestInfo: { exists: true, status: "interested", direction: "outgoing" } }));
    } catch (err) {
      console.error("Error in request:", err);

      // Rollback on failure
      dispatch(addUserToFeed(user));

      let errorMessage = "Failed to send request. Please try again.";
      if (!err.response) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err.response.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (err.response.status === 400) {
        errorMessage =
          err.response?.data?.message || "Invalid request. Please try again.";
      } else if (err.response.status === 409) {
        errorMessage = "You've already sent a request to this user.";
      } else if (err.response.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage =
          err.response?.data?.message || err.response?.data || errorMessage;
      }

      dispatch(addToast(errorMessage, "error", 3500));
    }
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawing(true);
      await axios.delete(`${BASE_URL}/request/withdraw/${_id}`, {
        withCredentials: true,
      });
      setReqInfo(null);
      setResponseStatus(null);
      // Reflect in global feed if this card appears elsewhere
      // dispatch(updateUserRequestInfo({ userId: _id, requestInfo: null }));
      dispatch(addToast("Request withdrawn", "success", 2500));
    } catch (err) {
      console.error("Error withdrawing request:", err);

      let errorMessage = "Failed to withdraw request.";
      if (!err.response) {
        errorMessage = "Network error. Please check your connection.";
      } else if (err.response.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (err.response.status === 404) {
        errorMessage = "Request not found or already withdrawn.";
      } else if (err.response.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage =
          err.response?.data?.message || err.response?.data || errorMessage;
      }

      dispatch(addToast(errorMessage, "error", 3500));
    } finally {
      setWithdrawing(false);
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
        {reqInfo && reqInfo.status === "interested" ? (
          reqInfo.direction === "outgoing" ? (
            <>
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors border ${
                  withdrawing
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed border-slate-200"
                    : "bg-white hover:bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {withdrawing ? "Withdrawing..." : "Withdraw"}
              </button>
              <button
                disabled
                className="flex-1 py-3 rounded-xl font-medium bg-accent/10 text-accent cursor-not-allowed"
              >
                Pending
              </button>
            </>
          ) : (
            <>
              <button
                disabled
                className="flex-1 py-3 rounded-xl font-medium bg-accent/10 text-accent cursor-not-allowed"
              >
                Pending
              </button>
              <Link
                to="/requestreceived"
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary hover:bg-blue-700 text-center"
              >
                Review
              </Link>
            </>
          )
        ) : (
          <>
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
          </>
        )}
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
    requestInfo: PropTypes.shape({
      exists: PropTypes.bool,
      status: PropTypes.string,
      direction: PropTypes.string,
      requestId: PropTypes.string,
    }),
  }).isRequired,
};

export default Usercard;
