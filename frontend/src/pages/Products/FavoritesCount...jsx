import {useSelector} from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="absolute left-3 top-6">
      {favoriteCount > 0 && <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-pink-500 rounded-full">{favoriteCount}</span>}
    </div>
  );
};

export default FavoritesCount;
