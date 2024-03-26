const { MONGO_URL } = require("../settings/config");
const Josh = require("@joshdb/core");
const provider = require("@joshdb/json"); // Use JSON database provider
const JUGNU = require("./Client");
// const provider = require("@joshdb/mongo"); // Use MongoDB database provider

/**
 * Initialize Josh database for music and autoresume
 * @param {JUGNU} client - Discord client instance
 */
module.exports = async (client) => {
  // Initialize music and autoresume databases
  const dbName = client.user.username.replace(" ", "");

  const dbOptions = {
    url: MONGO_URL,
    dbName: dbName,
  };

  client.music = new Josh({
    name: "music",
    provider,
    providerOptions: {
      ...dbOptions,
      collection: "music",
    },
  });

  client.autoresume = new Josh({
    name: "autoresume",
    provider,
    providerOptions: {
      ...dbOptions,
      collection: "autoresume",
    },
  });

  // Handle guild deletion event
  client.on("guildDelete", async (guild) => {
    try {
      if (!guild) return;

      // Get music data for the guild
      const musicData = await client.music.get(guild.id);
      if (!musicData) return;

      // Delete request channel if exists
      const requestChannel = guild.channels.cache.get(musicData.music.channel);
      if (requestChannel) {
        await requestChannel.delete(
          `Deleting ${client.user.username} Request Channel`
        );
      }

      // Delete music data for the guild
      await client.music.delete(guild.id);
    } catch (error) {
      console.error("Error handling guildDelete event:", error);
    }
  });
};
