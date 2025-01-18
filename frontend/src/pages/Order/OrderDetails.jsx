import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Link} from "react-router-dom";
import {useGetOrderDetailsQuery} from "../../redux/api/orderApiSlice.js";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";
import moment from "moment";

const OrderDetails = () => {
  const {orderId} = useParams();
  const {data: order, isLoading, error} = useGetOrderDetailsQuery(orderId);
  console.log(order);
  const [statusSteps, setStatusSteps] = useState([]);

  useEffect(() => {
    setStatusSteps([
      {step: "Pending", completed: ["Pending", "Processing", "Shipped", "Delivered"].includes(order?.orderStatus)},
      {step: "Processing", completed: ["Processing", "Shipped", "Delivered"].includes(order?.orderStatus)},
      {step: "Shipped", completed: ["Shipped", "Delivered"].includes(order?.orderStatus)},
      {step: "Delivered", completed: order?.orderStatus === "Delivered"},
    ]);
  }, [order]);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="error">{error?.data?.error || error.message}</Message>;

  return (
    <section className=" p-6 bg-gray-100 md:max-h-[74vh] overflow-y-auto rounded-lg shadow-lg">
      <div className="">
        <h1 className="text-3xl font-bold mb-6 text-center">Order Details</h1>

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

        {/* Payment Info */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <p>
                <strong>Paid On:</strong> {moment(order.paidAt).format("DD MMMM YYYY, h:mm A")}
              </p>
            ) : (
              <p className="text-red-600 font-medium">Payment Pending</p>
            )}
          </div>
        </div>

        {/* Order Status Steps */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 md:mb-4">Order Status</h2>
          <div className="hidden md:flex  gap-4  md:w-fit m-auto">
            {statusSteps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start  lg:gap-6  text-center ">
                <div className="flex md:flex-col items-center justify-between gap-2">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step.completed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>{index + 1}</div>
                  <p className={`${step.completed ? "text-green-500" : "text-gray-600"} font-medium`}>{step.step}</p>
                </div>
                {index < statusSteps.length - 1 && <div className={` md:h-1 md:w-10 md:mt-4  ${step.completed ? "bg-green-500" : "bg-gray-300"}`}></div>}
              </div>
            ))}
          </div>
          <div className="md:hidden text-xl font-bold text-gray-800">{order.orderStatus}</div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Order Items</h2>
          <ul className="">
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
      </div>
    </section>
  );
};

export default OrderDetails;
