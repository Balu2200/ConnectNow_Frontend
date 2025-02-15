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

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-3xl text-pink-400">Connection Requests</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500 text-lg font-medium mt-10">
          No connection requests available.
        </p>
      ) : (
        requests.map((req) => {
          if (!req.fromUserId) return null; 

          const { _id, firstName, lastName, photoUrl, age, about } =
            req.fromUserId;

          return (
            <div
              key={_id}
              className="mt-4 m-10 min-h-[180px] p-5 w-1/2 bg-slate-300 rounded-2xl flex shadow-lg hover:shadow-xl transition-shadow duration-300 mx-auto items-center"
            >
              <img
                className="w-28 h-28 rounded-full object-cover border-4 border-pink-400 flex-shrink-0"
                alt="Profile"
                src={
                  photoUrl ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCKq1XnPYYDaUIlwlsvmLPZ-9-rdK28RToA&s"
                }
              />
              <div className="ml-6 flex-1">
                <h2 className="text-gray-800 text-xl font-semibold">
                  {firstName} {lastName}
                </h2>
                {age && <h3 className="text-black mt-1 text-sm">Age: {age}</h3>}
                <p className="text-black mt-1 text-sm line-clamp-2">
                  Profession: {about}
                </p>
              </div>
              <div className="flex gap-4 ml-4">
                <button
                  className="bg-pink-300 hover:bg-pink-600 text-white py-2 px-4 rounded-lg"
                  onClick={() => reviewRequest("accepted", req._id)}
                >
                  💓 Accept
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                  onClick={() => reviewRequest("rejected", req._id)}
                >
                  👎 Reject
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ReceivedRequests;
