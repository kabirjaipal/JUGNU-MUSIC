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
  description: `Get the bot's ping and latency information`,
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
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    const startTime = Date.now();

    // Send an initial message to calculate latencies
    const tempMessage = await interaction.followUp({
      embeds: [
        {
          description: "🔍 **Calculating ping...**",
          color: Colors.Blurple,
          footer: { text: "Please wait a moment..." },
        },
      ],
    });

    // Calculating latencies
    const messageLatency =
      tempMessage.createdTimestamp - interaction.createdTimestamp; // Message latency
    const botLatency = Date.now() - startTime; // Bot processing latency
    const apiLatency = Math.max(Math.round(client.ws.ping), 0); // Ensure no negative API latency
    const totalLatency = botLatency + apiLatency; // Total latency

    // Edit the initial reply with latency details
    await interaction.editReply({
      embeds: [
        {
          title: "🏓 **Pong!**",
          description: "Here are the latency details:",
          color: Colors.Gold,
          fields: [
            {
              name: "🤖 **Bot Latency**",
              value: `\`${formatMilliseconds(botLatency)}\``,
              inline: true,
            },
            {
              name: "💬 **Message Latency**",
              value: `\`${formatMilliseconds(messageLatency)}\``,
              inline: true,
            },
            {
              name: "📡 **API Latency**",
              value: `\`${formatMilliseconds(apiLatency)}\``,
              inline: true,
            },
            {
              name: "🌍 **Total Round-Trip Latency**",
              value: `\`${formatMilliseconds(totalLatency)}\``,
              inline: false,
            },
          ],
          thumbnail: {
            url: "https://i.imgur.com/AfFp7pu.png", // Thumbnail image URL
          },
          footer: {
            text: "Bot status: Online ⚡ | All pings measured in milliseconds (ms)",
            icon_url: client.user.displayAvatarURL(),
          },
          timestamp: new Date(), // Adds timestamp of when the ping was measured
        },
      ],
    });
  },
};

// Function to format milliseconds into a readable string
function formatMilliseconds(ms) {
  return `${ms}ms`;
}
