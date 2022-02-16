const { Message, Client } = require("discord.js");

module.exports = {
  name: "play",
  aliases: ["p", "song"],
  description: `play your fav song`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 2,

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // code
    message.reply(`working`);
  },
};
