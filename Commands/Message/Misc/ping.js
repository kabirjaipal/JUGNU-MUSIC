/**
 * @type {import("../../../index.js").Mcommand}
 */
export default {
  name: "ping",
  description: "Check the bot's latency.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Misc",
  cooldown: 5,

  run: async ({ client, message, args, prefix }) => {
    // Code
    await client.sendEmbed(message, `🏓 Pong \`${client.ws.ping}\``);
  },
};
