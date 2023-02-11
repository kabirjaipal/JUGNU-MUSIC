const {
  CommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "filter",
  description: `set filters in current queue`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,
  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    const filters = Object.keys(client.config.filters);

    const row = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
        .setCustomId("filter-menu")
        .setPlaceholder("Click To Select Filter ..")
        .addOptions(
          [
            {
              label: `Off`,
              description: `Click to Disable Filter`,
              value: "off",
            },
            filters
              .filter((_, index) => index <= 22)
              .map((value) => {
                return {
                  label: value.toLocaleUpperCase(),
                  description: `Click to Set ${value} Filter`,
                  value: value,
                };
              }),
          ].flat(Infinity)
        ),
    ]);

    let msg = await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setTitle(`Select To Enable Filters ...`)
          .setFooter(client.getFooter(interaction.user))
          .setDescription(
            `> Click on below dropdown Menu and Select a Filter To Add Filter in Queue !!`
          ),
      ],
      components: [row],
      fetchReply: true,
    });
    const collector = await msg.createMessageComponentCollector({
      // filter: (i) => i.user.id === message.author.id,
      time: 60000 * 10,
    });
    collector.on("collect", async (menu) => {
      if (menu.isStringSelectMenu()) {
        await menu.deferUpdate().catch((e) => {});
        if (menu.customId === "filter-menu") {
          if (menu.user.id !== interaction.user.id) {
            return menu.followUp({
              content: `You are not author of this interaction`,
              ephemeral: true,
            });
          }
          let filter = menu.values[0];
          if (filter === "off") {
            queue.filters.clear();
            menu.followUp({
              content: `${client.config.emoji.SUCCESS} Queue Filter Off !!`,
              ephemeral: true,
            });
          } else {
            if (queue.filters.has(filter)) {
              queue.filters.remove(filter);
            } else {
              queue.filters.add(filter);
            }
            menu.followUp({
              content: `${
                client.config.emoji.SUCCESS
              } | Current Queue Filter: \`${queue.filters.names.join(", ")}\``,
              ephemeral: true,
            });
          }
        }
      }
    });
  },
};
