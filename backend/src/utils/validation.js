// Utility function to validate poll options
const validatePollOptions = (options) => {
    if (!options || options.length < 2) {
      throw new Error("Poll must have at least two options.");
    }
    if (options.length > 10) {
      throw new Error("Poll cannot have more than 10 options.");
    }
    return true;
  };
  
  // Utility function to validate vote option
  const validateVoteOption = (option, validOptions) => {
    if (!validOptions.includes(option)) {
      throw new Error("Invalid vote option.");
    }
    return true;
  };
  
  module.exports = { validatePollOptions, validateVoteOption };
  