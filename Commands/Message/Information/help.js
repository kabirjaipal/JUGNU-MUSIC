const {
  ActionRowBuilder,
  Message,
  EmbedBuilder,
  SelectMenuBuilder,
  ComponentType
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "help",
  aliases: ["h", "cmds", "commands"],
  description: `need help ? see my all commands`,
  userPermissions: [],
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
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code

    const emoji = {
      Information: "🔰",
      Music: "🎵",
      Settings: "⚙️",
    };

    let allcommands = client.mcommands.size;
    let allguilds = client.guilds.cache.size;
    let botuptime = `<t:${Math.floor(
      Date.now() / 1000 - client.uptime / 1000
    )}:R>`;

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
          ...client.mcategories.map((cat) => {
            return {
              label: `${cat.toLocaleUpperCase()}`,
              value: cat,
              emoji: emoji[cat],
              description: `Click to See Commands of ${cat}`,
            };
          }),
        ]),
    ]);

    let help_embed = new MessageEmbed()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `** An advanced  Music System with Audio Filtering A unique Music Request System and way much more! **`
      )
      .addFields([{ 
        name: `Stats`, value:
        `>>> ** :gear: \`${allcommands}\` Commands \n :file_folder: \`${allguilds}\` Guilds \n ⌚️ ${botuptime} Uptime \n 🏓 \`${client.ws.ping}\` Ping \n  Made by [\` Tech Boy Development \`](https://discord.gg/PcUVWApWN3) **`
                  }])
      .setFooter(client.getFooter(message.author));

    let main_msg = await message.reply({
      embeds: [help_embed],
      components: [row],
    });

    let filter = (i) => i.user.id === message.author.id;
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
                  new MessageEmbed()
                    .setColor(client.config.embed.color)
                    .setTitle(
                      `${emoji[directory]} ${directory} Commands ${emoji[directory]}`
                    )
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(
                      `>>> ${client.mcommands
                        .filter((cmd) => cmd.category === directory)
                        .map((cmd) => {
                          return `\`${cmd.name}\``;
                        })
                        .join(" ' ")}`
                    )
                    .setFooter(client.getFooter(message.author)),
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
