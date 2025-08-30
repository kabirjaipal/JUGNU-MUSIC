const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "play",
  description: `play song by song Name/Link`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,
  options: [
    {
      name: "song",
      description: `song Name/Link`,
      type: ApplicationCommandOptionType.String,
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
    let song = interaction.options.getString("song");
    let { channel } = interaction.member.voice;
    const hqStored = await client.music.get(`${interaction.guildId}.hqmode`);
    const hqMode =
      (hqStored === undefined ? process.env.HQ_MODE === "true" : hqStored) ||
      false;
    // Pre-join voice to parallelize connection with source resolution
    try {
      await client.distube.voices.join(channel);
    } catch {}
    const isURL = /^(https?:\/\/)/i.test(song);
    const query = isURL ? song : `ytsearch1:${song}`;
    client.distube.play(channel, query, {
      member: interaction.member,
      textChannel: interaction.channel,
      ...(hqMode ? { volume: 100 } : {}),
    });
    interaction
      .followUp({
        content: `Searching \`${song}\``,
        ephemeral: true,
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => {});
        }, 3000);
      });
  },
};
