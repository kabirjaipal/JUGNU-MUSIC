const { Message, Client } = require("discord.js");

module.exports = {
  name: "setup",
  aliases: ["setupmusic"],
  description: `setup music system in server`,
  userPermissions: ['MANAGE_GUILD'],
  botPermissions: ['MANAGE_GUILD'],
  category: "Config",
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