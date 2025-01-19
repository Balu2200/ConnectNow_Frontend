import { useDispatch, useSelector } from "react-redux";
import { Link,  useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

function Navbar(){

    const user = useSelector((store) =>store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async() =>{
        try{
            await axios.post(BASE_URL+"/logout",{},{withCredentials:true});
            dispatch(removeUser());
            return navigate("/login");
        }
        catch(err){
          console.error(err);
        }
    }

    return (
      <div className="navbar bg-base-300">
        <div className="flex-1">
          <Link to="/feed" className="btn btn-ghost text-xl">
            👨‍💻Dev-Connect
          </Link>
        </div>
        {user && (
          <div className="flex-none gap-2">
            <div className="form-control px-2">Welcome,{user.firstName}</div>
            <div className="dropdown dropdown-end flex">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="UserPhoto" src={user.photoUrl} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="justify-between">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requestreceived" className="justify-between">
                    Requests
                  </Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
}

export default Navbar