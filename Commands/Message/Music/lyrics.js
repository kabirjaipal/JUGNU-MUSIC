const { Message, EmbedBuilder } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
const findLyrics = require("simple-find-lyrics");
const { swap_pages } = require("../../../handlers/functions");

module.exports = {
  name: "lyrics",
  aliases: ["lr"],
  description: `Find Lyrics Of Current Song`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
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
    const { lyrics, title } = await findLyrics(song.name);

    let string = [];
    if (lyrics.length > 3000) {
      string.push(lyrics.substring(0, 3000));
      string.push(lyrics.substring(3000, Infinity));
    } else {
      string.push(lyrics);
    }

    console.log("String");
    console.log(string);

    let embeds = string.map((str) => {
      return new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setAuthor({ name: `Lyrics Of ${title}`, iconURL: song.thumbnail })
        .setDescription(`${str}`)
        .setFooter(client.getFooter(song.user));
    });

    console.log("Embeds");
    console.log(embeds);

    swap_pages(message, embeds);
  },
};
