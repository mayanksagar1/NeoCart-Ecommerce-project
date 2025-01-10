import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router";
import {RouterProvider} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store.js";

// imports for simple routes
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import Cart from "./pages/Cart.jsx";

// importing Auth pages
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

// importing private routes.
import PrivateRoute from "./components/PrivateRoute.jsx";

// user pages
import Account from "./pages/User/Account.jsx";
import Profile from "./pages/User/Profile.jsx";
import Orders from "./pages/User/Orders.jsx";
import Address from "./pages/User/Address.jsx";

// admin
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import CreateProduct from "./pages/Admin/CreateProduct.jsx";
import ProductUpdate from "./pages/Admin/ProductUpdate.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />

      <Route path="" element={<PrivateRoute />}>
        {/* user routes */}
        <Route path="/account" element={<Account />}>
          <Route path="/account/profile" element={<Profile />} />
          <Route path="/account/orders" element={<Orders />} />
          <Route path="/account/addresses" element={<Address />} />
        </Route>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/categories" element={<CategoryList />} />
          <Route path="/admin/products/add" element={<CreateProduct />} />
          <Route path="/admin/products/list" element={<ProductList />} />
          <Route path="/admin/products/update/:_id" element={<ProductUpdate />} />
        </Route>
      </Route>
    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
