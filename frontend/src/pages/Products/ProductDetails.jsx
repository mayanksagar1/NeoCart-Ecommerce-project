import {useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {useGetProductByIdQuery, useAddProductReviewMutation} from "../../redux/api/productsApiSlice.js";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {FaBox, FaClock, FaShoppingCart, FaStar, FaStore, FaCartPlus} from "react-icons/fa";
import {IoIosArrowDropleftCircle, IoIosArrowDroprightCircle} from "react-icons/io";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import SimilarProducts from "./SimilarProducts.jsx";
import {addToCart} from "../../redux/features/cart/cartSlice.js";
import {useAddToCartMutation} from "../../redux/api/cartApiSlice.js";

const ProductDetails = () => {
  const {id: productId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {data: product, isLoading, error, refetch} = useGetProductByIdQuery(productId);
  const [useAddToCart, {isSuccess}] = useAddToCartMutation();

  const {userInfo} = useSelector((state) => state.auth);

  const [createReview, {isLoading: loadingProductReview}] = useAddProductReviewMutation();

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

  // React Slick settings
  const settings = {
    customPaging: function (i) {
      return <img src={product?.images[i]} alt={`Preview ${i + 1}`} className="w-12 h-12 object-cover rounded-lg border" />;
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb ",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768, // Below medium screens
        settings: {
          dots: true,
          customPaging: (i) => <div className="w-3 h-3 bg-gray-400 rounded-full"></div>,
        },
      },
    ],
  };

  const submitHandler = () => {
    console.log("submitHandler triggered");
  };

  const handleAddToCart = async () => {
    try {
      const res = await useAddToCart({productId, quantity: qty, price: product.price}).unwrap();
      dispatch(addToCart({product, quantity: qty, price: product.price}));
      toast.success("Product added to cart");
    } catch (error) {
      console.log("error adding to cart", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant={"error"}>{error?.data?.message || error.message}</Message>;
  }

  return (
    <section className="w-full md:w-[90vw] lg:w-[85vw] m-auto p-2">
      <div>
        <button onClick={(e) => navigate(-1)} className="font-semibold hover:underline px-2 py-1 bg-slate-300 rounded-lg">
          Go Back
        </button>
      </div>
      <div className="mt-5  grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-10 bg-white rounded-lg p-3">
        {/* Product Image Section */}
        <div className="relative">
          <Slider {...settings}>
            {product?.images.map((img, index) => (
              <div key={index}>
                <img src={img} alt={`Product ${index + 1}`} className="w-full h-[15rem] md:h-[25rem] object-cover rounded-lg" />
              </div>
            ))}
          </Slider>
          <HeartIcon product={product} />

          {/* Add to cart button */}
          <div className="mt-20 hidden lg:flex items-center justify-around ">
            <div className="btn-container flex justify-center lg:justify-start">
              <button
                disabled={product.countInStock === 0}
                onClick={handleAddToCart}
                className="flex items-center  gap-2 bg-pink-500 hover:bg-pink-600 hover:font-medium text-white py-2 px-4 rounded-lg  ">
                <FaCartPlus size={20} />
                Add To Cart
              </button>
            </div>
            {product.countInStock > 0 && (
              <div className="flex items-center justify-center gap-2">
                <label className="w-fit">Select quantity:</label>
                <select value={qty} onChange={(e) => setQty(e.target.value)} className="p-2 bg-slate-200 w-[4rem] rounded-lg text-black">
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-col justify-between h-full lg:overflow-y-auto scrollbar-custom">
          {/* Product Name */}
          <h1 className="text-3xl font-extrabold tracking-wide text-gray-900 mb-4 border-b-4 border-gray-200 pb-2">{product.name}</h1>

          {/* Product Price */}
          <p className="text-2xl font-black  my-6 shadow-md rounded-md px-3 py-2  border  text-teal-600 bg-teal-50 border-teal-200 w-fit inline-block">$ {product.price}</p>

          {/* Product INFO */}
          <div className="flex justify-around gap-2 ">
            <div className="one p-2">
              <div className="flex items-center mb-6">
                <FaStore className="mr-2 text-black" />
                <span className=" md:text-lg font-medium">Brand: {product.brand}</span>
              </div>
              <div className="flex items-center mb-6">
                <FaClock className="mr-2 text-black" />
                <span className="md:text-lg font-medium">Added: {moment(product.createdAt).fromNow()}</span>
              </div>
              <div className="flex items-center mb-6">
                <FaStar className="mr-2 text-black" />
                <span className="md:text-lg font-medium">Reviews: {product.numReviews}</span>
              </div>
            </div>

            <div className="two p-2">
              <div className="flex items-center mb-6">
                <FaStar className="mr-2 text-black" />
                <span className="md:text-lg font-medium">Ratings: {Math.round(product.ratings)}</span>
              </div>
              <div className="flex items-center mb-6">
                <FaShoppingCart className="mr-2 text-black" />
                <span className="md:text-lg font-medium">Quantity: {product.quantity}</span>
              </div>
              <div className="flex items-center mb-6">
                <FaBox className="mr-2 text-black" />
                <span className="md:text-lg font-medium">Stock: {product.countInStock}</span>
              </div>
            </div>
          </div>

          {/* Product Ratings  */}
          <Ratings value={product.ratings} text={`${product.numReviews} reviews`} />

          <div className={`flex items-center justify-around my-4 lg:hidden ${window.innerWidth < 350 && "flex-col-reverse gap-3"} `}>
            {/* Add to cart button */}
            <div className={`btn-container flex justify-center lg:justify-start`}>
              <button
                disabled={product.countInStock === 0}
                onClick={handleAddToCart}
                className="flex items-center  gap-2 bg-pink-500 hover:bg-pink-600 hover:font-medium text-white py-2 px-4 rounded-lg  ">
                <FaCartPlus size={20} />
                Add To Cart
              </button>
            </div>
            {product.countInStock > 0 && (
              <div className={`flex items-center justify-center  gap-2`}>
                <label className="w-fit">Select quantity:</label>
                <select value={qty} onChange={(e) => setQty(e.target.value)} className="p-2 bg-slate-200 w-[4rem] rounded-lg text-black">
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Product Description */}
          <p className="text-sm md:text-base my-4 w-full text-gray-500">{product.description}</p>
        </div>
      </div>
      <div>
        <ProductTabs
          loadingProductReview={loadingProductReview}
          userInfo={userInfo}
          submitHandler={submitHandler}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          product={product}
        />
      </div>
      <SimilarProducts category={product.category} productId={product._id} />
    </section>
  );
};

export default ProductDetails;
