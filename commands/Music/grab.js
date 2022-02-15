const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const player = require("../../handlers/player");
const { MessageEmbed } = require("discord.js");

module.exports = new Command({
  // options
  name: "grab",
  description: `get current song info`,
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
      let song = queue.songs[0];
      interaction.member.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setThumbnail(song.thumbnail)
            .setAuthor({
              name: `Successfully Grabed..`,
              iconURL: song.url,
              url: song.url,
            })
            .setDescription(`>>> ** [${song.name}](${song.url}) **`)
            .addField(
              `${emoji.song_by} Requested by:`,
              `>>> ${song.user}`,
              true
            )
            .addField(
              `${emoji.time} Duration:`,
              `>>> \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``,
              true
            )
            .addField(
              `${emoji.show_queue} Queue:`,
              `>>> \`${queue.songs.length} song(s)\`\n\`${queue.formattedDuration}\``,
              true
            )
            .addField(
              `${emoji.raise_volume} Volume:`,
              `>>> \`${queue.volume} %\``,
              true
            )
            .addField(
              `${emoji.repeat_mode} Loop:`,
              `>>> ${
                queue.repeatMode
                  ? queue.repeatMode === 2
                    ? `${emoji.SUCCESS} \`Queue\``
                    : `${emoji.SUCCESS} \`Song\``
                  : `${emoji.ERROR}`
              }`,
              true
            )
            .addField(
              `${emoji.autoplay_mode} Autoplay:`,
              `>>> ${
                queue.autoplay ? `${emoji.SUCCESS}` : `${emoji.ERROR}`
              }`,
              true
            )
            .addField(
              `${emoji.filters} Filter${queue.filters.length > 0 ? "s" : ""}:`,
              `>>> ${
                queue.filters && queue.filters.length > 0
                  ? `${queue.filters.map((f) => `\`${f}\``).join(`, `)}`
                  : `${emoji.ERROR}`
              }`,
              queue.filters.length > 1 ? false : true
            )
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      }).then(m => {
          interaction.followUp(` ${emoji.lyrics} Check Your DMS!!`)
      })
      .catch(e => {
          interaction.followUp(` ${emoji.ERROR} Can't send , Open Your DMS`)
      })
    }
  },
});
