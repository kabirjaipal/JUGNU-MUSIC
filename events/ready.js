const client = require("../index");

client.on("ready", async () => {
  console.log(`${client.user.username} Is Online`);
  client.user.setActivity({
    name: `@${client.user.username} /help`,
    type: "PLAYING",
  });

  // loading database
  require('../handlers/Database')(client)

  client.guilds.cache.forEach(async (guild) => {
    await client.updateembed(client, guild)
  })
});
