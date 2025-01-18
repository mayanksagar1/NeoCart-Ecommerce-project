import {useSearchParams} from "react-router-dom";
import {useFetchProductsQuery} from "../redux/api/productsApiSlice.js";
import ProductCard from "../pages/Products/ProductCard.jsx";
import Loader from "./Loader.jsx";
import Message from "./Message.jsx";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const {data: products, isLoading, error} = useFetchProductsQuery({keyword: searchQuery, page: 1});

  if (isLoading) return <Loader />;
  if (error) {
    if (error.status === 404) {
      return (
        <div className="m-auto flex flex-col items-center justify-center h-[50vh]">
          <img src="https://res.cloudinary.com/dzwqyiazp/image/upload/v1736705718/icons/om4fklxc7ycw6e3rvrcp.png" alt="No Products" className="w-32 h-32 mb-4" />
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      );
    }
    return <Message variant="error">{error.data?.message || error.message}</Message>;
  }

  return (
    <section className="p-6 w-full lg:w-[85vw] m-auto">
      <h1 className="text-2xl font-bold mb-6 m-auto">Search Results for "{searchQuery}"</h1>
      {products?.products?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-auto">
          {products.products.map((product) => (
            <div key={product._id}>
              <ProductCard p={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="m-auto flex flex-col items-center justify-center h-[50vh]">
          <img src="https://res.cloudinary.com/dzwqyiazp/image/upload/v1736705718/icons/om4fklxc7ycw6e3rvrcp.png" alt="No Products" className="w-32 h-32 mb-4" />
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      )}
    </section>
  );
};

export default Shop;
