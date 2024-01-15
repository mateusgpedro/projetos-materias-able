import axios from "axios";
import axiosInstance from "./axiosInstance";

const fetchValidation = async ({ setIsLoggedIn }) => {
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

    return true;
  } catch (error) {
    console.error("Error during jwt validation:", error);

    setIsLoggedIn(false);

    return false;
  }
};

export default fetchValidation;
