import axios from "axios";

const refreshToken = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/refresh-token",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    const newToken = response.data;
    localStorage.setItem("jwt", newToken);

    return newToken;
  } catch (error) {
    console.error(error);
  }
};

export default refreshToken;
