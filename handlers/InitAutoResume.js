const { Queue } = require("distube");
const JUGNU = require("./Client");
const { arraysEqual } = require("./functions");

/**
 * Builds a simplified track object from the original track object.
 * @param {Object} track - The original track object.
 * @returns {Object} The simplified track object.
 */
const buildTrack = (track) => ({
  memberId: track.member.id,
  source: track.source,
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
});

/**
 * Automatically stores the state of the queue for auto-resume.
 * @param {JUGNU} client - The client instance.
 * @param {Queue} queue - The queue instance.
 */
module.exports = async (client, queue) => {
  /**
   * Interval function to check and update autoresume data periodically.
   */
  setInterval(async () => {
    // Get the current queue for the guild
    const newQueue = client.distube.getQueue(queue.textChannel.guild);
    // Get autoresume data for the guild
    const autoresume = await client.music.get(
      `${queue.textChannel.guildId}.autoresume`
    );

    // Check if both newQueue and autoresume exist
    if (!newQueue || !autoresume) return;

    // Prepare autoresume data
    const autoresumeData = {
      guild: newQueue.textChannel.guildId || null,
      voiceChannel: newQueue.voiceChannel?.id || null,
      textChannel: newQueue.textChannel?.id || null,
      songs: newQueue.songs.length > 0 ? newQueue.songs.map(buildTrack) : [],
      volume: newQueue.volume || 100,
      repeatMode: newQueue.repeatMode || 0,
      playing: newQueue.playing || false,
      currentTime: newQueue.currentTime || 0,
      autoplay: newQueue.autoplay || false,
    };

    // Ensure autoresume data exists
    await client.autoresume.ensure(queue.textChannel.guildId, autoresumeData);

    // Get stored autoresume data
    const storedData = await client.autoresume.get(
      newQueue.textChannel.guildId
    );

    if (!storedData) return;

    // Properties to update
    const propertiesToUpdate = [
      "guild",
      "voiceChannel",
      "textChannel",
      "volume",
      "repeatMode",
      "playing",
      "currentTime",
      "autoplay",
    ];

    // Update autoresume data if there are changes
    propertiesToUpdate.forEach((property) => {
      if (storedData[property] !== autoresumeData[property]) {
        client.autoresume.set(
          `${newQueue.textChannel.guildId}.${property}`,
          autoresumeData[property]
        );
      }
    });

    // Update songs if there are changes
    if (!arraysEqual(storedData.songs, newQueue.songs)) {
      await client.autoresume.set(
        `${newQueue.textChannel.guildId}.songs`,
        newQueue.songs.map(buildTrack)
      );
    }
  }, 10000); // Interval for checking every 10 seconds
};
