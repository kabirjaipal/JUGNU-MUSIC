const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const player = require("../../handlers/player");
const { check_dj } = require("../../handlers/functions");

module.exports = new Command({
  // options
  name: "volume",
  description: ` set volume current song`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  DJ: true,
  options: [
    {
      name: "amount",
      description: `Give Volume amount in number`,
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
      return client.embed(
        interaction,
        `** ${emoji.ERROR} You Need to Join Voice Channel first **`
      );
    } else if (
      interaction.guild.me.voice.channel &&
      !interaction.guild.me.voice.channel.equals(channel)
    ) {
      return client.embed(
        interaction,
        `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
      );
    } else if (interaction.guild.me.voice.serverMute) {
      return client.embed(
        interaction,
        `** ${emoji.ERROR} I am Muted in Voice Channel , unmute me first **`
      );
    } else if (!queue) {
      return interaction.followUp(`** ${emoji.ERROR} Nothing Playing Now **`);
    } else if (check_dj(client, interaction.member, queue.songs[0])) {
      return interaction.followUp(
        `** ${emoji.ERROR} You are Not DJ and also not Song Requester **`
      );
    } else {
      let volume = interaction.options.getNumber("amount");
      if (volume > 250) {
        return interaction.followUp(
          `** ${emoji.ERROR} Provide Volume Amount Between 1 - 250 **`
        );
      } else {
        await queue.setVolume(volume);
        interaction.followUp(
          `** ${emoji.SUCCESS} Volume Set to ${queue.volume}% **`
        );
      }
    }
  },
});
