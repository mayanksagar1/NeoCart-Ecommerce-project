import {Navigate, Outlet} from "react-router";
import {useSelector} from "react-redux";

const AdminRoute = () => {
  const {userInfo} = useSelector((state) => state.auth);

  return userInfo.role === "admin" ? <Outlet /> : <Navigate to={"/login"} replace />;
};

export default AdminRoute;
