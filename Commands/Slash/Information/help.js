const {
  CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  ComponentType
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "help",
  description: `need help ? here is my all commands`,
  userPermissions: ["SendMessages"],
  botPermissions: ["EmbedLinks"],
  category: "Information",
  cooldown: 5,
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
    const emoji = {
      Information: "🔰",
      Music: "🎵",
      Settings: "⚙️",
    };

    let allcommands = client.commands.size;
    let allguilds = client.guilds.cache.size;
    let botuptime = `<t:${Math.floor(
      Date.now() / 1000 - client.uptime / 1000
    )}:R>`;

    console.log( )

    const options = []
    client.scategories.map((cat) => {
           options.push({
              label: `${cat.toLocaleUpperCase()}`,
              value: cat,
              emoji: emoji[cat],
              description: `Click to See Commands of ${cat}`,
            })
          })

    const row = new ActionRowBuilder().addComponents([
      new SelectMenuBuilder()
        .setCustomId("help-menu")
        .setPlaceholder(`Click to see my all Category`)
        .addOptions([
          {
            label: `Home`,
            value: "home",
            emoji: `🏘️`,
            description: `Click to Go On HomePage`,
          },
          ...client.scategories.map((cat) => {
            return {
              label: `${cat.toLocaleUpperCase()}`,
              value: cat,
              emoji: emoji[cat],
              description: `Click to See Commands of ${cat}`,
            };
          }),
        ]),
    ]);

    let help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(
        `** An advanced  Music System with Audio Filtering A unique Music Request System and way much more! **`
      )
      .addFields([{
        name:`Stats`,
        value: `>>> ** :gear: \`${allcommands}\` Commands \n :file_folder: \`${allguilds}\` Guilds \n ⌚️ ${botuptime} Uptime \n 🏓 \`${client.ws.ping}\` Ping \n  Made by [\` Tech Boy Development \`](https://discord.gg/PcUVWApWN3) **`
      }])
      .setFooter(client.getFooter(interaction.user));

    let main_msg = await interaction.followUp({
      embeds: [help_embed],
      components: [row],
    });

    let filter = (i) => i.user.id === interaction.user.id;
    const collector = await main_msg.createMessageComponentCollector({
      filter: filter,
      time: 20000,
      componentType: ComponentType.SelectMenu
    });
    
    collector.on("collect", async (i) => {
        await i.deferUpdate().catch((e) => {});
        if (i.customId === "help-menu") {
          let [directory] = i.values;
          if (directory == "home") {
            main_msg.edit({ embeds: [help_embed] }).catch((e) => {});
          } else {
            main_msg
              .edit({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.embed.color)
                    .setTitle(
                      `${emoji[directory]} ${directory} Commands ${emoji[directory]}`
                    )
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription(
                      `>>> ${client.commands
                        .filter((cmd) => cmd.category === directory)
                        .map((cmd) => {
                          return `\`${cmd.name}\``;
                        })
                        .join(" ' ")}`
                    )
                    .setFooter(client.getFooter(interaction.user)),
                ],
              })
              .catch((e) => null);
          }
        }
    });

    collector.on("end", async (c, i) => {
      row.components.forEach((c) => c.setDisabled(true));
      main_msg.edit({ components: [row] }).catch((e) => {});
    });
  },
};
