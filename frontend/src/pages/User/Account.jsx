import {NavLink, Outlet} from "react-router-dom";
import {ImProfile} from "react-icons/im";
import {BsCartCheckFill} from "react-icons/bs";
import {FaAddressBook} from "react-icons/fa";

const Account = () => {
  return (
    <section className="p-4 lg:w-[85vw] m-auto">
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto mt-2">
        {/* Sidebar */}
        <ul className="bg-white rounded-lg shadow-lg p-6 md:w-1/4 w-full border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Account</h2>
          <li className="mb-2">
            <NavLink
              to="/account/profile"
              className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-indigo-600 text-white font-semibold" : "text-gray-700 hover:bg-gray-100"}`}>
              <ImProfile size={24} />
              Profile
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/account/orders"
              className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-indigo-600 text-white font-semibold" : "text-gray-700 hover:bg-gray-100"}`}>
              <BsCartCheckFill size={24} />
              Your Orders
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/account/addresses"
              className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? "bg-indigo-600 text-white font-semibold" : "text-gray-700 hover:bg-gray-100"}`}>
              <FaAddressBook size={24} />
              Manage Addresses
            </NavLink>
          </li>
        </ul>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:w-3/4 w-full">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Account;
