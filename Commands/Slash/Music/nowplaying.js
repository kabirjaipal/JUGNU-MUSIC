const { CommandInteraction, EmbedBuilder } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "nowplaying",
  description: `see which song playing current song`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
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
    let song = queue.songs[0];

    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setThumbnail(song.thumbnail)
          .setAuthor({
            name: `Now Playing`,
            iconURL: song.thumbnail,
            url: song.url,
          })
          .setDescription(`** [${song.name}](${song.streamURL}) **`)
          .addFields([
            {
              name: `** Duration **`,
              value: ` \`${queue.formattedCurrentTime}/${song.formattedDuration} \``,
              inline: true,
            },
            {
              name: `** Requested By **`,
              value: ` \`${song.user.tag} \``,
              inline: true,
            },
            {
              name: `** Author **`,
              value: ` \`${song.uploader.name}\``,
              inline: true,
            },
          ])
          .setFooter(client.getFooter(interaction.user)),
      ],
    });
  },
};
