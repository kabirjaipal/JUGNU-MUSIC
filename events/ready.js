const client = require("..");
const player = require("../handlers/player");

client.on("ready", async () => {
  console.log(`${client.user.username} Is Online`);
  client.user.setActivity({
    name: `@${client.user.username} /play`,
    type: "PLAYING",
  });

  // player
  await client.guilds.fetch();

  await client.guilds.cache.forEach(async (guild) => {
    client.updatemusic(guild);
  });
});
