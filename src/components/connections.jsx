import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connection) || []; 
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

   
      if (res.data && res.data.Data) {
        dispatch(addConnections(res.data.Data));
      } else {
        console.warn("No connections found");
      }
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="text-center  bg-gradient-to-r from-slate-600 h-screen">
      <h1 className="font-bold text-3xl text-indigo-500 mb-6 py-2">Connections</h1>

      {connections.length === 0 ? (
        <p className="text-gray-500 text-lg">No connections available.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {connections
            .filter((con) => con) 
            .map((con) => {
              const { _id, firstName, lastName, photoUrl, age, about } =
                con || {};

              return (
                <div
                  key={_id || Math.random()} 
                  className="bg-slate-300 p-5 w-[350px] shadow-lg rounded-2xl flex flex-col items-center transition-transform transform hover:scale-105"
                >
                  <img
                    className="w-28 h-28 rounded-full object-cover border-4 border-pink-400"
                    alt="User"
                    src={
                      photoUrl ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCKq1XnPYYDaUIlwlsvmLPZ-9-rdK28RToA&s"
                    }
                  />
                  <h2 className="text-gray-800 text-xl font-semibold mt-4">
                    {firstName
                      ? `${firstName} ${lastName || ""}`
                      : "Unknown User"}
                  </h2>
                  <h3 className="text-gray-600 mt-1 text-sm">
                    Age: {age || "N/A"}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm text-center px-4">
                    {about ? `Profession: ${about}` : "No details available"}
                  </p>
                  <button className="mt-4 px-5 py-2 bg-pink-500 text-white font-medium rounded-full shadow-md hover:bg-pink-600 transition">
                    Message 💬
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Connections;
