const { request, response } = require('express')

module.exports = {
  name: "/",

  /**
   *
   * @param {request} req
   * @param {response} res
   */
  run: async (req, res) => {
    res.render("Home",{
      name : "Kabir"
    })
  },
};
