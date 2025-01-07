import {Link} from "react-router-dom";
import moment from "moment";
import {useGetAllProductsQuery} from "../../redux/api/productsApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import {FaArrowRightLong} from "react-icons/fa6";

const ProductList = () => {
  const {data: products, isLoading, isError, refetch} = useGetAllProductsQuery();
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div className="m-auto w-fit mt-5">Error Loading products</div>;
  }
  return (
    <>
      <section className="relative p-3">
        <AdminMenu />
        <h1 className="text-2xl md:pl-[10rem] mt-4 mb-4 text-center md:text-left font-bold ">All Products ({products.length})</h1>
        <div className="m-auto rounded-lg border-2 bg-white w-fit">
          <div className="p-3 w-[85vw] gap-3 flex flex-col  ">
            {products.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center mt-10 p-5">
                <FaBoxOpen className="text-gray-400 text-6xl mb-4" />
                <h2 className="text-xl font-medium text-gray-600 mb-2">No Products Found</h2>
                <p className="text-gray-500 mb-6">It looks like you haven’t added any products yet. Create your first product to get started!</p>
                <Link to="/admin/products/add" className="bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-600 transition duration-300">
                  Create Product
                </Link>
              </div>
            )}
            {products.map((product) => (
              <div key={product._id} className="flex gap-3 border-2 md:border-0  rounded-lg items-center flex-col md:flex-row md:items-stretch">
                <img src={product?.images[0]} loading="lazy" alt={product?.name} className="w-full md:w-[15rem] h-[15rem]   md:border-2 rounded-lg object-cover" />
                <div className="flex flex-1 flex-col w-full md:border-2  rounded-lg justify-around p-3">
                  <div className="flex justify-between">
                    <h5 className="text-xl font-semibold mb-2">{product?.name}</h5>
                    <p className="text-gray-400 text-xs">{moment(product.createdAt).format("MMMM Do YYYY")}</p>
                  </div>
                  <p className="text-gray-400 xl:w-[30rem] lg:w-[30rem] md:w-[20rem] sm:w-[10rem] text-sm mb-4">{product?.description?.substring(0, 160)}...</p>
                  <div className="flex justify-between">
                    <Link
                      to={`/admin/products/update/${product._id}`}
                      className="inline-flex items-center gap-2 border-2 border-black px-4 py-2  text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">
                      Update Product
                      <FaArrowRightLong />
                    </Link>
                    <p>$ {product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductList;
