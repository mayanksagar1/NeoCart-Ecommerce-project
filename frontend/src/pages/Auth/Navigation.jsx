import {useState} from "react";
import {AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart} from "react-icons/ai";
import {FaHeart, FaUser} from "react-icons/fa";
import {Link} from "react-router";
import {useNavigate} from "react-router-dom";
import "./Navigation.css";
import {useSelector, useDispatch} from "react-redux";
import {useLogoutMutation} from "../../redux/api/usersApiSlice";
import {logOut} from "../../redux/features/auth/authSlice";
import appLogo from "../../assets/logo.svg";
import appLogoSmall from "../../assets/logoSmall.svg";

const Navigation = () => {
  const {userInfo} = useSelector((state) => state.auth);

  const [isHovered, setIsHovered] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const toggleShowSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDropDownOpen = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const closeShowSidebar = () => {
    setShowSidebar(false);
  };

  const closeDropDownOpen = () => {
    setDropDownOpen(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginApiCall] = useLogoutMutation();

  return (
    <div
      style={{zIndex: 9999}}
      className={`${showSidebar ? "hidden" : "flex"} text-white xl:flex lg:flex md:hidden sm:hidden bg-[#000] w-[5%] hover:w-[15%] h-[100vh] flex-col items-center justify-between  fixed py-4 `}
      id="navigation-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="w-[100%]">
        <Link to="/">{!isHovered ? <img src={appLogoSmall} className="w-[100%] p-3" alt="" /> : <img src={appLogo} width={"100%"} className="transform  p-5" alt="" />}</Link>
      </div>
      <div className="flex flex-col p-3">
        <Link to="/" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2">
          <AiOutlineHome size={26} className=" mt-[2rem]" />
          <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Home</span>
        </Link>
        <Link to="/shop" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2">
          <AiOutlineShopping size={26} className=" mt-[2rem]" />
          <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Shop</span>
        </Link>
        <Link to="/cart" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2">
          <AiOutlineShoppingCart size={26} className=" mt-[2rem]" />
          <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Cart</span>
        </Link>
        <Link to="/favorite" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2">
          <FaHeart size={26} className=" mt-[2rem]" />
          <span className="hidden nav-item-name pl-[1rem]  mt-[2rem]">Favorite</span>
        </Link>
      </div>

      <div className="p-3 relative">
        {userInfo && (
          <button onClick={() => toggleDropDownOpen()} className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2">
            <FaUser size={26} className=" mt-[2rem]" />
            <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">{userInfo.username}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`hidden nav-item-name h-4 w-4 ml-1 mt-[2rem] ${dropDownOpen ? "transform rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={dropDownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
        )}
        {!userInfo && (
          <ul>
            <li>
              <Link to="/login" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2">
                <AiOutlineLogin size={26} className=" mt-[2rem]" />
                <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Login</span>
              </Link>
            </li>
            <li>
              <Link to="/login" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-1">
                <AiOutlineUserAdd size={26} className=" mt-[2rem]" />
                <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Register</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;
