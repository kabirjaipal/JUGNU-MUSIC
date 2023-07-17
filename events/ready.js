const { ActivityType } = require("discord.js");
const client = require("../index");

client.on("ready", async () => {
  console.log(`${client.user.username} is online`);

  client.user.setActivity({
    name: "Made By Kabir With 💖",
    type: ActivityType.WATCHING,
  });

  // Load the database
  await require("../handlers/Database")(client);

  // Load the dashboard
  require("../server");

  // Update embed for each guild
  client.guilds.cache.forEach(async (guild) => {
    await client.updateEmbed(client, guild);
  });
});
