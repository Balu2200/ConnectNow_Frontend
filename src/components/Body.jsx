import Navbar from "./navBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  useEffect(() => {
    // Skip profile fetch if on public routes (login/signup)
    const publicRoutes = ["/login", "/signup"];
    if (publicRoutes.includes(location.pathname)) {
      return;
    }

    const fetchUser = async () => {
      if (userData) return;
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        console.error("Profile fetch error:", err);

        // Only redirect to login for authentication errors
        if (err?.response?.status === 401) {
          // Clear any stale user data
          dispatch(removeUser());
          navigate("/login");
        } else if (!err.response) {
          // Network error - don't redirect, user might be offline temporarily
          console.error("Network error while fetching profile");
        } else if (err.response.status >= 500) {
          // Server error - don't redirect
          console.error("Server error while fetching profile");
        } else {
          // Other errors - log but don't redirect
          console.error(
            "Error fetching profile:",
            err.response?.data?.message || err.message
          );
        }
      }
    };
    fetchUser();
  }, [userData, dispatch, navigate, location.pathname]);

  // Check if we're on a public route
  const isPublicRoute = ["/login", "/signup"].includes(location.pathname);

  return (
    <div>
      {/* Only show Navbar on protected routes */}
      {!isPublicRoute && <Navbar />}
      <Outlet />
    </div>
  );
};

export default Body;
