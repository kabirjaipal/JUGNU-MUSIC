const { Message, Client } = require("discord.js");

module.exports = {
  name: "8d",
  aliases: ["8d"],
  description: `set 8d filter in song`,
  userPermissions: ['CONNECT'],
  botPermissions: ['CONNECT'],
  category: "Filters",
  cooldown: 10,

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // code
    message.reply(`working`)
  },
};