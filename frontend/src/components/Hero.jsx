import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {IoIosArrowDropleftCircle, IoIosArrowDroprightCircle} from "react-icons/io";

const Hero = () => {
  const images = [
    "https://res.cloudinary.com/dzwqyiazp/image/upload/v1735642415/feature-images/xiqrqt9fycczcso1pnnd.webp",
    "https://res.cloudinary.com/dzwqyiazp/image/upload/v1735642354/feature-images/siehmy4jwabusmtm0um2.webp",
    "https://res.cloudinary.com/dzwqyiazp/image/upload/v1735642247/feature-images/lqihsca7cctlrvvvvwuc.png",
    "https://res.cloudinary.com/dzwqyiazp/image/upload/e_improve:outdoor/feature-images/vscmtkhmoart7qlu0ggq",
  ];

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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };
  return (
    <Slider {...settings} className="w-full lg:w-[90%] m-auto">
      {images.map((img, index) => (
        <img key={index} src={img} className="w-full  h-[14rem] sm:h-[20rem] md:h-[22rem] lg:h-[25rem]  rounded-lg" alt="hero image" />
      ))}
    </Slider>
  );
};

export default Hero;
