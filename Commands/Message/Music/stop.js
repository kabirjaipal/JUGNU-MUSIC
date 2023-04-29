const { Message, PermissionFlagsBits } = require("discord.js");
const BAUL = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "stop",
  aliases: ["st", "destroy"],
  description: `destroy current queue of server`,
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
    queue.stop();
    client.embed(message, `${client.config.emoji.SUCCESS} Queue Destroyed !!`);
  },
};
