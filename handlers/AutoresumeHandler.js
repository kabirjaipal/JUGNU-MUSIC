const { Song, SearchResultVideo } = require("distube");
const JUGNU = require("./Client");

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  // Check if autoresume feature is enabled
  if (!client.autoresume) return;

  // Retrieve guild IDs from the autoresume data
  const guildIds = await client.autoresume.keys;
  if (!guildIds || !guildIds.length) return;

  // Iterate over each guild
  for (const gId of guildIds) {
    // Retrieve guild object from cache
    const guild = client.guilds.cache.get(gId);
    if (!guild) {
      // If guild not found, delete autoresume data and continue to next guild
      await client.autoresume.delete(gId);
      continue;
    }

    // Retrieve autoresume data for the guild
    const data = await client.autoresume.get(guild.id);
    if (!data) continue;

    // Retrieve voice channel and check if it exists
    const voiceChannel = guild.channels.cache.get(data.voiceChannel);
    if (!voiceChannel) {
      // If voice channel not found, delete autoresume data and continue to next guild
      await client.autoresume.delete(gId);
      continue;
    }

    // Check if there are members in the voice channel
    if (
      !voiceChannel.members ||
      voiceChannel.members.filter(
        (m) => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf
      ).size < 1
    ) {
      // If no members in the voice channel, delete autoresume data and continue to next guild
      await client.autoresume.delete(gId);
      continue;
    }

    // Retrieve text channel and check if it exists
    const textChannel = guild.channels.cache.get(data.textChannel);
    if (!textChannel) {
      // If text channel not found, delete autoresume data and continue to next guild
      await client.autoresume.delete(gId);
      continue;
    }

    // Retrieve list of tracks to be resumed
    const tracks = data.songs;
    if (!tracks || !tracks.length) continue;

    // Helper function to create a track object
    const makeTrack = async (track) => {
      return new Song(
        new SearchResultVideo({
          duration: track.duration,
          formattedDuration: track.formattedDuration,
          id: track.id,
          isLive: track.isLive,
          name: track.name,
          thumbnail: track.thumbnail,
          type: "video",
          uploader: track.uploader,
          url: track.url,
          views: track.views,
        }),
        guild.members.cache.get(track.memberId) || guild.members.me,
        track.source
      );
    };

    // Start playback of the first track in the voice channel
    await client.distube.play(voiceChannel, tracks[0].url, {
      member: guild.members.cache.get(tracks[0].memberId) || guild.members.me,
      textChannel: textChannel,
    });

    // Add remaining tracks to the queue
    const newQueue = client.distube.getQueue(guild.id);
    for (const track of tracks.slice(1)) {
      newQueue.songs.push(await makeTrack(track));
    }

    // Set volume, repeat mode, and playback state
    await newQueue.setVolume(data.volume);
    if (data.repeatMode && data.repeatMode !== 0) {
      newQueue.setRepeatMode(data.repeatMode);
    }

    if (!data.playing) {
      newQueue.pause();
    }

    // Seek to the saved playback position
    await newQueue.seek(data.currentTime);

    // Delete autoresume data for the guild
    await client.autoresume.delete(newQueue.textChannel.guildId);
  }
};
