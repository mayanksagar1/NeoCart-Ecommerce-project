import {useState} from "react";
import {Link} from "react-router-dom";
import {useGetUsersCountQuery} from "../../redux/api/usersApiSlice.js";
import {useGetTotalOrderCountQuery, useGetTotalSalesQuery, useGetTotalSalesByDateQuery, useGetAllOrdersQuery, useUpdateDeliveryStatusMutation} from "../../redux/api/orderApiSlice.js";
import {LuShoppingBag, LuUsers, LuDollarSign} from "react-icons/lu";
import {FaFileInvoiceDollar} from "react-icons/fa6";
import Loader from "../../components/Loader.jsx";
import Message from "../../components/Message.jsx";
import AdminMenu from "./AdminMenu";
import Chart from "react-apexcharts";

const AdminDashboard = () => {
  // Fetch API data
  const {data: totalUsers, isLoading: usersLoading, error: usersError} = useGetUsersCountQuery();
  const {data: totalOrders, isLoading: ordersLoading, error: ordersError} = useGetTotalOrderCountQuery();
  const {data: totalSales, isLoading: salesLoading, error: salesError} = useGetTotalSalesQuery();
  const {data: salesByDate, isLoading: salesByDateLoading, error: salesByDateError} = useGetTotalSalesByDateQuery();

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

  // Loader or error handling
  if (usersLoading || ordersLoading || salesLoading || salesByDateLoading || isLoading) return <Loader />;
  if (usersError || ordersError || salesError || salesByDateError || error) {
    return <Message variant="error">Failed to load dashboard data.</Message>;
  }

  // Chart configurations
  const chartOptions = {
    series: [
      {
        name: "Total Sales",
        data: salesByDate?.map((sale) => sale.totalSales.toFixed(2)),
      },
    ],
    options: {
      colors: ["#6366f1"],
      dataLabels: {enabled: false},
      stroke: {curve: "smooth", width: 2},
      grid: {borderColor: "#e5e7eb"},
      markers: {size: 5, colors: ["#6366f1"], strokeWidth: 2},
      chart: {
        type: "line",
        zoom: {enabled: false},
      },
      xaxis: {
        categories: salesByDate?.map((sale) => sale._id),
        title: {text: "Dates", style: {fontSize: "14px", fontWeight: "500"}},
        labels: {style: {fontSize: "12px"}},
      },
      yaxis: {
        title: {text: "Sales ($)", style: {fontSize: "14px", fontWeight: "500"}},
        labels: {style: {fontSize: "12px"}},
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        offsetY: -10,
        offsetX: -10,
      },
    },
  };

  return (
    <div className="p-6 relative bg-gray-100">
      {/* Admin Menu */}
      <AdminMenu />

      {/* Dashboard Container */}
      <section className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <div className="flex items-center gap-4">
              <div>
                <div className=" text-white relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <path
                      d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z"
                      fill="#22C55E"></path>
                  </svg>
                  <LuUsers size={28} className="absolute top-[12px] left-[11px]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold">{totalUsers.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <div className="flex items-center gap-4">
              <div>
                <div className=" text-white relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <path
                      d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z"
                      fill="#FF5200"></path>
                  </svg>
                  <LuShoppingBag size={28} className="absolute top-[12px] left-[10px]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
                <p className="text-3xl font-bold">{totalOrders.totalOrders}</p>
              </div>
            </div>
          </div>

          {/* Total Sales */}
          <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <div className="flex items-center gap-4">
              <div>
                <div className=" text-white relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <path
                      d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z"
                      fill="#2377FC"></path>
                  </svg>
                  <LuDollarSign size={28} className="absolute top-[12px] left-[10px]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
                <p className="text-3xl font-bold">${totalSales.totalSales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Sales This Week */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <div className="flex items-center gap-4">
              <div className=" text-white relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <path
                    d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z"
                    fill="#7d60f3"></path>
                </svg>
                <FaFileInvoiceDollar size={26} className="absolute top-[12px] left-[11px]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Sales Last Week</h3>
                <p className="text-3xl font-bold">${salesByDate?.reduce((acc, sale) => acc + sale.totalSales, 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-10 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Sales Overview</h2>
          <Chart options={chartOptions.options} series={chartOptions.series} type="line" height={350} />
        </div>
      </section>
      {/* Orders Section */}
      <section className="mt-12 max-w-7xl m-auto">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Order Management</h1>
        <div className="w-full  m-auto  p-3 bg-white rounded-lg shadow-md">
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
                {orderApiData &&
                  !isLoading &&
                  orderApiData.orders.map((order) => (
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
          {orderApiData && !isLoading && (
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
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
