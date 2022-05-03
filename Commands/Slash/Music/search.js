const { CommandInteraction , MessageActionRow , MessageSelectMenu , MessageEmbed} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
const { numberEmojis } = require("../../../settings/config");

module.exports = {
  name: "search",
  description: `search a song by name`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,
  options: [
    {
      name: "song",
      description: `give song url/name to play`,
      type: "STRING",
      required: true,
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
    let query = interaction.options.getString("song");
    let res = await client.distube.search(query, {
      limit: 10,
      retried: true,
      safeSearch: true,
      type: "video",
    });
    let tracks = res
      .map((song, index) => {
        return `\`${index + 1}\`) [\`${song.name}\`](${song.url}) \`[${
          song.formattedDuration
        }]\``;
      })
      .join("\n\n");

      let embed = new MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle(`\`${query}\` Search Results`)
      .setDescription(tracks.substring(0, 3800))
    //   .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter(client.getFooter(interaction.user));

    let menuraw = new MessageActionRow().addComponents([
      new MessageSelectMenu()
        .setCustomId("search")
        .setPlaceholder(`Click to See Best Songs`)
        .addOptions(
          res.map((song, index) => {
            return {
              label: song.name.substring(0, 50),
              value: song.url,
              description: `Click to Play Song`,
              emoji: numberEmojis[index + 1],
            };
          })
        ),
    ]);

    interaction.followUp({ embeds: [embed], components: [menuraw] }).then(async(msg)  => {
        let filter = (i) => i.user.id === interaction.member.id;
        let collector = await msg.createMessageComponentCollector({
          filter: filter,
        });
        const { channel } = interaction.member.voice;
        collector.on("collect", async (interaction) => {
          if (interaction.isSelectMenu()) {
            await interaction.deferUpdate().catch((e) => {});
            if (interaction.customId === "search") {
              let song = interaction.values[0];
              client.distube.play(channel, song, {
                member: interaction.member,
                textChannel: interaction.channel,
              });
            }
          }
        });
    })
  },
};
