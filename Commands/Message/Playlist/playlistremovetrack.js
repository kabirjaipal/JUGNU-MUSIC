const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistremovetrack",
  aliases: ["plremovetrack", "plrm"],
  description: `Remove a track from a playlist by index (1-based)`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,
  run: async (client, message, args) => {
    const name = args.shift();
    const idx = Number(args.shift());
    if (!name || !idx) return client.embed(message, `${client.config.emoji.ERROR} Usage: \`${client.config.PREFIX}playlistremovetrack <name> <index>\``);
    const pl = await Store.get(client, message.guild.id, message.author.id, name);
    if (!pl) return client.embed(message, `${client.config.emoji.ERROR} Playlist not found.`);
    const removed = await Store.removeTrack(client, message.guild.id, message.author.id, pl.name, idx);
    if (!removed) return client.embed(message, `${client.config.emoji.ERROR} Invalid index.`);
    return client.embed(message, `${client.config.emoji.SUCCESS} Removed \`${removed.name}\` from \`${pl.name}\`.`);
  },
};
