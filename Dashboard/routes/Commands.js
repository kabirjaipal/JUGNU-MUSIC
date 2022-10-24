const { request, response } = require("express");

module.exports = {
  name: "/commands",

  /**
   *
   * @param {request} req
   * @param {response} res
   */
  run: async (req, res) => {
    res.render("Commands", {
      commands: [
        {
          name: "ping",
          description: "pong",
        },
        {
          name: "help",
          description: "haha help",
        },
      ],
    });
  },
};
