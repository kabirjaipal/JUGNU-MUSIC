const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistshowplaylists",
  aliases: ["pllist", "plshow"],
  description: `List your playlists`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,
  run: async (client, message) => {
    const all = await Store.getAll(client, message.guild.id, message.author.id);
    const names = Object.keys(all);
    if (!names.length) return client.embed(message, `${client.config.emoji.ERROR} You have no playlists yet.`);
    const embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`${message.author.username}'s Playlists`)
      .setDescription(names.map((n) => `• ${n} (${all[n].length} tracks)`).join("\n"))
      .setFooter(client.getFooter(message.author));
    return message.reply({ embeds: [embed] }).catch(() => {});
  },
};
