import React, { useRef, useState } from "react";
import SaveResume from "./SaveResume";
import "./GenerateResume.css";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const GenerateResume = (props) => {
  const printRef = useRef();
  const [openSaveResume, setOpenSaveResume] = useState(false);
  const [isUpdate, setIsUpdate] = useState(null);

  // Reference Blog for HTML to PDF logic https://www.robinwieruch.de/react-component-to-pdf/
  const handleDownloadPdf = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("print.pdf");
  };

  const handleSaveButtonClick = (isUpdate) => {
    setIsUpdate(isUpdate);
    setOpenSaveResume(true);
  };

  const {
    basicData,
    workData,
    educationData,
    technologiesData,
    certificationsData,
  } = props;

  const experienceContents = workData.map((object) => {
    return (
      <div className="experience-item" key={object.id}>
        <div className="experience-item-top">
          <div>{object.employer}</div>
          <div>{`${object.startDate} - ${object.endDate}`}</div>
        </div>
        <div className="experience-item-middle">
          <div>{object.jobTitle}</div>
          <div>{`${object.city}, ${object.country}`}</div>
        </div>
        <div className="experience-item-body">{object.jobDescription}</div>
      </div>
    );
  });

  const educationContents = educationData.map((object) => {
    return (
      <div className="education-item" key={object.id}>
        <div className="education-item-top">
          <div>{object.schoolName}</div>
          <div>{`${object.startDate} - ${object.endDate}`}</div>
        </div>
        <div className="education-item-middle">
          <div>{`${object.degree} (${object.fieldOfStudy})`}</div>
          <div>{`${object.schoolLocation}`}</div>
        </div>
        <div className="education-item-body">{object.eduDescription}</div>
      </div>
    );
  });

  const projectContents = technologiesData.map((object) => {
    return (
      <div className="project-item" key={object.id}>
        <div className="project-item-top">
          <div>{object.project}</div>
          <div>{object.technology}</div>
        </div>
        <div className="project-item-body">{object.additionalDetails}</div>
      </div>
    );
  });

  let certifications = "";
  for (let certificationObj of certificationsData) {
    certifications += certificationObj.certificateTitle + ", ";
  }
  certifications = certifications.replace(/,\s*$/, "");

  return (
    <>
      <div className="download-details">
        <h1>
          Your PDF has been generated! You can see a preview of the generated
          resume below.
        </h1>
        <p>
          This preview is just for representational purposes, the actual pdf
          might differ in height based on the amount of content you have. If
          your pdf gets cut off at a certain length then it means that your text
          content is too long to create a single page A4 resume, please click on
          edit details and reduce the content accordingly.
          <br /> <br />
          If you want to save the info entered in this form then you need to be
          logged in first, then click on either "Update Saved" to update a
          previously saved resume, or "Save New" to save it as a new resume in
          your account. Saved resumes can be accessed by clicking the link for
          the same on the navbar once you are logged in.
        </p>
        <div className="generate-section-buttons">
          <button id="generate-resume-btn" onClick={handleDownloadPdf}>
            Download
          </button>
          <button id="go-back-btn" onClick={props.editDetails}>
            Edit Details
          </button>
          {props.isLoggedIn && (
            <>
              <button
                id="style-btn"
                onClick={() => handleSaveButtonClick(true)}
              >
                Update Saved
              </button>
              <button
                id="style-btn"
                onClick={() => handleSaveButtonClick(false)}
              >
                Save New
              </button>
            </>
          )}
        </div>
        <SaveResume
          open={openSaveResume}
          handleOpen={() => setOpenSaveResume(true)}
          handleClose={() => setOpenSaveResume(false)}
          isUpdate={isUpdate}
          basicData={basicData}
          workData={workData}
          educationData={educationData}
          technologiesData={technologiesData}
          certificationsData={certificationsData}
        />
      </div>
      <div className="generate-resume-container">
        <div className="main-resume" ref={printRef}>
          <div className="top">
            <h1>{`${basicData.firstName} ${basicData.lastName}`}</h1>
            <div className="links">
              <div className="links-left">{`${basicData.email} | ${basicData.phone} | ${basicData.city}, ${basicData.country}`}</div>
              <div className="links-right">
                {<a href={basicData.linkedin}>LinkedIn</a>}
                {<a href={basicData.github}>{basicData.github}</a>}
              </div>
            </div>
          </div>
          <div className="experience-section">
            <h2 className="heading">Experience</h2>
            {experienceContents}
          </div>
          <div className="education-section">
            <h2 className="heading">Education</h2>
            {educationContents}
          </div>
          <div className="other-section">
            <h2 className="heading">Projects and Certifications</h2>
            {projectContents}
            <div className="certifications-section">{`Certifications: ${certifications}`}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateResume;
