const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const player = require("../../handlers/player");
const { check_dj } = require("../../handlers/functions");
const { MessageEmbed } = require("discord.js");

module.exports = new Command({
  // options
  name: "move",
  description: `move a song in queue`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  DJ: true,
  options: [
    {
      name: "trackindex",
      description: `give me song index`,
      type: "NUMBER",
      required: true,
    },
    {
      name: "targetindex",
      description: `give me target index`,
      type: "NUMBER",
      required: true,
    },
  ],
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    let channel = interaction.member.voice.channel;
    let queue = await player.getQueue(interaction.guild.id);
    if (!channel) {
      return interaction.followUp(
        `** ${emoji.ERROR} You Need to Join Voice Channel first **`
      );
    } else if (
      interaction.guild.me.voice.channel &&
      !interaction.guild.me.voice.channel.equals(channel)
    ) {
      return interaction.followUp(
        `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
      );
    } else if (!queue) {
      return interaction.followUp(`** ${emoji.ERROR} Nothing Playing Now **`);
    } else if (check_dj(client, interaction.member, queue.songs[0])) {
      return interaction.followUp(
        `** ${emoji.ERROR} You are Not DJ and also not Song Requester **`
      );
    } else {
      let songIndex = interaction.options.getNumber("trackindex");
      let position = interaction.options.getNumber("targetindex");
      if (position >= queue.songs.length || position < 0) position = -1;
      if (songIndex > queue.songs.length - 1) {
        interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setTitle(`${emoji.ERROR} **This Song does not exist!**`)
              .setDescription(
                `>>> **The last Song in the Queue has the Index: \`${queue.songs.length}\`**`
              )
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        });
      } else if (position === 0) {
        return interaction.followUp(
          `${emoji.ERROR} **Cannot move Song before Playing Song!**`
        );
      } else {
        let song = queue.songs[songIndex];
        //remove the song
        queue.songs.splice(songIndex);
        //Add it to a specific Position
        queue.addToQueue(song, position);
        interaction.followUp(
          `📑 Moved **${
            song.name
          }** to the **\`${position}th\`** Place right after **_${
            queue.songs[position - 1].name
          }_!**`
        );
      }
    }
  },
});
