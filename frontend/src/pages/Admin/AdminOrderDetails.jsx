import {useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {useGetOrderDetailsQuery, useUpdateDeliveryStatusMutation} from "../../redux/api/orderApiSlice.js";
import BtnLoader from "../../components/BtnLoader.jsx";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";
import moment from "moment";
import {toast} from "react-toastify";

const AdminOrderDetails = () => {
  const {orderId} = useParams();
  const navigate = useNavigate();
  const {data: order, isLoading, error, refetch} = useGetOrderDetailsQuery(orderId);
  const [updateOrderStatus, {isLoading: isUpdating}] = useUpdateDeliveryStatusMutation();
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus({orderId, status: selectedStatus}).unwrap();
      refetch();
      toast.success("Order Status Updated Successfully!");
    } catch (err) {
      toast.error(err.data?.message || "Failed to update order status!");
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIndex = statuses.indexOf(currentStatus);

    // Return the current status and the next possible status only
    return statuses.slice(currentIndex, currentIndex + 2);
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="error">{error?.data?.error || error.message}</Message>;

  return (
    <section className="w-full lg:w-[70vw] m-auto p-6 bg-gray-200 overflow-y-auto rounded-lg shadow-lg">
      <div>
        <button onClick={(e) => navigate(-1)} className="font-semibold hover:underline px-2 py-1 bg-slate-300 rounded-lg">
          Go Back
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Order Details</h1>

      {/* Order Info */}
      <div className="mb-6 bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Order Information</h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Ordered On:</strong> {moment(order.createdAt).format("DD MMMM YYYY, h:mm A")}
          </p>
          {order.isDelivered && (
            <p>
              <strong>Delivered On:</strong> {moment(order.deliveredAt).format("DD MMMM YYYY, h:mm A")}
            </p>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>{order.shippingAddress.fullName}</strong>
          </p>
          <p>
            <strong>Phone:</strong> {order.shippingAddress.phone}
          </p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city} , {order.shippingAddress.state} , {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      {/* Order Status Update */}
      {order.orderStatus !== "Delivered" && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Update Order Status</h2>
          <div className="space-y-2">
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full p-2 border rounded-md focus:outline-none">
              {getNextStatusOptions(order.orderStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button onClick={handleUpdateStatus} disabled={isUpdating} className={`w-full p-2 rounded-lg ${isUpdating ? "bg-gray-400" : "bg-violet-500 hover:bg-violet-600"} text-white`}>
              {isUpdating ? <BtnLoader /> : "Update Status"}
            </button>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Items</h2>
        <ul>
          {order.orderItems.map((item) => (
            <li key={item.product} className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-lg shadow-sm text-sm mb-2 text-gray-700">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <Link to={`/product/${item.product}`} className="font-medium text-pink-500 hover:text-pink-600 hover:underline">
                  {item.name}
                </Link>
              </div>
              <p className="text-right">
                {item.quantity} x ${item.price} = ${item.quantity * item.price}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Summary */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-800">Items Price:</span>
          <span className="font-semibold">$ {order?.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-800">Shipping Price :</span>
          <span className="font-semibold">$ {order?.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-800">Tax Price :</span>
          <span className="font-semibold">$ {order?.taxPrice}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mb-2">
          <span className="text-gray-800">Total Price :</span>
          <span className="text-xl">$ {order?.totalPrice}</span>
        </div>
      </div>
    </section>
  );
};

export default AdminOrderDetails;
