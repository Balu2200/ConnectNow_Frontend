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
    <nav className="bg-white shadow-lg animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/feed" 
            className="flex items-center space-x-2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-300"
          >
            <span className="text-3xl">👨‍💻</span>
            <span>CodeCircle</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              <span className="text-secondary-600 font-medium">
                Welcome, {user.firstName}
              </span>
              
              <Link 
                to="/profile" 
                className="nav-link"
              >
                Profile
              </Link>
              
              <Link 
                to="/connections" 
                className="nav-link"
              >
                Connections
              </Link>
              
              <Link 
                to="/requestreceived" 
                className="nav-link"
              >
                Requests
              </Link>
              
              <Link 
                to="/help" 
                className="nav-link"
              >
                Help
              </Link>
              
              <button 
                onClick={handleLogout}
                className="btn-primary bg-red-500 hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
