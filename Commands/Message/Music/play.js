import { QueryType } from "discord-player";

/**
 * @type {import("../../../index").Mcommand}
 */
export default {
  name: "play",
  description: `play your fav by Name/Link`,
  userPermissions: ["SendMessages", "Connect"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,

  run: async ({ client, message, args, prefix, player }) => {
    // Code
    const song = args.join(" ");
    if (!song) {
      return await client.sendEmbed(
        message,
        `❌ Please provide a song name or link`
      );
    }

    const queue = client.player.nodes.create(message.guild.id, {
      metadata: {
        channel: message.channel,
        client: message.guild.members.me,
        requestedBy: message.user,
      },
      volume: 20,
      selfDeaf: true,
      leaveOnEmpty: true,
      leaveOnEnd: true,
      leaveOnEmptyCooldown: 5000,
      leaveOnEndCooldown: 5000,
      connectionTimeout: 999_999_999,
    });

    if (!queue.connection) {
      await queue.connect(message.member.voice.channel);
    }

    const result = await client.player.search(song, {
      requestedBy: message.author,
      searchEngine: QueryType.AUTO,
    });

    if (!result.hasTracks() || result.isEmpty()) {
      return await client.sendEmbed(message, `❌ No results found for ${song}`);
    }

    result.hasPlaylist()
      ? queue.addTrack(result.tracks)
      : queue.addTrack(result.tracks[0]);

    if (!queue.node.isPlaying()) await queue.node.play();

    await message.delete().catch(() => {});
  },
};
