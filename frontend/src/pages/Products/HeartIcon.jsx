import {useEffect} from "react";
import {FaHeart, FaRegHeart} from "react-icons/fa";
import {useSelector, useDispatch} from "react-redux";
import {getFavoritesFromLocalStorage, addFavoriteToLocalStorage, removeFavoriteFromLocalStorage} from "../../utils/favorites.js";
import {addToFavorites, setFavorites, removeFromFavorites} from "../../redux/features/favorite/favoriteSlice.js";

const HeartIcon = ({product}) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, []);

  const handleToggleFavorite = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      // remove the product from the localStorage as well
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      // add the product to localStorage as well
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div className="absolute z-[5] top-2 right-4 p-1 cursor-pointer" onClick={handleToggleFavorite}>
      {isFavorite ? <FaHeart size={22} className="text-pink-500" /> : <FaRegHeart size={22} className="text-white" />}
    </div>
  );
};

export default HeartIcon;
