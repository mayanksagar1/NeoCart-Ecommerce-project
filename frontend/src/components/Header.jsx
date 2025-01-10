import {useState, useRef} from "react";
import {Link} from "react-router-dom";
import {CiSearch} from "react-icons/ci";
import {AiOutlineShoppingCart} from "react-icons/ai";
import CartCount from "./CartCount";

const Header = () => {
  const inputRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <header className="p-4 bg-white shadow-md sticky top-0 z-40 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex items-center w-full max-w-[40rem] ml-[10vw] md:ml-[5vw]  bg-gray-100 rounded-full shadow-sm border transition-transform transform focus-within:shadow-lg focus-within:scale-105">
        <CiSearch size={24} className="text-gray-500 ml-4 cursor-pointer hover:text-violet-600 transition-colors" onClick={handleSearchIconClick} />
        <input
          ref={inputRef}
          type="search"
          id="search"
          placeholder="Search for products"
          className="bg-transparent border-none outline-none w-full py-2 px-4 text-gray-700 text-sm"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Cart */}
      <div className="ml-4 lg:mr-4 relative ">
        <Link to="/cart" className="flex items-center gap-2 p-2 bg-violet-100 rounded-full hover:bg-violet-200 transition-all">
          <AiOutlineShoppingCart size={26} className="text-violet-600" />
          <span className="hidden md:block text-sm font-medium text-violet-700">Cart</span>
          <CartCount className={"top-0 right-1 md:right-9"} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
