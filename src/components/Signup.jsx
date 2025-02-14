import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await axios.post(BASE_URL + "/signup", data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        alert("Profile created successfully!");
        navigate("/login");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 bg-opacity-90 rounded-xl shadow-xl backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Signup
        </h2>
        <p className="text-sm text-center text-gray-400 mb-4">
          Create a new account by filling the form below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="firstName"
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your last name"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-blue-500 hover:bg-blue-400 transition text-white font-semibold shadow-md"
          >
            Signup
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400 mb-2">Already have an account?</p>
          <Link
            to="/login"
            className="w-full block p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white font-semibold shadow-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
