import {useState} from "react";
import {AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart} from "react-icons/ai";
import {FaHeart, FaUser, FaBars, FaTimes} from "react-icons/fa";
import {IoIosArrowDown} from "react-icons/io";
import {Link} from "react-router";
import {useNavigate} from "react-router-dom";
import "./Navigation.css";
import {useSelector, useDispatch} from "react-redux";
import {useLogoutMutation} from "../../redux/api/usersApiSlice";
import {logOut} from "../../redux/features/auth/authSlice";
import appLogo from "../../assets/logo.svg";
import appLogoSmall from "../../assets/logoSmall.svg";
import {toast} from "react-toastify";
import FavoritesCount from "../Products/FavoritesCount..";
import CartCount from "../../components/CartCount";
import {clearCart} from "../../redux/features/cart/cartSlice.js";

const Navigation = () => {
  const {userInfo} = useSelector((state) => state.auth);

  const [isHovered, setIsHovered] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDropDownOpen = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logOutApiCall] = useLogoutMutation();

  const logOutHandler = async () => {
    try {
      let res = await logOutApiCall().unwrap();
      dispatch(logOut());
      dispatch(clearCart());
      toast.success(res.message);
      navigate("/login");
      closeSidebar();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!showSidebar ? (
        <div className="block xl:hidden lg:hidden  fixed top-6 left-4 z-50">
          <button onClick={toggleSidebar}>
            <FaBars size={26} />
          </button>
        </div>
      ) : (
        <div className="block text-white xl:hidden lg:hidden  fixed top-4 right-4 z-50">
          <button onClick={toggleSidebar}>
            <FaTimes size={26} />
          </button>
        </div>
      )}

      <div
        style={{zIndex: 9999}}
        className={` text-white bg-[#000] h-[100vh] flex flex-col items-center justify-between fixed z-40 transition-transform transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } xl:translate-x-0 lg:translate-x-0 w-[80%] sm:w-[60%] md:w-[40%] lg:w-[5%] xl:w-[5%] lg:hover:w-[15%] `}
        id="navigation-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div className="w-[100%]">
          <Link onClick={closeSidebar} to="/">
            {!isHovered && !showSidebar ? <img src={appLogoSmall} className="w-[100%] p-2" alt="" /> : <img src={appLogo} width={"100%"} className="w-[100%]  p-5" alt="" />}
          </Link>
        </div>
        <div className="flex flex-col p-3">
          <Link to="/" onClick={closeSidebar} className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
            <AiOutlineHome size={26} className="" />
            <span className={`${showSidebar && "block"} hidden nav-item-name pl-[1rem] `}>Home</span>
          </Link>
          <Link to="/shop" onClick={closeSidebar} className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
            <AiOutlineShopping size={26} className=" mt-[2rem]" />
            <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Shop</span>
          </Link>
          <Link to="/cart" onClick={closeSidebar} className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
            <AiOutlineShoppingCart size={26} className=" mt-[2rem]" />
            <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Cart</span>
            <CartCount className={"top-5 left-3"} />
          </Link>
          <Link to="/favorites" onClick={closeSidebar} className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
            <FaHeart size={26} className=" mt-[2rem]" />
            <span className="hidden nav-item-name pl-[1rem]  mt-[2rem]">Favorites</span>
            <FavoritesCount />
          </Link>
        </div>

        <div className="p-3 mb-3 relative">
          {userInfo && (
            <button onClick={() => toggleDropDownOpen()} className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
              <FaUser size={26} className=" mt-[2rem]" />
              <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">{userInfo.username}</span>
              <IoIosArrowDown className={`hidden  nav-item-name h-4 w-4 ml-2 mt-[2rem] transition-all transform ${dropDownOpen ? "transform rotate-180" : ""}`} />
            </button>
          )}

          {dropDownOpen && userInfo && (
            <ul className={`absolute transition-all bg-slate-950 rounded-lg hidden nav-item-name mt-2 p-2 space-y-2  ${userInfo.role !== "admin" ? "-top-20" : "-top-40"} `}>
              {userInfo.role === "admin" && (
                <li>
                  <Link
                    onClick={closeSidebar}
                    to="/admin/dashboard"
                    className="block px-2 mx-2 text-sm py-2 hover:bg-[#7c3aed] rounded hover:text-black hover:text-md hover:font-bold hover:translate-x-2">
                    Admin Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link
                  onClick={closeSidebar}
                  to="/account/profile"
                  className="block text-sm px-2 mx-2 py-2 hover:bg-[#7c3aed] rounded hover:text-black hover:text-md hover:font-bold hover:translate-x-2">
                  Account
                </Link>
              </li>
              <li>
                <button
                  onClick={logOutHandler}
                  className="block text-sm w-[90%] px-2 mx-2 py-2 text-left hover:bg-[#7c3aed] rounded hover:text-black hover:text-md hover:font-bold hover:translate-x-1">
                  Logout
                </button>
              </li>
            </ul>
          )}

          {!userInfo && (
            <ul>
              <li>
                <Link to="/login" onClick={closeSidebar} className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
                  <AiOutlineLogin size={26} className=" mt-[2rem]" />
                  <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Login</span>
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeSidebar} className="flex items-center transition-transform transform hover:font-bold hover:translate-x-1 hover:text-[#7c3aed]">
                  <AiOutlineUserAdd size={26} className=" mt-[2rem]" />
                  <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Register</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      {showSidebar && <div className="fixed inset-0 bg-black opacity-60 z-[45]" onClick={closeSidebar}></div>}
    </>
  );
};

export default Navigation;
