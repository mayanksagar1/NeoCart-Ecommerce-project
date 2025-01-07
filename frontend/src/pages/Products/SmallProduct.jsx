import {Link} from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({product}) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="w-full h-full  shadow-md rounded-lg bg-white p-3">
        <div className="relative">
          <img src={product.images[0]} alt={product.name} className="w-full h-[10rem] object-cover bg-slate-200 lg:h-[15rem] rounded" />
          <HeartIcon product={product} />
        </div>
        <div className="pt-2 px-2">
          <>
            <h2 className="lg:flex justify-between items-center">
              <div className="text-md w-full lg:w-[60%] h-7 overflow-hidden text-ellipsis whitespace-nowrap">{product.name}</div>
              <span className=" font-medium mr-2 px-2.5 py-1 rounded-full bg-violet-200 text-violet-500">${product.price}</span>
            </h2>
          </>
        </div>
      </div>
    </Link>
  );
};

export default SmallProduct;
