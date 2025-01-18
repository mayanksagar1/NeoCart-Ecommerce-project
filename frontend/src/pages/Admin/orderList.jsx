import {useState} from "react";
import Message from "../../components/Message.jsx";
import Loader from "../../components/Loader.jsx";
import {Link} from "react-router-dom";
import {useGetAllOrdersQuery, useUpdateDeliveryStatusMutation} from "../../redux/api/orderApiSlice.js";
import {toast} from "react-toastify";
import AdminMenu from "./AdminMenu.jsx";

const OrderList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {data: orderApiData, isLoading, error, refetch} = useGetAllOrdersQuery(currentPage); // Pass currentPage as query argument
  const [updateOrderStatus] = useUpdateDeliveryStatusMutation();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({id: orderId, orderStatus: newStatus});
      refetch();
      toast.success("Order Status Updated Successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status.");
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIndex = statuses.indexOf(currentStatus);

    // Return the current status and the next possible status only
    return statuses.slice(currentIndex, currentIndex + 2);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= orderApiData?.totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="p-6 relative">
          <AdminMenu />
          <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Order Management</h1>
          <div className="w-full lg:w-[85vw] m-auto  p-3 bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm lg:text-base">
                <thead className="bg-violet-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-center">Images</th>
                    <th className="px-4 py-2 text-center">Order ID</th>
                    <th className="px-4 py-2 text-center">User</th>
                    <th className="px-4 py-2 text-center">Date</th>
                    <th className="px-4 py-2 text-center">Total</th>
                    <th className="px-4 py-2 text-center">Paid</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderApiData.orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 flex min-w-40 flex-wrap gap-2">
                        {order.orderItems.map((item, index) => (
                          <img key={index} src={item.image || "#"} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                        ))}
                      </td>
                      <td className="px-4 py-2">{order._id}</td>
                      <td className="px-4 py-2">{order.user ? order.user.username : "N/A"}</td>
                      <td className="px-4 py-2">{order.createdAt.substring(0, 10)}</td>
                      <td className="px-4 py-2">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        {order.isPaid ? (
                          <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full">Paid</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <select className="border border-gray-300 rounded-md py-1 px-2" value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                          {getNextStatusOptions(order.orderStatus).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <Link to={`/admin/orders/${order._id}`}>
                          <button className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600">View</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            <div className="flex justify-between items-center mt-6">
              <button onClick={() => handlePageChange(currentPage - 1)} className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300" disabled={currentPage === 1}>
                Previous
              </button>
              <p className="text-gray-700">
                Page {orderApiData.page} of {orderApiData.totalPages}
              </p>
              <button onClick={() => handlePageChange(currentPage + 1)} className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300" disabled={currentPage === orderApiData.totalPages}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
