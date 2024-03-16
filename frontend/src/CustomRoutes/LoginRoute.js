import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import fetchValidation from "../utils/ValidateToken";

function LoginRoute({ children, isLoggedIn }) {
  return isLoggedIn === true ? <Navigate to="/dashboard" /> : children;
}

export default LoginRoute;
