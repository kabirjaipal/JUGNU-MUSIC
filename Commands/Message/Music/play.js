const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "play",
  aliases: ["p", "song"],
  description: `play your fav by Name/Link`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
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
    const song = args.join(" ");

    if (!song) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Please provide a song name or link.`
      );
    } else {
      let { channel } = message.member.voice;
      await client.distube.play(channel, song, {
        member: message.member,
        textChannel: message.channel,
        message: message,
      });

      await message.delete().catch((err) => {});
    }
  },
};
