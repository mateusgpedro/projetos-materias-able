import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, isLoggedIn }) {
  return isLoggedIn === true ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
