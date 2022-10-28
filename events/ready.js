const { ActivityType } = require("discord.js");
const client = require("../index");

client.on("ready", async () => {
  console.log(`${client.user.username} Is Online`);
  client.user.setActivity({
    name: `@${client.user.username} /help`,
    type: ActivityType.Playing,
  });

  // loading database
  require("../handlers/Database")(client);

  // loading dashboard
  require("../Dashboard/server");

  client.guilds.cache.forEach(async (guild) => {
    await client.updateembed(client, guild);
  });
});
