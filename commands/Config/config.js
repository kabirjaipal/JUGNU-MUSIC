const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const { MessageEmbed } = require("discord.js");
const emoji = require("../../settings/emoji.json");

module.exports = new Command({
  // options
  name: "config",
  description: `see config of current server`,
  userPermissions: ["MANAGE_GUILD"],
  botPermissions: ["MANAGE_GUILD"],
  category: "Config",
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    let settings = client.settings.get(interaction.guild.id);
    let djcmds = client.commands
      .filter((cmd) => cmd.DJ === true)
      .map((cmd) => `\`${cmd.name}\``)
      .join(" ' ");

    let embed = new MessageEmbed()
      .setColor(ee.color)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setAuthor({
        name: `${interaction.guild.name} Config`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(`>>> ** ${client.user.username} Best Music Bot Eveer **`)
      .addFields([
        {
          name: `${emoji.ping} Prefix`,
          value: `>>> \`${prefix}\``,
          inline: true,
        },
        {
          name: `${emoji.dj} DJ Mode`,
          value: `>>> \`${
            settings.djroles ? `${emoji.enabled}` : `${emoji.disabled}`
          }\``,
          inline: true,
        },
        {
          name: `${emoji.setup} DJ Commands`,
          value: `>>> \`\`\`yml\n ${djcmds} \`\`\``,
        },
      ])
      .setFooter({ text: ee.footertext, iconURL: ee.footericon });

      interaction.followUp({embeds : [embed]})
  },
});
