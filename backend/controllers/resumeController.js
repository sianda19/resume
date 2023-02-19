const Resume = require("../model/Resume");

const handleSaveNewResume = async (req, res) => {
  const user = req.user; // Received from verifyJWT middleware
  const data = req.body;
  if (!data) {
    return res.status(400).json({
      error: "No data provided",
    });
  }
  if (!data.resumeTitle) {
    return res.status(400).json({ error: "Resume title not provided" });
  }

  const {
    basicData,
    workData,
    educationData,
    technologiesData,
    certificationsData,
  } = data;

  try {
    // Create and store the resume data
    await Resume.create({
      username: user,
      resumeTitle: data.resumeTitle,
      basicData: basicData ? basicData : [],
      workData: workData ? workData : [],
      educationData: educationData ? educationData : [],
      technologiesData: technologiesData ? technologiesData : [],
      certificationsData: certificationsData ? certificationsData : [],
    });

    res.status(201).json({ success: `Resume data stored successfully` });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const handleModifyResume = async (req, res) => {
  const user = req.user; // Received from verifyJWT middleware
  const data = req.body;
  if (!data) {
    return res.status(400).json({
      error: "No data provided",
    });
  }

  const foundResume = await Resume.findOne({
    username: user,
    resumeTitle: data.resumeTitle,
  }).exec();
  if (!foundResume) {
    return res.status(204).json({
      error: `No data matches resume title ${data.resumeTitle} for user ${user}`,
    });
  }

  const {
    basicData,
    workData,
    educationData,
    technologiesData,
    certificationsData,
  } = data;

  try {
    // Modify the fields only if the data provided by user is not undefined
    if (basicData) foundResume.basicData = basicData;
    if (workData) foundResume.workData = workData;
    if (educationData) foundResume.educationData = educationData;
    if (technologiesData) foundResume.technologiesData = technologiesData;
    if (certificationsData) foundResume.certificationsData = certificationsData;
    await foundResume.save();

    res.status(201).json({ success: `Resume data stored successfully` });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const handleFetchSavedResume = async (req, res) => {
  const user = req.user; // Received from verifyJWT middleware
  const resumeTitle = req.params.title;
  if (!resumeTitle)
    return res.status(400).json({ error: "Resume title not provided" });
  const resumeData = await Resume.findOne({
    username: user,
    resumeTitle,
  }).exec();
  if (!resumeData) {
    return res
      .status(204)
      .json({ message: `No resume with a title ${resumeTitle} found in DB` });
  }
  res.status(200).json(resumeData);
};

const handleFetchAllResumeTitles = async (req, res) => {
  const user = req.user; // Received from verifyJWT middleware
  const resumeTitles = await Resume.find(
    {
      username: user,
    },
    { resumeTitle: 1 }
  ).exec();
  if (!resumeTitles) {
    return res.status(204).json([]);
  }
  res.status(200).json(resumeTitles);
};

module.exports = {
  handleSaveNewResume,
  handleModifyResume,
  handleFetchSavedResume,
  handleFetchAllResumeTitles,
};
