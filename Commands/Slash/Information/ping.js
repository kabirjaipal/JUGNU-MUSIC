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
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const startTime = Date.now();

    const tempMessage = await interaction.followUp({
      embeds: [
        {
          description: "Pinging...",
          color: Colors.Blurple,
        },
      ],
    });

    const messageLatency =
      tempMessage.createdTimestamp - interaction.createdTimestamp;
    const serverLatency = Math.round(messageLatency / 2);
    const apiLatency = Math.round(client.ws.ping);
    const botLatency = Date.now() - startTime;

    await interaction.editReply({
      embeds: [
        {
          title: "Pong! 🏓",
          description: `Bot Latency: \`${formatMilliseconds(
            botLatency
          )}\`\nMessage Latency: \`${formatMilliseconds(
            messageLatency
          )}\`\nServer Latency: \`${formatMilliseconds(
            serverLatency
          )}\`\nDiscord API Latency: \`${formatMilliseconds(apiLatency)}\``,
          color: Colors.Blurple,
        },
      ],
    });
  },
};

// Function to format milliseconds into a human-readable string
function formatMilliseconds(ms) {
  return `${ms}ms`;
}
