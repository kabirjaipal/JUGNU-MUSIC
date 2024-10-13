import { ApplicationCommandType } from "discord.js";

/**
 * @type {import("../../../index.js").Scommand}
 */
export default {
  name: "",
  description: "",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "",
  type: ApplicationCommandType.ChatInput,

  run: async ({ client, interaction }) => {
    // Code
  },
};
