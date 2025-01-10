import {Link} from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="flex flex-col w-fit m-auto items-center justify-center h-[80vh] bg-gray-300 p-6 rounded-lg shadow-md">
      {/* Illustration */}
      <img src={"https://res.cloudinary.com/dzwqyiazp/image/upload/v1736525079/icons/g7mubdk44givx7irbwjc.png"} alt="empty cart" className="w-[200px] h-[200px] mb-6" />

      {/* Text */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
      <p className="text-gray-600 text-center mb-6">Looks like you haven’t added anything to your cart yet. Start exploring amazing products now!</p>

      {/* Button */}
      <Link to="/shop" className="bg-pink-500 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-pink-600 transition">
        Go to Shop
      </Link>
    </div>
  );
};

export default EmptyCart;
