const { Message, PermissionFlagsBits } = require("discord.js");
const BAUL = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "clearqueue",
  aliases: ["clq", "clearq"],
  description: `clear current queue of server`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  /**
   *
   * @param {BAUL} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code
    queue.remove();
    client.embed(message, `${client.config.emoji.SUCCESS} Queue Cleared !!`);
  },
};
