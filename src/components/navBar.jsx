import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

function Navbar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-between bg-sky-900 px-6 py-3 shadow-md">
      <Link to="/feed" className="text-2xl font-bold text-indigo-400">
        👨‍💻 CodeCircle
      </Link>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-blue-100 font-semibold">
            Welcome, {user.firstName}
          </span>
          <Link to="/profile" className="btn">
            Profile
          </Link>
          <Link to="/connections" className="btn">
            Connections
          </Link>
          <Link to="/requestreceived" className="btn">
            Requests
          </Link>
          <button className="btn bg-red-600 text-white" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
