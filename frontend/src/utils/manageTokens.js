import axios from "axios";

const refreshToken = async () => {
  try {
    const response = await axios.post(
      "http://beable-materiais-env.eba-peafr9cp.eu-west-3.elasticbeanstalk.com/api/auth/refresh-token",
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
