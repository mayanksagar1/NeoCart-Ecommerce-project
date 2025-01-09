import {useEffect} from "react";
import {Outlet} from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import {ToastContainer} from "react-toastify";
import "react-toastify/ReactToastify.css";
import Header from "./components/Header";
import {useDispatch} from "react-redux";
import {useGetCartQuery} from "./redux/api/cartApiSlice.js"; // Adjust path
import {setCart} from "./redux/features/cart/cartSlice.js"; // Adjust path

function App() {
  const dispatch = useDispatch();
  const {data: cartData, isSuccess} = useGetCartQuery();

  useEffect(() => {
    if (isSuccess && cartData) {
      dispatch(setCart(cartData));
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart"));
      if (localCart) {
        dispatch(setCart(localCart)); // Use localStorage as fallback
      }
    }
  }, [cartData, isSuccess, dispatch]);

  return (
    <>
      <ToastContainer />
      <Navigation />
      <Header />
      <main className="py-3 scrollbar-custom">
        <Outlet />
      </main>
    </>
  );
}

export default App;
