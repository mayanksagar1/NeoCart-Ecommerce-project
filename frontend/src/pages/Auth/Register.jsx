import {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import Loader from "../../components/Loader.jsx";
import {useRegisterMutation} from "../../redux/api/usersApiSlice.js";
import {setCredentials} from "../../redux/features/auth/authSlice.js";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
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

  const [register, {isLoading, isError}] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData).unwrap();
      console.log(res);
      dispatch(setCredentials({...res}));
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <section className="md:pl-[18vw] h-[100%] p-4 flex gap-6 flex-wrap">
      <div className="mt-[5rem] lg:w-[40%] w-[100%] ">
        <h1 className="text-3xl font-semibold">Register</h1>
        <form className="container w-[100%]" onSubmit={handleSubmit}>
          <div className="my-[2rem]">
            <label htmlFor="username" className="block text-xl font-medium">
              Username
            </label>
            <input type="text" id="username" name="username" className="p-2 border rounded w-full" value={formData.username} onChange={handleFormChange} />
          </div>
          <div className="my-[2rem]">
            <label htmlFor="email" className="block text-xl font-medium">
              Email
            </label>
            <input type="email" id="email" name="email" className="p-2 border rounded w-full" value={formData.email} onChange={handleFormChange} />
          </div>
          <div className="my-[2rem]">
            <label htmlFor="password" className="block text-xl font-medium">
              Password{" "}
            </label>
            <input type="password" id="password" name="password" className="p-2 border rounded w-full" value={formData.password} onChange={handleFormChange} />
          </div>
          <button disabled={isLoading} type="submit" className="bg-violet-600 text-md font-semibold text-white px-6 py-2 rounded cursor-pointer my-1 border-[2px] border-black ">
            {isLoading ? "Registering...." : "Register"}
          </button>
          {isLoading && <Loader />}
        </form>
        <div className="mt-4">
          <p className="text-black">
            Already have an account ? {""}
            <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="text-violet-500 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        alt=""
        className="h-[90%] my-[2rem] w-[55%] xl: lg:block hidden md:hidden sm:hidden rounded-lg"
      />
    </section>
  );
};

export default Register;
