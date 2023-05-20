const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const BAUL = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "ping",
  description: "Get the ping of the bot",
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
   * @param {BAUL} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Calculate the API latency
    const apiLatency = Math.round(client.ws.ping);

    // Get the current timestamp
    const timestamp = Date.now();

    // Calculate the overall latency
    const overallLatency = timestamp - interaction.createdTimestamp;

    // Send the response with the ping information
    client.embed(
      interaction,
      `API Latency: \`${apiLatency}ms\`\nOverall Latency: \`${overallLatency}ms\``
    );
  },
};
