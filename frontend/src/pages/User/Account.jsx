import {Link, Outlet} from "react-router";
import {ImProfile} from "react-icons/im";
import {BsCartCheckFill} from "react-icons/bs";
import {FaAddressBook} from "react-icons/fa";

const Account = () => {
  return (
    <section className="  p-4">
      <div className="md:flex-row flex-col flex gap-8 md:mt-[4rem] justify-center align-center">
        <ul className="p-4 h-fit bg-white rounded-lg lg:ml-[5rem] w-[100%] md:w-[25%] border-2 shadow-lg">
          <li className="rounded hover:font-bold hover:translate-x-2 hover:text-[#7c3aed] hover:bg-black">
            <Link to={"/account/"} className="p-2 flex items-center gap-2">
              <ImProfile size={26} />
              Profile
            </Link>
          </li>
          <li className="rounded hover:font-bold hover:translate-x-2 hover:text-[#7c3aed] hover:bg-black">
            <Link to={"/account/orders"} className="p-2 flex items-center gap-2">
              <BsCartCheckFill size={26} />
              Your Orders
            </Link>
          </li>
          <li className="rounded hover:font-bold hover:translate-x-2 hover:text-[#7c3aed] hover:bg-black">
            <Link to={"/account/addresses"} className="p-2 flex items-center gap-2">
              <FaAddressBook size={26} />
              Manage Addresses
            </Link>
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
