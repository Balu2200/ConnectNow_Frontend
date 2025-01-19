import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connection);

  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.Data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-3xl text-pink-400">Connections</h1>
      {connections.map((con) => {
        const { _id, firstName, lastName, photoUrl, age, about } = con;

        return (
          <div
            key={_id}
            className="mt-4 m-10 h-52 p-5 w-1/2 bg-slate-300 rounded-2xl flex shadow-lg hover:shadow-xl transition-shadow duration-300 mx-auto"
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
              <h3 className="text-black mt-2">Age: {age}</h3>
              <p className="text-black mt-1 max-w-xs truncate">
                Profession: {about || "N/A"}
              </p>
            </div>
            <div className="flex items-center ml-auto">
              <button className="btn btn-primary">🔤Message</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
