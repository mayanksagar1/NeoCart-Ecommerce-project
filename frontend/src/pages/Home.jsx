import {Link, useParams} from "react-router-dom";
import {useFetchProductsQuery} from "../redux/api/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Hero from "../components/Hero";
import CategoryCard from "./Products/CategoryCard";
import FeaturedProducts from "./Products/FeaturedProducts";
import SmallProduct from "./Products/SmallProduct";

const Home = () => {
  const {keyword, page} = useParams();
  const {data, isLoading, isError} = useFetchProductsQuery({keyword, page});
  return (
    <section className="w-full md:w-[85vw] m-auto ">
      <Hero />
      <CategoryCard />
      <FeaturedProducts />
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant={"error"}>{isError.data?.message || isError.error} </Message>
      ) : (
        <>
          <div className="flex justify-between p-3 mt-5  items-center">
            <h1 className="text-2xl text-center md:text-left font-bold">Special Products</h1>
            <Link to="/shop" className="bg-pink-500 text-white font-bold rounded-full py-2 px-10 ">
              Shop
            </Link>
          </div>

          <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-3 mt-4 p-3">
              {data.products.map((product) => (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
