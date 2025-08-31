const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistrename",
  description: `Rename one of your playlists`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  type: ApplicationCommandType.ChatInput,
  options: [
    { name: "old", description: "Current playlist name", type: ApplicationCommandOptionType.String, required: true, autocomplete: true },
    { name: "new", description: "New playlist name", type: ApplicationCommandOptionType.String, required: true },
  ],
  run: async (client, interaction) => {
    const oldName = interaction.options.getString("old");
    const newName = interaction.options.getString("new");
    const ok = await Store.rename(client, interaction.guild.id, interaction.user.id, oldName, newName);
    if (!ok) return client.embed(interaction, `${client.config.emoji.ERROR} Playlist not found or target name exists.`);
    return client.embed(interaction, `${client.config.emoji.SUCCESS} Renamed \`${oldName}\` to \`${newName}\`.`);
  },
  autocomplete: async (client, interaction) => {
    const focused = interaction.options.getFocused()?.toLowerCase?.() || "";
    const alls = await Store.getAll(client, interaction.guild.id, interaction.user.id);
    const choices = alls.map(p => p.name).filter(Boolean);
    const filtered = choices.filter(c => c.toLowerCase().includes(focused)).slice(0, 25);
    await interaction.respond(filtered.map(n => ({ name: n, value: n })));
  }
};
