import {useState} from "react";
import {AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart} from "react-icons/ai";
import {FaHeart} from "react-icons/fa";
import {Link} from "react-router";
import {useNavigate} from "react-router-dom";
import "./Navigation.css";
import {useSelector, useDispatch} from "react-redux";
import {useLoginMutation} from "../../redux/api/usersApiSlice";
import {logOut} from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const userInfo = useSelector((state) => state.auth);

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

  const [loginApiCall] = useLoginMutation();

  return (
    <div
      style={{zIndex: 9999}}
      className={`${showSidebar ? "hidden" : "flex"} text-white xl:flex lg:flex md:hidden sm:hidden bg-[#000] w-[5%] hover:w-[15%] h-[100vh] flex-col items-center justify-between  fixed py-4 `}
      id="navigation-container">
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
      <ul className="p-3">
        <li>
          <Link to="/login" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2">
            <AiOutlineLogin size={26} className=" mt-[2rem]" />
            <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Login</span>
          </Link>
        </li>
        <li>
          <Link to="/login" className="flex items-center transition-transform transform hover:font-bold hover:translate-x-2">
            <AiOutlineUserAdd size={26} className=" mt-[2rem]" />
            <span className="hidden nav-item-name pl-[1rem] mt-[2rem]">Register</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
