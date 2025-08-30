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
      const hqStored = await client.music.get(`${message.guildId}.hqmode`);
      const hqMode =
        (hqStored === undefined ? process.env.HQ_MODE === "true" : hqStored) ||
        false;
      // Pre-join voice to parallelize Discord voice handshake with search/resolve
      try {
        await client.distube.voices.join(channel);
      } catch {}
      // If not a URL, use yt-dlp single-result search for faster resolution
      const isURL = /^(https?:\/\/)/i.test(song);
      const query = isURL ? song : `ytsearch1:${song}`;
      await client.distube.play(channel, query, {
        member: message.member,
        textChannel: message.channel,
        message: message,
        // Keep transforms off in HQ mode for Opus passthrough where possible
        // (Filters/volume adjustments force re-encode)
        // DisTube handles format selection internally; HQ_MODE is a hint not to alter audio
        // You can still toggle filters separately via existing commands
        // eslint-disable-next-line no-unused-vars
        ...(hqMode ? { volume: 100 } : {}),
      });

      await message.delete().catch((err) => {});
    }
  },
};
