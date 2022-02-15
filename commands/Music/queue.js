const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const player = require("../../handlers/player");
const { swap_pages } = require("../../handlers/functions");
const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

module.exports = new Command({
  // options
  name: "queue",
  description: `see queue`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    let channel = interaction.member.voice.channel;
    let queue = await player.getQueue(interaction.guild.id);
    if (!channel) {
      return interaction.followUp(
        `** ${emoji.ERROR} You Need to Join Voice Channel first **`
      );
    } else if (!queue) {
      return interaction.followUp(`** ${emoji.ERROR} Nothing Playing Now **`);
    } else {
      let tracks = queue.songs;
      let quelist = [];
      var maxTracks = 10; //tracks / Queue Page
      for (let i = 0; i < tracks.length; i += maxTracks) {
        let songs = tracks.slice(i, i + maxTracks);
        quelist.push(
          songs
            .map(
              (track, index) =>
                `**\` ${i + ++index}. \` [${track.name.substr(0, 60)}](${
                  track.url
                })** - \`${track.formattedDuration}\`\n> *Requested by: __${
                  track.user
                }__*`
            )
            .join(`\n`)
        );
      }

      let embeds = [];
      let theSongs = queue.songs;
      let limit = quelist.length;
      if (theSongs.length < 10) {
        for (let i = 0; i < limit; i++) {
          let desc = String(quelist[i]).substr(0, 2048);
          return interaction.followUp({
            embeds: [
              new MessageEmbed()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(
                  `Queue of ${interaction.guild.name} ${theSongs.length} Songs`
                )
                .setDescription(
                  `${
                    desc || `** There are ${theSongs.length} Songs in Queue **`
                  }`
                )
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setColor(ee.color)
                .addField(
                  `**\` 0. \` __CURRENT TRACK__**`,
                  `**[${queue.songs[0].name.substr(0, 60)}](${
                    queue.songs[0].url
                  })** - \`${
                    queue.songs[0].formattedDuration
                  }\`\n> *Requested by: __${queue.songs[0].user}__*`
                ),
            ],
          });
        }
      } else {
        for (let i = 0; i < limit; i++) {
          let desc = String(quelist[i]).substr(0, 2048);
          await embeds.push(
            new MessageEmbed()
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setTitle(
                `Queue of ${interaction.guild.name} ${theSongs.length} Songs`
              )
              .setDescription(
                `${desc || `** There are ${theSongs.length} Songs in Queue **`}`
              )
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              .setColor(ee.color)
              .addField(
                `**\` 0. \` __CURRENT TRACK__**`,
                `**[${queue.songs[0].name.substr(0, 60)}](${
                  queue.songs[0].url
                })** - \`${
                  queue.songs[0].formattedDuration
                }\`\n> *Requested by: __${queue.songs[0].user}__*`
              )
          );
        }
        swap_pages(interaction, embeds);
      }
    }
  },
});
