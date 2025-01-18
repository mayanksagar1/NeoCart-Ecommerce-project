import {useState, useEffect} from "react";
import {useGetMyOrdersQuery} from "../../redux/api/orderApiSlice.js";
import {Link} from "react-router-dom";
import {FaArrowRightLong} from "react-icons/fa6";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";
import moment from "moment";

const Orders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const {data: orderApiData, isLoading, error} = useGetMyOrdersQuery(currentPage);

  useEffect(() => {
    if (orderApiData) {
      setOrders(orderApiData.orders);
    }
  }, [orderApiData]);

  const totalPages = orderApiData?.totalPages || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <Message variant={"error"}>{error?.data?.error || error.message}</Message>;
  }

  return (
    <section className="md:max-h-[80vh] lg:max-h-[74vh] overflow-y-auto">
      {orders?.length ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="p-6 rounded-lg bg-gray-100 shadow-md hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <strong className="text-gray-800 font-semibold text-base md:w-[60%]">Order ID: {order._id}</strong>
                <p className="text-gray-600 text-sm mt-2 md:mt-0">{moment(order.createdAt).format("DD MMMM YYYY")}</p>
              </div>
              {/* Order Items */}
              <ul className="rounded-lg mt-4 space-y-3">
                {order?.orderItems?.map((orderItem) => (
                  <li key={orderItem._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <img src={orderItem.image} alt={orderItem.name} className="w-16 h-16 rounded-lg object-cover" />
                      <Link to={`/product/${orderItem.product}`} className="text-pink-600 hover:underline font-medium text-sm">
                        {orderItem.name}
                      </Link>
                    </div>
                    <div className="text-gray-500 text-sm text-right font-semibold mt-2 md:mt-0">
                      {orderItem.quantity} X ${orderItem.price}
                    </div>
                  </li>
                ))}
              </ul>
              {/* Order Summary */}
              <div className="flex items-center justify-between p-3 mt-4 text-gray-800">
                <p className="text-lg font-semibold">Total:</p>
                <p className="text-xl font-bold">${order.totalPrice}</p>
              </div>
              {/* View Details Button */}
              <div className="mt-4 flex items-center justify-between">
                {order.orderStatus === "Delivered" ? (
                  <div>
                    <h2 className="text-sm font-medium mb-2">Delivered</h2>
                    <div className="text-sm font-semibold text-gray-800">{order.deliveredAt.substring(0, 10)}</div>
                  </div>
                ) : (
                  <div className="rounded-lg">
                    <h2 className="text-sm font-medium mb-2">Order Status</h2>
                    <div className="text-sm font-semibold text-gray-800">{order.orderStatus}</div>
                  </div>
                )}
                <Link
                  to={`/account/order/${order._id}`}
                  className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white text-base font-semibold px-4 py-2 rounded shadow transition-all">
                  View Details
                  <FaArrowRightLong size={20} />
                </Link>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <button className={`px-4 py-2 bg-gray-200 rounded ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </button>
            {Array.from({length: totalPages}, (_, i) => (
              <button key={i + 1} className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-violet-500 text-white" : "bg-gray-200"}`} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button
              className={`px-4 py-2 bg-gray-200 rounded ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10">
          <img src="https://res.cloudinary.com/dzwqyiazp/image/upload/v1736705718/icons/om4fklxc7ycw6e3rvrcp.png" alt="No Orders" className="w-64 h-64 object-contain mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">You haven't placed any orders yet!</h2>
          <p className="text-gray-600 text-center max-w-md mb-6">Start shopping now and fill your cart with amazing products. Once you make a purchase, you'll find your orders listed here.</p>
          <Link to="/shop" className="bg-violet-500 hover:bg-violet-600 text-white text-lg font-semibold px-6 py-3 rounded shadow-md transition-all">
            Start Shopping
          </Link>
        </div>
      )}
    </section>
  );
};

export default Orders;
