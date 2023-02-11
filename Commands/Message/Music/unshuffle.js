const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "unshuffle",
  aliases: ["unsfl"],
  description: `unshuffle current shuffled queue`,
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
   * @param {JUGNU} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code
    if (!client.shuffleData.has(`shuffle-${queue.id}`)) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} No Suffled Queue Found !!`
      );
    } else {
      const shuffleData = client.shuffleData.get(`shuffle-${queue.id}`);
      queue.songs = [queue.songs[0], ...shuffleData];
      client.shuffleData.delete(`shuffle-${queue.id}`);
      client.embed(
        message,
        `${client.config.emoji.SUCCESS} UnSuffled ${queue.songs.length} Songs !!`
      );
    }
  },
};
