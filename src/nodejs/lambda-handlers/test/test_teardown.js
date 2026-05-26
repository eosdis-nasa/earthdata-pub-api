module.exports = async () => {
  if (global.TESTCONTAINER) await global.TESTCONTAINER.stop();
};
