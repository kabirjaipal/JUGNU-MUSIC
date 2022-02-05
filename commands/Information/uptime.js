const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const { MessageEmbed } = require("discord.js");
const emoji = require("../../settings/emoji.json");
const { duration } = require(`../../handlers/functions`);

module.exports = new Command({
  // options
  name: "uptime",
  description: `get uptime of bot`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["SEND_MESSAGES"],
  category: "Information",
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    interaction.followUp(
      `\`\`\`yml\n Uptime :- ${duration(client.uptime)
        .map((t) => `${t}`)
        .join(" , ")} \`\`\``
    );
  },
});
