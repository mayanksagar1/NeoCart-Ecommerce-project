import {useSelector} from "react-redux";

const CartCount = ({className}) => {
  const cart = useSelector((state) => state.cart);
  const cartCount = cart.cartItems.reduce((total, item) => total + Number(item.quantity), 0);

  return (
    <div className={`absolute ${className}`}>
      {cartCount > 0 && <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-pink-500 rounded-full">{cartCount}</span>}
    </div>
  );
};

export default CartCount;
