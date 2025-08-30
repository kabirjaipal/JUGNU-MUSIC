const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");

module.exports = {
  name: "hqmode",
  aliases: ["highquality", "hq"],
  description: "Toggle high-quality passthrough mode (avoids re-encoding).",
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   * @param {JUGNU} client
   * @param {Message} message
   */
  run: async (client, message) => {
    const key = `${message.guildId}.hqmode`;
    const current = (await client.music.get(key)) ?? false;
    const next = !current;
    await client.music.set(key, next);
    return client.embed(
      message,
      `${client.config.emoji.SUCCESS} High-Quality mode is now ${next ? "Enabled" : "Disabled"}.`
    );
  },
};
