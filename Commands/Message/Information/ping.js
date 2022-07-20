const { Message } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ping",
  aliases: ["latency"],
  description: `get ping of bot`,
  userPermissions: ['SendMessages'],
  botPermissions: ['EmbedLinks'],
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code
    client.embed(message, `Ping :: \`${client.ws.ping}\``);
  },
};
