import {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import Loader from "../../components/Loader.jsx";
import BtnLoader from "../../components/BtnLoader.jsx";
import {useRegisterMutation} from "../../redux/api/usersApiSlice.js";
import {setCredentials} from "../../redux/features/auth/authSlice.js";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFormChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {userInfo} = useSelector((state) => state.auth);

  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const [register, {isLoading}] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPassword === formData.password) {
      try {
        const res = await register(formData).unwrap();
        dispatch(setCredentials({...res}));
        toast.success("User successfully registered");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    } else toast.error("Password do not match");
  };

  return (
    <section className="lg:pl-[8vw] h-full p-4 flex justify-between flex-wrap items-center">
      {/* Form Section */}
      <div className="lg:w-[43%] w-full lg:mt-0 bg-white shadow-xl h-fit rounded-xl p-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Create an Account</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.username}
              onChange={handleFormChange}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.password}
              onChange={handleFormChange}
              placeholder="Create a strong password"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-lg font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className={`block w-full py-3 text-lg font-semibold text-white rounded-lg transition-colors ${isLoading ? "bg-gray-400" : "bg-violet-600 hover:bg-violet-700"}`}>
            {isLoading ? <BtnLoader /> : "Register"}
          </button>
          {isLoading && <Loader />}
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Already have an account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-violet-600 font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:block lg:w-[55%] h-[84vh] rounded-lg overflow-hidden shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
          alt="Registration Background"
          className="object-cover w-full h-full"
        />
      </div>
    </section>
  );
};

export default Register;
