const { Message } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "remove",
  aliases: ["rem", "remsong"],
  description: `remove a song from current queue`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
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
    let songIndex = Number(args[0]);
    if (!songIndex) {
      return client.embed(
        message,
        `** ${
          client.config.emoji.ERROR
        } Please Provide Song Index Between \`0\`-\`${
          queue.songs.length - 1
        }\`**`
      );
    } else if (songIndex === 0) {
      return client.embed(
        message,
        `** ${client.config.emoji.ERROR} You can't Remove Current Song **`
      );
    } else {
      let track = queue.songs[songIndex];
      queue.songs.splice(track, track + 1);
      client.embed(
        message,
        `${client.config.emoji.SUCCESS} Removed \`${track.name}\` Song From Queue !!`
      );
    }
  },
};
