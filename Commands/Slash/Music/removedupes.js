const { CommandInteraction } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "removedupes",
  description: `remove duplicate songs from queue`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    let msg = await interaction.followUp(
      `** ${client.config.emoji.time} Removing Duplicate 🎧 Songs From Queue Wait **`
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

    msg.edit(
      `** ${client.config.emoji.SUCCESS} Removed 🎧 \`${newtracks.length}\` Duplicate Songs From Queue **`
    );
  },
};
