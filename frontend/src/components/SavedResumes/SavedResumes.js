import React, { useEffect, useContext } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AuthContext from "../../context/AuthProvider";
import "../CommonFormStyles.css";
import "./SavedResumes.css";

const SavedResumes = ({
  isLoggedIn,
  savedResumeTitles,
  setSavedResumeTitles,
  handleCloseSavedResumes,
  setBasicData,
  setWorkData,
  setEducationData,
  setTechnologiesData,
  setCertificationsData,
  setCurrentSection,
}) => {
  const { auth } = useContext(AuthContext);
  const axios = useAxiosPrivate();

  const handleResumeTitleClick = async (title) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/resume/${title}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.accessToken,
          },
        }
      );
      handleLoadSavedResume(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn && auth?.accessToken && savedResumeTitles?.length === 0) {
      const getSavedResumeTitles = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_HOST}/resume/all-titles`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + auth.accessToken,
              },
            }
          );
          setSavedResumeTitles(response.data);
        } catch (err) {
          console.log(err);
        }
      };
      getSavedResumeTitles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, savedResumeTitles]);

  let savedResumeElements = savedResumeTitles.map((resumeObj) => (
    <section
      key={resumeObj._id}
      className="resume-element hover-effect"
      onClick={() => handleResumeTitleClick(resumeObj.resumeTitle)}
    >
      {resumeObj.resumeTitle}
    </section>
  ));

  let noResumesFound = (
    <section className="resume-element hover-effect">
      {"No saved resumes found in your account :("}
    </section>
  );

  const handleLoadSavedResume = (data) => {
    const {
      basicData,
      workData,
      educationData,
      technologiesData,
      certificationsData,
    } = data;

    setBasicData({
      firstName: "",
      lastName: "",
      profession: "",
      city: "",
      country: "",
      pincode: "",
      phone: "",
      email: "",
      github: "",
      linkedin: "",
      twitter: "",
      ...basicData,
    });

    if (!workData?.length) {
      setWorkData([
        {
          id: 1,
          jobTitle: "",
          employer: "",
          city: "",
          country: "",
          startDate: "",
          endDate: "",
          jobDescription: "",
        },
      ]);
    } else {
      setWorkData(
        workData.map((workItem) => {
          return {
            id: 1,
            jobTitle: "",
            employer: "",
            city: "",
            country: "",
            startDate: "",
            endDate: "",
            jobDescription: "",
            ...workItem,
          };
        })
      );
    }

    if (!educationData?.length) {
      setEducationData([
        {
          id: 1,
          schoolName: "",
          schoolLocation: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          eduDescription: "",
        },
      ]);
    } else {
      setEducationData(
        educationData.map((educationItem) => {
          return {
            id: 1,
            schoolName: "",
            schoolLocation: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            eduDescription: "",
            ...educationItem,
          };
        })
      );
    }

    if (!technologiesData?.length) {
      setTechnologiesData([
        {
          id: 1,
          technology: "",
          project: "",
          demoLink: "",
          repoLink: "",
          additionalDetails: "",
        },
      ]);
    } else {
      setTechnologiesData(
        technologiesData.map((technologiesItem) => {
          return {
            id: 1,
            technology: "",
            project: "",
            demoLink: "",
            repoLink: "",
            additionalDetails: "",
            ...technologiesItem,
          };
        })
      );
    }

    if (!certificationsData?.length) {
      setCertificationsData([
        {
          id: 1,
          certificateTitle: "",
          certifyingOrg: "",
        },
      ]);
    } else {
      setCertificationsData(
        certificationsData.map((certificationsItem) => {
          return {
            id: 1,
            certificateTitle: "",
            certifyingOrg: "",
            ...certificationsItem,
          };
        })
      );
    }

    handleCloseSavedResumes();
    setCurrentSection(1);
  };

  return (
    <div className="common-section saved-resumes-section">
      <div className="common-container saved-resumes-common-container">
        <div className="saved-resumes-heading">Saved Resumes</div>
        <div className="saved-resumes-top-text">
          Your saved resumes are shown here. If you click on any resume title,
          the website's form will be filled with the data you previously filled
          for that resume. You can then edit the data and save it as a new
          resume or update a previously saved resume.
        </div>
        <div className="main-content">
          {savedResumeElements?.length ? savedResumeElements : noResumesFound}
        </div>
        <div className="saved-resumes-bottom">
          <button
            className="no-left-margin"
            id="style-btn"
            onClick={() => setSavedResumeTitles([])}
          >
            Refresh Data
          </button>
          <button
            id="style-btn"
            className="no-left-margin-mobile"
            onClick={handleCloseSavedResumes}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedResumes;
