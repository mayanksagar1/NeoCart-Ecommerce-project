import {Link, NavLink, Outlet} from "react-router";
import {ImProfile} from "react-icons/im";
import {BsCartCheckFill} from "react-icons/bs";
import {FaAddressBook} from "react-icons/fa";

const Account = () => {
  return (
    <section className="  p-4">
      <div className="md:flex-row flex-col flex gap-6 md:mt-[2rem] justify-center align-center">
        <ul className="p-4 h-fit bg-white rounded-lg lg:ml-[10rem] w-[100%] md:w-[25%] border-2 shadow-lg">
          <li className="rounded hover:font-bold m-1 hover:text-[#7c3aed] hover:bg-black">
            <NavLink
              to={"/account/profile"}
              style={({isActive}) => ({
                backgroundColor: isActive ? "black" : "",
                color: isActive ? "#7c3aed" : "",
                borderRadius: isActive ? "4px" : "",
                fontWeight: isActive ? "bold" : "",
              })}
              className="p-2 flex items-center gap-2">
              <ImProfile size={26} />
              Profile
            </NavLink>
          </li>
          <li className="rounded hover:font-bold m-1 hover:text-[#7c3aed] hover:bg-black">
            <NavLink
              to={"/account/orders"}
              style={({isActive}) => ({
                backgroundColor: isActive ? "black" : "",
                color: isActive ? "#7c3aed" : "",
                borderRadius: isActive ? "4px" : "",
                fontWeight: isActive ? "bold" : "",
              })}
              className="p-2 flex items-center gap-2">
              <BsCartCheckFill size={26} />
              Your Orders
            </NavLink>
          </li>
          <li className="rounded hover:font-bold m-1  hover:text-[#7c3aed] hover:bg-black">
            <NavLink
              to={"/account/addresses"}
              style={({isActive}) => ({
                backgroundColor: isActive ? "black" : "",
                color: isActive ? "#7c3aed" : "",
                borderRadius: isActive ? "4px" : "",
                fontWeight: isActive ? "bold" : "",
              })}
              className="p-2 flex items-center gap-2">
              <FaAddressBook size={26} />
              Manage Addresses
            </NavLink>
          </li>
        </ul>
        <div className="md:w-[75%] w-[100%] ">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Account;
