import axios from "axios";
import axiosInstance from "./axiosInstance";

const fetchValidation = async ({ setIsLoggedIn, setUserRoles }) => {
  try {
    const response = await axiosInstance.post(
      "/auth/validate-jwt",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("Jwt is valid");

    setIsLoggedIn(true);

    sessionStorage.setItem("email", response.data.email);
    sessionStorage.setItem("fullname", response.data.fullname);

    console.log(response.data.roles[0])

    setUserRoles(response.data.roles[0]);

    return true;
  } catch (error) {
    console.error("Error during jwt validation:", error);

    setIsLoggedIn(false);

    return false;
  }
};

export default fetchValidation;
