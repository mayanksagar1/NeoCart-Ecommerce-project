import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {FaTrash} from "react-icons/fa";
import {updateCartItem, removeCartItem, clearCart} from "../redux/features/cart/cartSlice.js";
import {useUpdateCartItemMutation, useRemoveCartItemMutation, useClearCartMutation} from "../redux/api/cartApiSlice.js";
import EmptyCart from "../components/EmptyCart.jsx";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const {userInfo} = useSelector((state) => state.auth);
  const {cartItems} = cart;

  const [removeCartItemApi] = useRemoveCartItemMutation();
  const [updateCartItemApi] = useUpdateCartItemMutation();
  const [clearCartApi] = useClearCartMutation();

  const updateCartItemHandler = async (item, qty) => {
    if (userInfo) {
      await updateCartItemApi({itemId: item._id, quantity: qty});
    }
    dispatch(updateCartItem({product: item.product, quantity: qty}));
  };

  const removeFromCartHandler = async (itemId, product) => {
    if (userInfo) {
      await removeCartItemApi(itemId);
    }
    dispatch(removeCartItem(product));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/checkout");
  };

  const clearCartHandler = async () => {
    if (userInfo) {
      await clearCartApi();
    }
    dispatch(clearCart());
  };

  return (
    <div className="w-full md:w-[85%] mx-auto px-4 py-8">
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* Cart Items Section */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
              {cartItems.map((item) => (
                <div key={item._id || item.product._id} className="flex items-center justify-between  gap-2 w-full bg-white p-4 rounded-lg shadow-md mb-4">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded-md" />
                    </div>

                    {/* Product Details */}
                    <div className=" flex flex-col gap-2">
                      <Link to={`/product/${item.product._id}`} className="text-lg font-semibold text-pink-500 hover:underline">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                      <p className="text-sm font-bold text-gray-800">$ {item.product.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-4">
                    {/* Quantity Selector */}
                    <div>
                      <select className="w-full p-2 border rounded-md  text-gray-800" value={item.quantity} onChange={(e) => updateCartItemHandler(item, Number(e.target.value))}>
                        {[...Array(item.product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Remove Button */}
                    <div>
                      <button className="text-red-500 hover:text-red-600 transition" onClick={() => removeFromCartHandler(item._id, item.product._id)}>
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Cart Summary</h2>
              <p className="text-lg text-gray-700">
                Total Items: <span className="font-bold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Total Price: <span className="font-bold">$ {cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0).toFixed(2)}</span>
              </p>

              <button className="bg-pink-500 text-white py-2 px-4 w-full rounded-full text-lg hover:bg-pink-600 transition" disabled={cartItems.length === 0} onClick={checkoutHandler}>
                Proceed to Checkout
              </button>

              <button className="mt-4 bg-red-500 text-white py-2 px-4 w-full rounded-full text-lg hover:bg-red-600 transition" onClick={clearCartHandler}>
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
