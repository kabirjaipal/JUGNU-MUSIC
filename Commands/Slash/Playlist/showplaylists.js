const { ApplicationCommandType, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistshowplaylists",
  description: `List your playlists`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    const all = await Store.getAll(client, interaction.guild.id, interaction.user.id);
    const names = Object.keys(all);
    if (!names.length) return client.embed(interaction, `${client.config.emoji.ERROR} You have no playlists yet.`);
    const embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`${interaction.user.username}'s Playlists`)
      .setDescription(names.map((n) => `• ${n} (${all[n].length} tracks)`).join("\n"))
      .setFooter(client.getFooter(interaction.user));
    return interaction.followUp({ embeds: [embed] });
  },
};
