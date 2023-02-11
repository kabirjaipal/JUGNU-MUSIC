const {
  CommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "dj",
  description: `DJ System`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageGuild,
  category: "Settings",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,
  options: [
    {
      name: "enable",
      description: `enable dj system in your server`,
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: `mention a role for dj system`,
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "disable",
      description: `disable dj system in your server`,
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "commands",
      description: `show all dj slash commands`,
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    let options = interaction.options.getSubcommand();
    switch (options) {
      case "enable":
        {
          let role = interaction.options.getRole("role");
          await client.music.set(`${interaction.guild.id}.djrole`, role.id);
          client.embed(
            interaction,
            `${client.config.emoji.SUCCESS} ${role} Role Added to DJ Role`
          );
        }
        break;
      case "disable":
        {
          await client.music.set(`${interaction.guild.id}.djrole`, null);
          client.embed(
            interaction,
            `${client.config.emoji.SUCCESS} DJ System Disabled`
          );
        }
        break;
      case "commands":
        {
          const djcommands = client.commands
            .filter((cmd) => cmd?.djOnly)
            .map((cmd) => cmd.name)
            .join(", ");

          client.embed(
            interaction,
            `**DJ Commands** \n \`\`\`js\n${djcommands}\`\`\``
          );
        }
        break;

      default:
        break;
    }
  },
};
