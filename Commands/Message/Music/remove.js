const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "remove",
  aliases: ["rem", "remsong"],
  description: `remove a song from current queue`,
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
    try {
      let songIndex = Number(args[0]);

      if (
        !songIndex ||
        isNaN(songIndex) ||
        songIndex < 1 ||
        songIndex > queue.songs.length
      ) {
        return client.embed(message, "Please provide a valid song index.");
      }

      let removedTrack = queue.songs.splice(songIndex - 1, 1)[0];
      if (!removedTrack) {
        return client.embed(
          message,
          "Failed to remove the track from the queue."
        );
      }

      client.embed(
        message,
        `${client.config.emoji.SUCCESS} Removed \`${client.getTitle(
          removedTrack
        )}\` From the Queue !!`
      );
    } catch (error) {
      console.error(error);
      client.embed(
        message,
        `${client.config.emoji.ERROR} An error occurred: ${error.message}`
      );
    }
  },
};
