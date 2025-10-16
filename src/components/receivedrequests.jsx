import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";

const ReceivedRequests = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/request/received`, {
          withCredentials: true,
        });
        dispatch(addRequest(res.data.Data));
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Connection Requests
          </h1>
          <p className="text-slate-600">
            Review and manage incoming connection requests
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                ></path>
              </svg>
            </div>
            <p className="text-slate-500 text-lg">
              No connection requests available.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => {
              if (!req.fromUserId) return null;

              const { _id, firstName, lastName, photoUrl, age, about } =
                req.fromUserId;

              return (
                <div
                  key={_id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {photoUrl ? (
                        <img
                          className="w-full h-full object-cover"
                          alt="Profile"
                          src={photoUrl}
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-slate-400"
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

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {firstName} {lastName}
                      </h3>
                      {age && (
                        <p className="text-sm text-slate-500 mt-1">
                          Age: {age}
                        </p>
                      )}
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                        {about || "No description available"}
                      </p>
                    </div>

                    <div className="flex space-x-3 flex-shrink-0">
                      <button
                        className="bg-accent hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center space-x-2"
                        onClick={() => reviewRequest("accepted", req._id)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span>Accept</span>
                      </button>
                      <button
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center space-x-2"
                        onClick={() => reviewRequest("rejected", req._id)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReceivedRequests;
