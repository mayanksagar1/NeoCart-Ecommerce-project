import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router";
import {RouterProvider} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store.js";

// importing private routes.
import PrivateRoute from "./components/PrivateRoute.jsx";

// importing Auth pages
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

// user pages
import Account from "./pages/User/Account.jsx";
import Profile from "./pages/User/Profile.jsx";

// admin
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<PrivateRoute />}>
        {/* user routes */}
        <Route path="/account" element={<Account />}>
          <Route path="/account/" element={<Profile />} />
        </Route>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/userlist" element={<UserList />} />
          <Route path="/admin/categorylist" element={<CategoryList />} />
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
