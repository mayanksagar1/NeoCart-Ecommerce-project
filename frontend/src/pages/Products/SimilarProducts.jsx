import {useState, useEffect} from "react";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {useGetProductsByCategoryQuery} from "../../redux/api/productsApiSlice";

const SimilarProducts = ({category, page = 1, productId}) => {
  const {data, isLoading, error} = useGetProductsByCategoryQuery(category, page);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data) {
      const filteredProducts = data.products.filter((p) => p._id !== productId);
      setProducts(filteredProducts);
    }
  }, [data, productId]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="error">{error?.data?.message || "Failed to fetch similar products. Please try again later."}</Message>;
  }

  return (
    <section className="mt-4">
      <h1 className="text-2xl text-center md:text-left font-bold">Similar Products</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 rounded-lg p-3">
          {products.map((product) => (
            <div key={product._id}>
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 bg-gray-300 rounded-lg mt-4 p-4">
          <h2 className="text-lg font-semibold text-gray-600">No Similar Products Found</h2>
          <p className="text-gray-500 text-sm mt-2">Try searching for other products or explore more categories.</p>
        </div>
      )}
    </section>
  );
};

export default SimilarProducts;
