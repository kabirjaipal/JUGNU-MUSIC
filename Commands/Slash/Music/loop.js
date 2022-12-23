const { CommandInteraction } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "loop",
  description: `toggle loop song/queue/off system`,
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
      name: "loopmode",
      description: `choose loop mode`,
      type: "STRING",
      required: true,
      choices: [
        {
          name: "Track",
          value: `1`,
        },
        {
          name: "Queue",
          value: `2`,
        },
        {
          name: "Off",
          value: `0`,
        },
      ],
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
    let loopmode = Number(interaction.options.getString("loopmode"));
    await queue.setRepeatMode(loopmode);
    if (queue.repeatMode === 0) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} Loop Disabled!! **`
      );
    } else if (queue.repeatMode === 1) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} Song Loop Enabled!! **`
      );
    } else if (queue.repeatMode === 2) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} Queue Loop Enabled!! **`
      );
    }
  },
};
