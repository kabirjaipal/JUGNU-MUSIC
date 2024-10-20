const { Message, PermissionFlagsBits, Colors } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ping",
  aliases: ["latency"],
  description: `Get the bot's ping and latency information`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Get the timestamp at the start to calculate bot latency later
    const startTime = Date.now();

    // Send a temporary message to calculate message and round-trip latency
    const tempMessage = await message.reply({
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
      tempMessage.createdTimestamp - message.createdTimestamp; // Message latency (time between send & receive)
    const botLatency = Date.now() - startTime; // Bot processing latency (time for bot to reply)
    const apiLatency = Math.round(client.ws.ping); // WebSocket (API) latency
    const totalLatency = botLatency + apiLatency;

    // Update the temp message with actual latency information
    await tempMessage.edit({
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
            url: "https://i.imgur.com/AfFp7pu.png", // You can add a custom thumbnail URL for aesthetic purposes
          },
          footer: {
            text: "Bot status: Online ⚡ | All pings measured in milliseconds (ms)",
            icon_url: client.user.displayAvatarURL(), // Shows the bot's avatar in the footer
          },
          timestamp: new Date(), // Adds a timestamp of when the ping was measured
        },
      ],
    });
  },
};

// Function to format milliseconds into a readable string
function formatMilliseconds(ms) {
  return `${ms}ms`;
}
