const logInfo = (message) => {
    console.log(`[INFO]: ${message}`);
  };
  
  const logError = (message) => {
    console.error(`[ERROR]: ${message}`);
  };
  
  module.exports = { logInfo, logError };
  