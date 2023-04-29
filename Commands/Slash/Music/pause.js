const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const BAUL = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "pause",
  description: `pause current song in queue`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  /**
   *
   * @param {BAUL} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    if (!queue.paused) {
      queue.pause();
      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} Queue Paused !!`
      );
    } else {
      client.embed(
        interaction,
        `${client.config.emoji.ERROR} Queue already Paused !!`
      );
    }
  },
};
