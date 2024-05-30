//Get File Name From URL
const getFileName = (filePath) => {
  const parts = filePath.split("_");
  const fileName = parts[parts.length - 1];
  // Check if the file name length exceeds 20 characters
  if (fileName.length > 20) {
    return "..." + fileName.slice(-20);
  } else {
    return fileName;
  }
};

// Get File Path and strip uploads

const getFilePath = (filePath) => {
  filePath = filePath.replace("uploads//", "");
  return filePath;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/New_York", // EST time zone
    hour12: true, // 12-hour format
  });
};

module.exports = {
  getFileName,
  getFilePath,
  formatDate,
};
