/**
 * @type {import("../../../index.js").Mcommand}
 */
export default {
  name: "",
  description: "",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,

  run: async ({ client, message, args, prefix, player }) => {
    // Code
  },
};
