const { CommandInteraction } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "remove",
  description: `remove a song from current queue`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,
  options: [
    {
      name: "trackindex",
      description: `give me song index`,
      type: "NUMBER",
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
    let songIndex = interaction.options.getNumber("trackindex");
    if (songIndex === 0) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} You can't Remove Current Song **`
      );
    } else {
      let track = queue.songs[songIndex];
      queue.songs.splice(track, track + 1);
      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} Removed \`${track.name}\` Song From Queue !!`
      );
    }
  },
};
