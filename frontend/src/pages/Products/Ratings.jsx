import {FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";

const Ratings = ({value, text, color = "yellow-500"}) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars > 0.5 ? 1 : 0;
  const emptyStar = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center justify-center lg:justify-start gap-2">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} size={20} className={`text-${color} `} />
      ))}

      {halfStars === 1 && <FaStarHalfAlt size={20} className={`text-${color} `} />}
      {[...Array(emptyStar)].map((_, index) => (
        <FaRegStar key={index} size={20} className={`text-${color} `} />
      ))}

      <span className={`rating-text  text-${color}`}>{text && text}</span>
    </div>
  );
};

export default Ratings;
