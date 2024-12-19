import {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {CiSearch} from "react-icons/ci";
import {AiOutlineShoppingCart} from "react-icons/ai";

const Header = () => {
  const inputRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <header className="p-2 m-auto flex items-center justify-around md:pl-2  pl-[4rem] bg-white z-10 sticky top-0 h-[8%]">
      <div className="flex items-center rounded-md shadow-sm p-2  border bg-slate-200">
        <CiSearch size={26} className="text-slate-600" onClick={handleSearchIconClick} />
        <input
          ref={inputRef}
          type="search"
          id="search"
          placeholder="Search for products"
          className="bg-inherit border-none outline-none lg:w-[25vw] md:w-[30vw]  w-[50vw] "
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div></div>
      <div className="">
        <Link to="/cart" className="flex items-center gap-2 transition-transform transform hover:font-bold hover:translate-x-2 hover:text-[#7c3aed]">
          <AiOutlineShoppingCart size={26} className="" />
          <span className="">Cart</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
