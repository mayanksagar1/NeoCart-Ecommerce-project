import {useSelector} from "react-redux";
import {selectFavoriteProduct} from "../../redux/features/favorite/favoriteSlice";
import SmallProduct from "./SmallProduct";
import {FaHeartBroken} from "react-icons/fa";
import {Link} from "react-router-dom";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <section className="w-full md:w-[85vw] m-auto">
      <h1 className="text-2xl  mt-10 mb-4 text-center md:text-left font-bold">Favorite Products</h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-3 mt-[2rem] p-3">
          {favorites.map((product) => (
            <SmallProduct key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <FaHeartBroken className="text-gray-400 text-6xl mb-4" />
          <h2 className="text-xl font-medium text-gray-500 mb-2">You haven’t added any favorite products yet!</h2>
          <p className="text-gray-400 mb-6">Start exploring and add some products to your favorites list.</p>
          <Link to="/shop" className="bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-600 transition duration-300">
            Browse Products
          </Link>
        </div>
      )}
    </section>
  );
};

export default Favorites;
