import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
    

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );

      dispatch(addUser(response.data));
      navigate("/feed");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Check details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 text-primary-content w-96 shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-bold text-white text-center">Login</h2>

        <div className="mt-4">
          <label className="block text-gray-300 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-300 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 mt-1 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-4 text-center">
          <Link to="/signup" className="text-pink-500 hover:underline text-sm">
            New? Sign up
          </Link>
        </div>

        <button
          className={`w-full mt-4 py-2 font-semibold rounded-lg transition-all ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-800 hover:bg-blue-700"
          }`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
