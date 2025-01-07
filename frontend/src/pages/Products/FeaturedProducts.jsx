import {useGetTopProductsQuery} from "../../redux/api/productsApiSlice";
import Loader from "../../components/Loader";
import SmallProduct from "./SmallProduct";
import ProductCarousel from "./ProductCarousel";

const FeaturedProducts = () => {
  const {data, isLoading, error} = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1 className="m-auto w-fit mt-5">ERROR</h1>;
  }

  return (
    <>
      <h1 className="text-2xl  mt-10 mb-4 text-center md:text-left font-bold ">Top Products</h1>
      <div className="flex justify-around gap-6 p-3 ">
        <div className="xl:block w-1/2 lg:block hidden md:hidden sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {data.map((product) => (
              <div key={product._id} className="w-full">
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/2 w-full ">
          <ProductCarousel />
        </div>
      </div>
    </>
  );
};

export default FeaturedProducts;
