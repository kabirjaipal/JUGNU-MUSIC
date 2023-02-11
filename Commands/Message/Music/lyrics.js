const { Message, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
const findLyrics = require("simple-find-lyrics");
const { swap_pages } = require("../../../handlers/functions");

module.exports = {
  name: "lyrics",
  aliases: ["lr"],
  description: `Find Lyrics Of Current Song`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
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
    let song = queue.songs[0];
    let songname = song.name.substring(0, 20);
    const { lyrics } = await findLyrics(songname);

    let string = [];
    if (lyrics.length > 3000) {
      string.push(lyrics.substring(0, 3000));
      string.push(lyrics.substring(3000, Infinity));
    } else {
      string.push(lyrics);
    }

    if (!lyrics)
      return client.embed(message, `No Lyrics Found For \`${songname}\``);

    let embeds = string.map((str) => {
      return new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setAuthor({ name: `Lyrics Of ${songname}`, iconURL: song.thumbnail })
        .setDescription(`${str || `No Lyrics Found For \`${songname}\``}`)
        .setFooter(client.getFooter(song.user));
    });

    swap_pages(message, embeds);
  },
};
