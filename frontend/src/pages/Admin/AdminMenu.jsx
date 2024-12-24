import {useState} from "react";
import {NavLink} from "react-router-dom";
import {FaTimes} from "react-icons/fa";
import {CgMenuGridR} from "react-icons/cg";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button className={`${isMenuOpen ? "top-0 right-7" : "top-0 right-7"} z-10 bg-[#151515] p-2 absolute rounded-lg`} onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes color="white" /> : <CgMenuGridR size={20} color="white" />}
      </button>

      {isMenuOpen && (
        <section className="bg-[#151515] rounded-md p-4 absolute right-10 top-5">
          <ul className="list-none ">
            <li>
              <NavLink
                className=" py-2 px-3 block  hover:translate-x-2 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/dashboard"
                style={({isActive}) => ({
                  color: isActive ? "greenyellow" : "white",
                })}>
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className=" py-2 px-3  block hover:translate-x-2 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/categories"
                style={({isActive}) => ({
                  color: isActive ? "greenyellow" : "white",
                })}>
                Manage Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className=" py-2 px-3 block hover:translate-x-2  hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/productlist"
                style={({isActive}) => ({
                  color: isActive ? "greenyellow" : "white",
                })}>
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className=" py-2 px-3 block hover:translate-x-2 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/allproductslist"
                style={({isActive}) => ({
                  color: isActive ? "greenyellow" : "white",
                })}>
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className=" py-2 px-3 block hover:translate-x-2 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/users"
                style={({isActive}) => ({
                  color: isActive ? "greenyellow" : "white",
                })}>
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className=" py-2 px-3 block hover:translate-x-2 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/orderlist"
                style={({isActive}) => ({
                  color: isActive ? "greenyellow" : "white",
                })}>
                Manage Orders
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
