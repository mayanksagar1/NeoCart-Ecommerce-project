import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {useLoginMutation} from "../../redux/api/usersApiSlice.js";
import {setCredentials} from "../../redux/features/auth/authSlice.js";
import {toast} from "react-toastify";
import Loader from "../../components/Loader.jsx";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, {isLoading}] = useLoginMutation();

  const userInfo = useSelector((state) => state.auth);

  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      console.log("redirected by useEffect to", redirect);
      // navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({email, password}).unwrap();
      console.log(res);
      dispatch(setCredentials({...res}));
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="">
      <section className="pl-[10rem] flex flex-wrap">
        <div className="mt-[5rem] mx-auto">
          <h1 className="text-3xl font-semibold ">Sign In</h1>
          <form onSubmit={handleSubmit} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label htmlFor="email" className="block text-xl font-medium">
                Email
              </label>
              <input type="email" id="email" className="p-2 border rounded w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="my-[2rem]">
              <label htmlFor="password" className="block text-xl font-medium">
                Password
              </label>
              <input type="password" id="password" className="p-2 border rounded w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button disabled={isLoading} type="submit" className="bg-violet-600 text-md font-semibold text-white px-6 py-2 rounded cursor-pointer my-1 border-[2px] border-black ">
              {isLoading ? "Singing In...." : "Sing In"}
            </button>
            {isLoading && <Loader />}
          </form>
          <div className="mt-4">
            <p className="text-black">
              New Customer ? {""}
              <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="text-violet-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
