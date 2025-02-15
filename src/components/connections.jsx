import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connection) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        });

        if (res.data?.Data) {
          dispatch(addConnections(res.data.Data));
        } else {
          console.warn("No connections found");
        }
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    };

    fetchConnections();
  }, [dispatch]);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-r from-blue-700 to-blue-900">
      <h1 className="text-center font-bold text-3xl text-white mb-8">
        My Connections
      </h1>

      {connections.length === 0 ? (
        <p className="text-center text-gray-200 text-lg">
          No connections available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {connections.map((con) => {
            const { _id, firstName, lastName, photoUrl, age, about } =
              con || {};

            return (
              <div
                key={_id}
                className="bg-white p-4 w-[250px] h-[220px] shadow-lg rounded-lg flex flex-col items-center text-center transition-transform transform hover:scale-105"
              >
                <img
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  alt="User"
                  src={
                    photoUrl ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCKq1XnPYYDaUIlwlsvmLPZ-9-rdK28RToA&s"
                  }
                />
                <h2 className="text-gray-800 text-lg font-semibold mt-2">
                  {firstName
                    ? `${firstName} ${lastName || ""}`
                    : "Unknown User"}
                </h2>
                <p className="text-gray-600 text-sm">Age: {age || "N/A"}</p>
                <p className="text-gray-500 text-xs mt-1 w-[90%] truncate overflow-hidden">
                  {about
                    ? `Profession: ${about.substring(0, 50)}...`
                    : "No details available"}
                </p>
                <button
                  onClick={() => navigate(`/chat/${_id}`)}
                  className="mt-auto px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-600 transition"
                >
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
