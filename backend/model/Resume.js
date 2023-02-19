const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resumeSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  resumeTitle: {
    type: String,
    required: true,
  },
  basicData: {
    firstName: String,
    lastName: String,
    profession: String,
    city: String,
    country: String,
    pincode: String,
    phone: String,
    email: String,
    github: String,
    linkedin: String,
    twitter: String,
  },
  workData: [
    {
      id: Number,
      jobTitle: String,
      employer: String,
      city: String,
      country: String,
      startDate: String,
      endDate: String,
      jobDescription: String,
    },
  ],
  educationData: [
    {
      id: Number,
      schoolName: String,
      schoolLocation: String,
      degree: String,
      fieldOfStudy: String,
      startDate: String,
      endDate: String,
      eduDescription: String,
    },
  ],
  technologiesData: [
    {
      id: Number,
      technology: String,
      project: String,
      demoLink: String,
      repoLink: String,
      additionalDetails: String,
    },
  ],
  certificationsData: [
    {
      id: Number,
      certificateTitle: String,
      certifyingOrg: String,
    },
  ],
});

module.exports = mongoose.model("Resume", resumeSchema);
