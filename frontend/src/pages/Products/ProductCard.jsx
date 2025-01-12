import {Link, useNavigate} from "react-router-dom";
import {FaCartPlus, FaShoppingCart} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from "../../redux/features/cart/cartSlice.js";
import {useAddToCartMutation} from "../../redux/api/cartApiSlice.js";
import {toast} from "react-toastify";
import HeartIcon from "./HeartIcon";
import {useState, useEffect} from "react";

const ProductCard = ({p}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [useAddToCart] = useAddToCartMutation();
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const {userInfo} = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const exists = cart.cartItems.find((item) => item.product._id.toString() === p._id);
    if (exists) {
      setAlreadyInCart(true);
    }
  }, [cart]);

  const handleAddToCart = async () => {
    try {
      if (userInfo) {
        await useAddToCart({productId: p._id, quantity: 1, price: p.price}).unwrap();
      }
      dispatch(addToCart({product: p, quantity: 1, price: p.price}));
      setAlreadyInCart(true);
      toast.success("Product added to cart");
    } catch (error) {
      console.log("Error adding to cart", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 max-w-[300px] mx-auto">
      <div className="relative rounded-t-lg overflow-hidden">
        <Link to={`/product/${p._id}`}>
          <img src={p.images[0]} alt={p.name} className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105" />
          <span className="absolute top-3 left-3 bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded-full">{p?.brand}</span>
        </Link>
        <HeartIcon product={p} />
      </div>

      <div className="p-4 flex flex-col">
        <h5 className="text-lg font-semibold text-gray-800 truncate mb-1">{p?.name}</h5>
        <p className="text-gray-600 text-sm mb-2">{p?.description?.substring(0, 60)}...</p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-pink-600 font-bold text-lg">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
          {p.countInStock > 0 ? <span className="text-green-500 text-sm font-medium">In Stock</span> : <span className="text-red-500 text-sm font-medium">Out of Stock</span>}
        </div>

        <div className="flex justify-between items-center mt-auto">
          <Link to={`/product/${p._id}`} className="text-violet-900 bg-violet-200 hover:bg-violet-300 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300">
            View Details
          </Link>

          {alreadyInCart ? (
            <button onClick={() => navigate("/cart")} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium">
              <FaShoppingCart size={16} />
              Go to Cart
            </button>
          ) : (
            <button
              disabled={p.countInStock === 0}
              onClick={handleAddToCart}
              className={`flex items-center gap-2 ${
                p.countInStock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
              } text-white py-2 px-4 rounded-md text-sm font-medium transition-all duration-300`}>
              <FaCartPlus size={16} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
