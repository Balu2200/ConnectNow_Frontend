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
    <div className="flex justify-center items-center my-10">
      <div className="card bg-gradient-to-br bg-black text-white shadow-xl rounded-lg w-96">
        <div className="card-body">
          <h2 className="card-title text-red-500 text-center mx-auto font-bold text-2xl">
            Signup
          </h2>
          <p className="text-sm text-center mb-4">
            Create a new account by filling the form below.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="firstName"
              className="input input-bordered w-full rounded-lg p-3 bg-gray-50 text-black"
              placeholder="Enter your first name"
              required
            />
            <input
              type="text"
              name="lastName"
              className="input input-bordered w-full rounded-lg p-3 bg-gray-50 text-black"
              placeholder="Enter your last name"
              required
            />
            <input
              type="email"
              name="email"
              className="input input-bordered w-full rounded-lg p-3 bg-gray-50 text-black"
              placeholder="Enter your email"
              required
            />
            <input
              type="password"
              name="password"
              className="input input-bordered w-full rounded-lg p-3 bg-gray-50 text-black"
              placeholder="Enter your password"
              required
            />
            <button
              type="submit"
              className="btn btn-primary w-full rounded-lg text-white font-semibold mt-4"
            >
              Submit
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400 mb-2">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="btn btn-secondary w-full rounded-lg text-white font-semibold"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
