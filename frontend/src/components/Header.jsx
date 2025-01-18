import {useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import {CiSearch} from "react-icons/ci";
import {AiOutlineShoppingCart} from "react-icons/ai";
import CartCount from "./CartCount";

const Header = () => {
  const inputRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?search=${searchInput}`);
    }
  };

  return (
    <header className="p-4 pl-[10vw] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md sticky top-0 z-40 flex items-center justify-around">
      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full max-w-[40rem] mx-4 bg-white rounded-full shadow-md border transition-transform transform focus-within:shadow-lg focus-within:scale-105">
        <CiSearch size={24} className="text-gray-500  ml-2 lg:ml-4 cursor-pointer hover:text-purple-600 transition-colors" onClick={handleSearchIconClick} />
        <input
          ref={inputRef}
          type="search"
          id="search"
          placeholder="Search for products"
          className="bg-transparent border-none rounded-lg outline-none w-full py-2 px-4 text-gray-700 text-sm"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-all">
          Search
        </button>
      </form>

      {/* Cart Section */}
      <div className="ml-4 lg:mr-4 relative">
        <Link to="/cart" className="flex items-center gap-2 p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
          <AiOutlineShoppingCart size={26} className="text-purple-600" />
          <span className="hidden md:block text-sm font-medium text-gray-700">Cart</span>
          <CartCount className={"top-1 right-2 md:right-9"} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
