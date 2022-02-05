const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const { MessageEmbed } = require("discord.js");

module.exports = new Command({
  // options
  name: "dj",
  description: `setup DJ system in your server`,
  userPermissions: ["MANAGE_ROLES"],
  botPermissions: ["MANAGE_ROLES"],
  category: "Config",
  cooldown: 10,
  options: [
    {
      name: "set",
      description: `set dj role in server`,
      type: "SUB_COMMAND",
      options: [
        {
          name: "role",
          description: `mention a role for dj system`,
          type: "ROLE",
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: `remove dj role in server`,
      type: "SUB_COMMAND",
      options: [
        {
          name: "role",
          description: `mention a role for dj system`,
          type: "ROLE",
          required: true,
        },
      ],
    },
    {
      name: "show",
      description: `show all dj roles in server`,
      type: "SUB_COMMAND",
    },
    {
      name: "djonly",
      description: `show dj only in server`,
      type: "SUB_COMMAND",
    },
    {
      name: "reset",
      description: `reset all dj roles in server`,
      type: "SUB_COMMAND",
    },
  ],
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    let subcmd = interaction.options.getSubcommand();
    switch (subcmd) {
      case "set":
        {
          let role = interaction.options.getRole("role");
          client.settings.push(interaction.guild.id, role.id, "djroles");
          interaction.followUp(
            `>>> ** ${emoji.SUCCESS} Successfully Added ${role} As a DJ Role **`
          );
        }
        break;
      case "remove":
        {
          let role = interaction.options.getRole("role");
          client.settings.remove(interaction.guild.id, role.id, "djroles");
          interaction.followUp(
            `>>> ** ${emoji.SUCCESS} Successfully Added ${role} As a DJ Role **`
          );
        }
        break;
      case "show":
        {
          let djroleids = client.settings.get(interaction.guild.id, "djroles");
          if (djroleids === []) {
            return interaction.followUp(`>>> ** No DJ Role Setup Yet **`);
          } else {
            let data = [...djroleids];
            let string = await data.map((roleid, index) => {
              let role = interaction.guild.roles.cache.get(roleid);
              return `${role}`;
            });
            interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor(ee.color)
                  .setTitle(`** All DJroles Of ${interaction.guild.name} **`)
                  .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                  .setDescription(
                    `>>> ${
                      string.join(" ' ").substr(0, 3000) ||
                      `** No DJ Role Setup Yet **`
                    }`
                  )
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
              ],
            });
          }
        }
        break;
      case "djonly":
        {
          let data = await client.settings.get(interaction.guild.id, "djonly");
          if (data === false) {
            client.settings.set(interaction.guild.id, true, "djonly");
            return interaction.followUp(
              `** ${emoji.SUCCESS} DJonly Enabled **`
            );
          } else if (data === true) {
            client.settings.set(interaction.guild.id, false, "djonly");
            return interaction.followUp(
              `** ${emoji.SUCCESS} DJonly Disabled **`
            );
          }
        }
        break;
      case "reset":
        {
          let data = await client.settings.get(interaction.guild.id, "djroles");
          client.settings.delete(interaction.guild.id, "djroles");
          if (data === []) {
            interaction.followUp(`** ${emoji.ERROR} Not Found DJ Role **`);
          } else {
            interaction.followUp(
              `** ${emoji.SUCCESS} Successfully Deleted all DJ Roles **`
            );
          }
        }
        break;
      default:
        break;
    }
  },
});
