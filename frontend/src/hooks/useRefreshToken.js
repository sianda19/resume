import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useRefreshToken = () => {
  const { setauth } = useContext(AuthContext);
  const { refreshToken } = useContext(AuthContext);
  const refresh = async () => {
    // console.log(refreshToken);
    // console.log("previous access token=>", auth);
    try {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_HOST}/refresh/`,
        data: { refreshToken: refreshToken },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.accessToken);
      setauth(response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {}
  };
  return refresh;
};

export default useRefreshToken;
