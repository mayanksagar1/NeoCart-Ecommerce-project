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
      {/* Toggle Button */}
      <button
        className={`${isMenuOpen ? "top-5 right-7" : "top-5 right-7"} z-10 bg-[#1b1b1b] p-2 absolute rounded-full shadow-md hover:scale-110 transform transition-transform duration-300`}
        onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes color="#32de84" size={22} /> : <CgMenuGridR size={24} color="#32de84" />}
      </button>

      {/* Menu Section */}
      {isMenuOpen && (
        <section className="bg-[#1b1b1b] rounded-lg p-5 z-10 absolute right-10 top-16 shadow-lg w-64 border border-[#2a2a2a]">
          <ul className="list-none">
            {/* Menu Items */}
            {[
              {label: "Admin Dashboard", to: "/admin/dashboard"},
              {label: "Manage Category", to: "/admin/categories"},
              {label: "Create Product", to: "/admin/products/add"},
              {label: "All Products", to: "/admin/products/list"},
              {label: "Manage Users", to: "/admin/users"},
              {label: "Manage Orders", to: "/admin/orders/list"},
            ].map((item, index) => (
              <li key={index} className="mb-3">
                <NavLink
                  className="py-2 px-4 block text-[#d1d1d1] rounded-md transition-all duration-300 hover:translate-x-2 hover:bg-[#2e2e2e] hover:text-[#32de84]"
                  to={item.to}
                  style={({isActive}) => ({
                    color: isActive ? "#32de84" : "#d1d1d1",
                    backgroundColor: isActive ? "#2e2e2e" : "transparent",
                  })}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
