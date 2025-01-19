import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";

const Receivedrequests = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/received", {
        withCredentials: true,
      });
      dispatch(addRequest(res.data.Data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-3xl text-pink-400">Connection Requests</h1>
      {requests.length === 0 ? ( // Display message if no requests
        <p className="text-gray-500 text-lg font-medium mt-10">
          No connection requests available.
        </p>
      ) : (
        requests.map((req) => {
          const { _id, firstName, lastName, photoUrl, age, about } =
            req.fromUserId;

          return (
            <div
              key={_id}
              className="mt-4 m-10 h-44 p-5 w-1/2 bg-slate-300 rounded-2xl flex shadow-lg hover:shadow-xl transition-shadow duration-300 mx-auto"
            >
              <img
                className="w-40 h-40 -mt-2 rounded-full object-cover border-4 border-pink-400"
                alt="photo"
                src={
                  photoUrl ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCKq1XnPYYDaUIlwlsvmLPZ-9-rdK28RToA&s"
                }
              />
              <div className="ml-6 flex flex-col justify-center">
                <h2 className="text-gray-800 text-2xl font-semibold">
                  {firstName + " " + lastName}
                </h2>
                {age && <h3 className="text-black mt-2">Age: {age}</h3>}
                <p className="text-black  mt-1">Profession: {about}</p>
              </div>
              <div className="flex mx-6">
                <button
                  className="btn btn-primary mx-4 mt-8"
                  onClick={() => reviewRequest("accepted", req._id)}
                >
                  💓Accept
                </button>
                <button
                  className="btn btn-secondary mx-4 mt-8"
                  onClick={() => reviewRequest("rejected", req._id)}
                >
                  👎Reject
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Receivedrequests;
