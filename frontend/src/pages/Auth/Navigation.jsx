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
import {toast} from "react-toastify";

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

  const [logOutApiCall] = useLogoutMutation();

  const logOutHandler = async () => {
    try {
      let res = await logOutApiCall().unwrap();
      dispatch(logOut());
      toast.success(res.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{zIndex: 9999}}
      className={`hidden text-white xl:flex lg:flex md:flex sm:hidden bg-[#000] w-[5%] hover:w-[15%] h-[100vh] flex-col items-center justify-between  fixed py-4 `}
      id="navigation-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="w-[100%]">
        <Link to="/">{!isHovered ? <img src={appLogoSmall} className="w-[100%] p-2" alt="" /> : <img src={appLogo} width={"100%"} className="w-[100%]  p-5" alt="" />}</Link>
      </div>
      <div className="flex flex-col p-3">
        <Link to="/" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
          <AiOutlineHome size={26} className=" mt-[2rem]" />
          <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Home</span>
        </Link>
        <Link to="/shop" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
          <AiOutlineShopping size={26} className=" mt-[2rem]" />
          <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Shop</span>
        </Link>
        <Link to="/cart" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
          <AiOutlineShoppingCart size={26} className=" mt-[2rem]" />
          <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Cart</span>
        </Link>
        <Link to="/favorite" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
          <FaHeart size={26} className=" mt-[2rem]" />
          <span className="hidden nav-item-name pl-[1rem]  mt-[2rem]">Favorite</span>
        </Link>
      </div>

      <div className="p-3 relative">
        {userInfo && (
          <button onClick={() => toggleDropDownOpen()} className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
            <FaUser size={26} className=" mt-[2rem]" />
            <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">{userInfo.username}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`hidden nav-item-name h-4 w-4 ml-2 mt-[2rem] transform ${dropDownOpen ? "transform rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        {dropDownOpen && userInfo && (
          <ul className={`absolute hidden nav-item-name mt-2 p-2 space-y-2  ${userInfo.role !== "admin" ? "-top-20" : "-top-40"} `}>
            {userInfo.role === "admin" && (
              <li>
                <Link to="/admin/dashboard" className="block px-2 mx-2 text-sm py-2 hover:bg-[#7c3aed] rounded hover:text-black hover:text-md hover:font-bold hover:translate-x-2">
                  Admin Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link to="/account" className="block text-sm px-2 mx-2 py-2 hover:bg-[#7c3aed] rounded hover:text-black hover:text-md hover:font-bold hover:translate-x-2">
                Account
              </Link>
            </li>
            <li>
              <button onClick={logOutHandler} className="block text-sm w-full px-2 mx-2 py-2 text-left hover:bg-[#7c3aed] rounded hover:text-black hover:text-md hover:font-bold hover:translate-x-2">
                Logout
              </button>
            </li>
          </ul>
        )}

        {!userInfo && (
          <ul>
            <li>
              <Link to="/login" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
                <AiOutlineLogin size={26} className=" mt-[2rem]" />
                <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Login</span>
              </Link>
            </li>
            <li>
              <Link to="/register" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-1 hover:text-[#7c3aed]">
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
