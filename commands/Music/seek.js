const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const player = require("../../handlers/player");
const { check_dj } = require("../../handlers/functions");

module.exports = new Command({
  // options
  name: "seek",
  description: ` set seek current song`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  DJ: true,
  options: [
    {
      name: "amount",
      description: `Give seek amount in number`,
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
    } else if (interaction.guild.me.voice.serverMute) {
      return interaction.followUp(
        `** ${emoji.ERROR} I am Muted in Voice Channel , unmute me first **`
      );
    } else if (!queue) {
      return interaction.followUp(`** ${emoji.ERROR} Nothing Playing Now **`);
    } else if (check_dj(client, interaction.member, queue.songs[0])) {
      return interaction.followUp(
        `** ${emoji.ERROR} You are Not DJ and also not Song Requester **`
      );
    } else {
      let seek = interaction.options.getNumber("amount") * 1000;
      await queue.seek(seek)
      interaction.followUp(
        `** ${emoji.SUCCESS} Seeked ${seek / 1000} Seconds **`
      );
    }
  },
});
