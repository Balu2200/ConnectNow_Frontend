import axios from "axios";
import { BASE_URL } from "../utils/constants";
import {useDispatch} from "react-redux";
import { removeFromFeed } from "../utils/feedSlice";

const Usercard = ({ user }) => {
  
  const{_id, photoUrl, firstName, lastName, about, gender, age, skills} = user;

  const dispatch = useDispatch();

  const handleSendRequest = async(status, userid) =>{
    try{
        const res = await axios.post(BASE_URL + "/request/send/"+ status +"/"+ userid,{},{withCredentials:true});
        console.log("Removing user:",userid);
        dispatch(removeFromFeed(userid));
    }
    catch(err){
       console.error(
         "Error in request:",
         err.response ? err.response.data : err.message
       );
    } 
  }


  return (
    <div className="card w-80 shadow-2xl rounded-2xl overflow-hidden bg-black border border-gray-300">
      <figure className="w-8/12 h-50 px-5 mx-14 mt-4 flex justify-center items-center overflow-hidden rounded-3xl">
        <img
          src={
            photoUrl ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCKq1XnPYYDaUIlwlsvmLPZ-9-rdK28RToA&s"
          }
          alt="Photo"
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body p-6">
        <h2 className="card-title text-2xl font-semibold justify-center text-white">
          {firstName + " " + lastName}
        </h2>

        {skills && (
          <p className="text-white text-sm  font-bold"> Skill : {skills}</p>
        )}
        <p className="text-white mt-4">{about}</p>
        <div className="card-actions flex justify-center space-x-4 mt-6">
          <button
            className="px-5 py-2 bg-blue-400 text-white font-bold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out"
            onClick={() => handleSendRequest("ignore", _id)}
          >
            Ignore
          </button>
          <button
            className="px-5 py-2 bg-pink-600   text-white font-bold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out"
            onClick={() => handleSendRequest("interested", _id)}
          >
           Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default Usercard;
