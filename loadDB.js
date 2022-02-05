const Enmap = require("enmap");
module.exports = (client) => {
  client.settings = new Enmap({
    name: "settings",
    dataDir: "./Database/Settings",
  });
};
