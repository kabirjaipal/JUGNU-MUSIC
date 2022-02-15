const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const player = require("../../handlers/player");
const { check_dj } = require("../../handlers/functions");

module.exports = new Command({
  // options
  name: "jump",
  description: `jump to a specific song in queue`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  DJ: true,
  options: [
    {
      name: "index",
      description: `give me song index`,
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
      let index = interaction.options.getNumber("index");
      if (index > queue.songs.length - 1 || index < 0) {
        return interaction.followUp(
          `${emoji.ERROR} **The Position must be between \`0\` and \`${
            queue.songs.length - 1
          }\`!**`
        );
      }else{
        queue.jump(index).then((q) => {
            interaction.followUp(
              `** ${emoji.SUCCESS} Jumped to The ${index} in the Song **`
            );
          });
      }
    }
  },
});
