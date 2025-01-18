import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {useLoginMutation} from "../../redux/api/usersApiSlice.js";
import {setCredentials} from "../../redux/features/auth/authSlice.js";
import {toast} from "react-toastify";
import Loader from "../../components/Loader.jsx";
import BtnLoader from "../../components/BtnLoader.jsx";
import {useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation} from "../../redux/api/cartApiSlice.js";
import {setCart} from "../../redux/features/cart/cartSlice.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [backendCart, setBackendCart] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, {isLoading}] = useLoginMutation();
  const {data: backendCart, refetch} = useGetCartQuery();
  const [addToCartApi] = useAddToCartMutation();
  const [updateCartApi] = useUpdateCartItemMutation();

  const {userInfo} = useSelector((state) => state.auth);
  const localCart = useSelector((state) => state.cart);

  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      refetch();
    }
  }, [userInfo]);

  const syncCart = async () => {
    if (!localCart || localCart.cartItems.length === 0) {
      // No local cart exists, just set the backend cart to Redux and return
      if (backendCart?.cartItems) {
        dispatch(setCart(backendCart));
      }
      return;
    }

    const mergedCartItems = [...backendCart.cartItems];
    const itemsToAddToBackend = [];
    const itemsToUpdateInBackend = [];

    localCart.cartItems.forEach((localItem) => {
      const existingItem = mergedCartItems.find((backendItem) => backendItem.product === localItem.product);

      if (existingItem) {
        // Update quantity if the product already exists in the backend cart
        existingItem.quantity += localItem.quantity;

        // Add to update list if quantity is changed
        itemsToUpdateInBackend.push({
          product: existingItem.product,
          quantity: existingItem.quantity,
        });
      } else {
        // Add new items to backend cart
        mergedCartItems.push(localItem);

        // Add to the backend's "add to cart" API
        itemsToAddToBackend.push(localItem);
      }
    });

    // Calculate total price of merged cart
    const totalPrice = mergedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Dispatch merged cart to Redux store
    dispatch(
      setCart({
        cartItems: mergedCartItems,
        totalPrice,
      }),
    );

    // Call the APIs to synchronize with the backend
    try {
      // Add new items to the backend
      if (itemsToAddToBackend.length > 0) {
        await Promise.all(itemsToAddToBackend.map((item) => addToCartApi({productId: item.product._id, quantity: item.quantity, price: item.price})));
      }

      // Update existing items in the backend
      if (itemsToUpdateInBackend.length > 0) {
        await Promise.all(itemsToUpdateInBackend.map((item) => updateCartApi({itemId: item._id, quantity: item.quantity})));
      }
    } catch (error) {
      console.error("Failed to synchronize cart with backend:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({email, password}).unwrap();
      dispatch(setCredentials({...res}));
      await syncCart();
      toast.success("User successfully logged in");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <>
      <section className="h-full lg:ml-[8vw] p-4 flex justify-between items-center flex-wrap">
        {/* Form Section */}
        <div className="lg:w-[43%] w-full bg-white h-fit rounded-xl shadow-xl p-6">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className={`w-full py-3 text-lg font-semibold text-white rounded-lg transition-colors ${isLoading ? "bg-gray-400" : "bg-violet-600 hover:bg-violet-700"} shadow-lg`}>
              {isLoading ? <BtnLoader /> : "Sign In"}
            </button>
            {isLoading && <Loader />}
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-700">
              New Customer?{" "}
              <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="text-violet-600 font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden lg:block lg:w-[55%] h-[84vh] rounded-lg overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt="Sign In Background"
            className="object-cover w-full h-full"
          />
        </div>
      </section>
    </>
  );
};

export default Login;
