const { Message, PermissionFlagsBits, Colors } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ping",
  aliases: ["latancy"],
  description: `get ping of bot`,
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
    // Code
    const startTime = Date.now();

    const tempMessage = await message.reply({
      embeds: [
        {
          description: "Pinging...",
          color: Colors.Blurple,
        },
      ],
    });

    const messageLatency =
      tempMessage.createdTimestamp - message.createdTimestamp;
    const serverLatency = Math.round(messageLatency / 2);
    const apiLatency = Math.round(client.ws.ping);
    const botLatency = Date.now() - startTime;

    await tempMessage.edit({
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
