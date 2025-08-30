const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");

module.exports = {
  name: "hqmode",
  description: "Toggle high-quality passthrough mode (avoids re-encoding).",
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Settings",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const key = `${interaction.guildId}.hqmode`;
    const current = (await client.music.get(key)) ?? false;
    const next = !current;
    await client.music.set(key, next);
    return client.embed(
      interaction,
      `${client.config.emoji.SUCCESS} High-Quality mode is now ${next ? "Enabled" : "Disabled"}.`
    );
  },
};
