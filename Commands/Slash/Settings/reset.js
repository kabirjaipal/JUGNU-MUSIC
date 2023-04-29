const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const BAUL = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "reset",
  description: `reset bot to default settings`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Settings",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {BAUL} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    await client.music.delete(interaction.guildId);
    client.embed(interaction, `${client.config.emoji.SUCCESS} Reseted Done !!`);
  },
};
