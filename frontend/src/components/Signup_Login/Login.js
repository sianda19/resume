import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { Button, Link } from "@mui/material";
import axios from "axios";
import AuthContext from "../../context/AuthProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320,
  bgcolor: "background.paper",
  border: "3px solid #00214d",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

export default function Login({
  open,
  handleOpen,
  handleClose,
  handleSignUpClick,
  handleLoginSuccess,
}) {
  const [loginData, setLoginData] = React.useState({
    user: "",
    pwd: "",
  });
  const { setauth } = React.useContext(AuthContext);
  const { setrefreshToken } = React.useContext(AuthContext);

  const [isLoginSuccessful, setIsLoginSuccessful] = React.useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = React.useState(false);

  const handleChange = (event) => {
    setLoginData((prevValue) => {
      return {
        ...prevValue,
        [event.target.name]: event.target.value,
      };
    });
  };

  const submitLoginData = async (e) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/auth/`,
        JSON.stringify(loginData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data);
      //   console.log(response.accessToken);
      //   console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      setauth({ accessToken });
      setrefreshToken(response?.data?.refreshToken);
      localStorage.setItem("refreshToken", response?.data?.refreshToken);
      setIsLoginSuccessful(true);
      setLoginData({
        user: "",
        pwd: "",
      });
      setShowLoginSuccess(true);
      handleLoginSuccess();
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (isLoginSuccessful) {
      setTimeout(() => {
        setShowLoginSuccess(false);
        handleClose();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginSuccessful]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="login modal"
        aria-describedby="Allows the user to login with an existing account"
      >
        <Box sx={style}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              margin: 0,
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Login
          </Typography>
          {showLoginSuccess && (
            <Typography
              sx={{
                color: "white",
                backgroundColor: "green",
                textAlign: "center",
                mt: 1,
                padding: "0.5rem",
                borderRadius: "5px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Logged in successfully! Closing this modal
            </Typography>
          )}
          <Typography
            sx={{ mt: 2, textAlign: "center", fontFamily: "Inter, sans-serif" }}
          >
            Welcome, great to see you back here!
          </Typography>
          <TextField
            sx={{ mt: 2, width: "100%", fontFamily: "Inter, sans-serif" }}
            required
            name="user"
            label="Username"
            value={loginData.user}
            onChange={handleChange}
          />
          <TextField
            sx={{ mt: 2, width: "100%", fontFamily: "Inter, sans-serif" }}
            required
            name="pwd"
            type="password"
            label="Password"
            value={loginData.pwd}
            onChange={handleChange}
          />
          <Box textAlign="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                mb: -1,
                backgroundColor: "#00214d",
                fontFamily: "Inter, sans-serif",
              }}
              onClick={submitLoginData}
            >
              Login
            </Button>
          </Box>
          <Link
            component="button"
            sx={{ mt: 3, mb: -1, fontFamily: "Inter, sans-serif" }}
            variant="body2"
            onClick={handleSignUpClick}
          >
            Don't have an account?
          </Link>
        </Box>
      </Modal>
    </div>
  );
}
