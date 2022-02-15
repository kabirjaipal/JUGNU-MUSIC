const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const player = require("../../handlers/player");
const { check_dj } = require("../../handlers/functions");

module.exports = new Command({
  // options
  name: "removedupes",
  description: `remove dupicate songs from queue`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  DJ: true,
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
      let msg = await interaction.followUp(
        `** Removing Duplicate 🎧 Songs From Queue Wait **`
      );
      let tracks = queue.songs;
      const newtracks = [];
      for (let i = 0; i < tracks.length; i++) {
        let exists = false;
        for (j = 0; j < newtracks.length; j++) {
          if (tracks[i].url === newtracks[j].url) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          newtracks.push(tracks[i]);
        }
      }
      //clear the Queue
      queue.delete();
      //now add every not dupe song again
      await newtracks.map((song, index) => {
        queue.addToQueue(song, index);
      });

      msg.edit(`** Removed 🎧 \`${newtracks.length}\` Duplicate Songs From Queue **`);
    }
  },
});
