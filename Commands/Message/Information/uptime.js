const { Message } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "uptime",
  aliases: ["up"],
  description: `see when bot comes online`,
  userPermissions: ['SEND_MESSAGES'],
  botPermissions: ['EMBED_LINKS'],
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
    client.embed(message, `Uptime :: <t:${Math.floor(Date.now() / 1000 - client.uptime / 1000)}:R>`);
  },
};
