const { MONGO_URL } = require("../settings/config");
const Josh = require("@joshdb/core");
// Dynamically choose provider: MongoDB when MONGO_URL is set, else JSON
let provider;
try {
  if (MONGO_URL && typeof MONGO_URL === "string" && MONGO_URL.trim().length) {
    provider = require("@joshdb/mongo");
    console.log("[Database] Using MongoDB provider (@joshdb/mongo)");
  } else {
    provider = require("@joshdb/json");
    console.log("[Database] Using JSON provider (@joshdb/json)");
  }
} catch (err) {
  // Fallback to JSON if mongo provider isn't installed or any error occurs
  provider = require("@joshdb/json");
  console.warn(
    "[Database] Falling back to JSON provider (@joshdb/json):",
    err?.message || err
  );
}
const JUGNU = require("./Client");
const { Events } = require("discord.js");
// const provider = require("@joshdb/mongo"); // Manual override example

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
  client.on(Events.GuildDelete, async (guild) => {
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
