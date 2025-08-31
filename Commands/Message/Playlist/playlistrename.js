const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistrename",
  aliases: ["plrename"],
  description: `Rename one of your playlists`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  run: async (client, message, args) => {
    const oldName = (args.shift() || "").trim();
    const newName = args.join(" ").trim();
    if (!oldName || !newName) return client.embed(message, `${client.config.emoji.ERROR} Usage: playlistrename <old> <new>`);
    const ok = await Store.rename(client, message.guild.id, message.author.id, oldName, newName);
    if (!ok) return client.embed(message, `${client.config.emoji.ERROR} Cannot rename. Check names or that the new name isn't used.`);
    return client.embed(message, `${client.config.emoji.SUCCESS} Renamed \`${oldName}\` to \`${newName}\`.`);
  },
};
