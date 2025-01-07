import {useGetTopProductsQuery} from "../../redux/api/productsApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {FaBox, FaClock, FaShoppingCart, FaStar, FaStore} from "react-icons/fa";
import {IoIosArrowDropleftCircle, IoIosArrowDroprightCircle} from "react-icons/io";
import {Link} from "react-router-dom";
import HeartIcon from "./HeartIcon";

const ProductCarousel = () => {
  const {data: products, isLoading, error} = useGetTopProductsQuery();

  // Custom Previous Arrow Component
  const PrevArrow = ({className, onClick}) => {
    return (
      <IoIosArrowDropleftCircle onClick={onClick} className={` text-4xl text-gray-700 hover:text-gray-900 absolute top-1/2 transform -translate-y-1/2 left-0 md:left-[-20px] z-10 cursor-pointer`} />
    );
  };
  // Custom Next Arrow Component
  const NextArrow = ({className, onClick}) => {
    return (
      <IoIosArrowDroprightCircle onClick={onClick} className={` text-4xl text-gray-700 hover:text-gray-900 absolute top-1/2 transform -translate-y-1/2 right-0 md:right-[-20px] z-10 cursor-pointer`} />
    );
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="w-full h-full ">
      {isLoading ? null : error ? (
        <Message variant="error">{error?.data?.message || error.error}</Message>
      ) : (
        <Slider {...settings} className="w-full h-full bg-white p-3 shadow-md  rounded-lg">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`}>
              <div className="w-full">
                <div className="relative">
                  <img src={product.images[0]} alt={product.name} className="w-full rounded-lg object-cover h-[15rem] md:h-[25rem]" />
                  <HeartIcon product={product} />
                </div>

                <div className="mt-4 flex flex-col md:flex-row gap-2 justify-between">
                  <div className="one w-full md:w-1/2">
                    <h2 className="font-bold text-lg">{product.name}</h2>
                    <p className=" font-medium mr-2 w-fit mt-2 px-2.5 py-1 rounded-full bg-violet-200 text-violet-500"> ${product.price}</p>
                    <p className="w-full md:mt-8 my-4 text-sm text-gray-500 ">{product.description.substring(0, 170)} ...</p>
                  </div>

                  <div className="flex justify-between gap-2 ">
                    <div className="one p-2">
                      <div className="flex items-center mb-6">
                        <FaStore className="mr-2 text-black" />
                        <span className="text-sm font-medium">Brand: {product.brand}</span>
                      </div>
                      <div className="flex items-center mb-6">
                        <FaClock className="mr-2 text-black" />
                        <span className="text-sm font-medium">Added: {moment(product.createdAt).fromNow()}</span>
                      </div>
                      <div className="flex items-center mb-6">
                        <FaStar className="mr-2 text-black" />
                        <span className="text-sm font-medium">Reviews: {product.numReviews}</span>
                      </div>
                    </div>

                    <div className="two p-2">
                      <div className="flex items-center mb-6">
                        <FaStar className="mr-2 text-black" />
                        <span className="text-sm font-medium">Ratings: {Math.round(product.ratings)}</span>
                      </div>
                      <div className="flex items-center mb-6">
                        <FaShoppingCart className="mr-2 text-black" />
                        <span className="text-sm font-medium">Quantity: {product.quantity}</span>
                      </div>
                      <div className="flex items-center mb-6">
                        <FaBox className="mr-2 text-black" />
                        <span className="text-sm font-medium">Stock: {product.countInStock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
