import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
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

export default function SaveResume({
  open,
  handleOpen,
  handleClose,
  isUpdate,
  basicData,
  workData,
  educationData,
  technologiesData,
  certificationsData,
}) {
  const [resumeTitle, setResumeTitle] = React.useState("");
  const { auth } = React.useContext(AuthContext);
  const axios = useAxiosPrivate();
  const [isSaveSuccess, setIsSaveSuccess] = React.useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = React.useState(false);

  const submitResumeData = async (e) => {
    const resumeData = {
      resumeTitle,
      basicData,
      workData,
      educationData,
      technologiesData,
      certificationsData,
    };
    console.log(JSON.stringify(resumeData));
    try {
      if (isUpdate === false) {
        await axios.post(
          `${process.env.REACT_APP_API_HOST}/resume/`,
          JSON.stringify(resumeData), // Replace
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.accessToken,
            },
          }
        );
      } else if (isUpdate) {
        await axios.put(
          `${process.env.REACT_APP_API_HOST}/resume/`,
          JSON.stringify(resumeData), // Replace
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.accessToken,
            },
          }
        );
      }
      setIsSaveSuccess(true);
      setResumeTitle("");
      setShowSaveSuccess(true);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (isSaveSuccess) {
      setTimeout(() => {
        setShowSaveSuccess(false);
        handleClose();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaveSuccess]);

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
            Save Resume
          </Typography>
          {showSaveSuccess && (
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
              Resume data saved successfully to the database!
              <br />
              Closing this modal.
            </Typography>
          )}
          <Typography
            sx={{ mt: 2, textAlign: "center", fontFamily: "Inter, sans-serif" }}
          >
            Enter the title of a previously saved resume to update it, or enter
            a new name.
          </Typography>
          <TextField
            sx={{ mt: 2, width: "100%", fontFamily: "Inter, sans-serif" }}
            required
            name="resumeTitle"
            label="Resume Title"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
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
              onClick={submitResumeData}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
