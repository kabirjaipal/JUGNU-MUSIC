const { CommandInteraction , MessageEmbed } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "help",
  description: `need help ? here is my all commands`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["EMBED_LINKS"],
  category: "Information",
  cooldown: 5,
  type: "CHAT_INPUT",
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
    let commands = client.scategories.map((dir) => {
      let cmds = client.commands
        .filter((cmd) => cmd.category === dir)
        .map((cmd) => `\`${cmd.name}\``)
        .join(" ");
      return {
        name: `** ${dir.toLocaleUpperCase()} **`,
        value: cmds || `Working`,
      };
    });

    interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor(client.config.embed.color)
          .setAuthor({
            name: `My Commands`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .addFields(commands)
          .setFooter(client.getFooter(interaction.user)),
      ],
    });
  },
};
