const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "shuffle",
  description: `toggle shuffle/unshuffle queue`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,
  options: [
    {
      name: "mode",
      description: `Choose Shuffle/Unshuffle Queue`,
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: `Shuffle`,
          value: `yes`,
        },
        {
          name: `UnShuffle`,
          value: `no`,
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
    let mode = interaction.options.get("mode")?.value;
    if (mode === "yes") {
      client.shuffleData.set(`shuffle-${queue.id}`, queue.songs.slice(1));
      queue.shuffle();
      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} Suffled ${queue.songs.length} Songs !!`
      );
    } else if (mode === "no") {
      if (!client.shuffleData.has(`shuffle-${queue.id}`)) {
        return client.embed(
          interaction,
          `${client.config.emoji.ERROR} No Suffled Queue Found !!`
        );
      } else {
        const shuffleData = client.shuffleData.get(`shuffle-${queue.id}`);
        queue.songs = [queue.songs[0], ...shuffleData];
        client.shuffleData.delete(`shuffle-${queue.id}`);
        client.embed(
          interaction,
          `${client.config.emoji.SUCCESS} UnSuffled ${queue.songs.length} Songs !!`
        );
      }
    }
  },
};
