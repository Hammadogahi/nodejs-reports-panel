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
  filePath = filePath.replace("uploads\\", "");
  return filePath;
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

module.exports = {
  getFileName,
  getFilePath,
  formatDate,
};
