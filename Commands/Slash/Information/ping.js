const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  Colors,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ping",
  description: `get ping of bot`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Information",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    return await interaction.followUp({
      embeds: [
        {
          description: `Pong \`${client.ws.ping}\``,
          color: Colors.Blurple,
        },
      ],
      ephemeral: true,
    });
  },
};
