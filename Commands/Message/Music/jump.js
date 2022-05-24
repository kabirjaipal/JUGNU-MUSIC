const { Message } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "jump",
  aliases: ["jmp", "jp"],
  description: `jump to a song in queue by index`,
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
    let index = Number(args[0]);
    if (!index) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Please Provide Song Index`
      );
    }
    let song = queue.songs[index];
    if (index > queue.songs.length - 1 || index < 0) {
      return client.embed(
        message,
        `${
          client.config.emoji.ERROR
        } **The Position must be between \`0\` and \`${
          queue.songs.length - 1
        }\`!**`
      );
    } else {
      queue.jump(index).then((q) => {
        client.embed(
          message,
          `** ${client.config.emoji.SUCCESS} Jumped to The Song [\`${song.name}\`](${song.url}) **`
        );
      });
    }
  },
};
