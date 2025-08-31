const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const Store = require("../../../handlers/PlaylistStore");
const JUGNU = require("../../../handlers/Client");

module.exports = {
  name: "playlistcreate",
  description: `Create a new playlist`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  type: ApplicationCommandType.ChatInput,
  options: [
    { name: "name", description: "Playlist name", type: ApplicationCommandOptionType.String, required: true },
  ],
  run: async (client, interaction) => {
    const name = interaction.options.getString("name");
    await Store.create(client, interaction.guild.id, interaction.user.id, name);
    return client.embed(interaction, `${client.config.emoji.SUCCESS} Created playlist \`${name}\`.`);
  },
};
