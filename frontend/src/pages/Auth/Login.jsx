import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {useLoginMutation} from "../../redux/api/usersApiSlice.js";
import {setCredentials} from "../../redux/features/auth/authSlice.js";
import {toast} from "react-toastify";
import Loader from "../../components/Loader.jsx";
import {useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation} from "../../redux/api/cartApiSlice.js";
import {setCart} from "../../redux/features/cart/cartSlice.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, {isLoading}] = useLoginMutation();
  const {data: backendCart} = useGetCartQuery();
  const [addToCartApi] = useAddToCartMutation();
  const [updateCartApi] = useUpdateCartItemMutation();

  const {userInfo} = useSelector((state) => state.auth);
  const localCart = useSelector((state) => state.cart);

  const {search} = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const syncCart = async () => {
    if (!localCart || localCart.cartItems.length === 0) {
      // No local cart exists, just set the backend cart to Redux and return
      dispatch(setCart(backendCart));
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
    <div className="h-[100%]">
      <section className="h-[100%] lg:pl-[10vw] p-4 flex gap-6 flex-wrap">
        <div className="mt-[3rem]  lg:w-[40%] w-[100%] ">
          <h1 className="text-3xl font-semibold ">Sign In</h1>
          <form onSubmit={handleSubmit} className="container bg-white rounded-lg p-3 border-2 mt-4 w-[100%]">
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
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
          alt=""
          className=" w-[55%] h-[84vh] lg:block hidden md:hidden sm:hidden rounded-lg"
        />
      </section>
    </div>
  );
};

export default Login;
