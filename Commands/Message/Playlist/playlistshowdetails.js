const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistshowdetails",
  aliases: ["pldetails", "plinfo"],
  description: `Show tracks in a playlist`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,
  run: async (client, message, args) => {
    const name = args.join(" ").trim();
    if (!name) return client.embed(message, `${client.config.emoji.ERROR} Provide a playlist name.`);
    const pl = await Store.get(client, message.guild.id, message.author.id, name);
    if (!pl) return client.embed(message, `${client.config.emoji.ERROR} Playlist not found.`);
    const lines = pl.tracks.slice(0, 25).map((t, i) => `\`${i + 1}.\` **${t.name}** ${t.formattedDuration ? `- \`${t.formattedDuration}\`` : ""}`);
    const more = pl.tracks.length > 25 ? `\n…and ${pl.tracks.length - 25} more` : "";
    const embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`Playlist: ${pl.name}`)
      .setDescription(lines.join("\n") + more)
      .setFooter(client.getFooter(message.author));
    return message.reply({ embeds: [embed] }).catch(() => {});
  },
};
