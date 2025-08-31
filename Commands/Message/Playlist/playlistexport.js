const { Message, PermissionFlagsBits, AttachmentBuilder } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistexport",
  aliases: ["plexport"],
  description: `Export a playlist as JSON file`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  run: async (client, message, args) => {
    const name = args.join(" ").trim();
    if (!name) return client.embed(message, `${client.config.emoji.ERROR} Provide a playlist name.`);
    const pl = await Store.get(client, message.guild.id, message.author.id, name);
    if (!pl) return client.embed(message, `${client.config.emoji.ERROR} Playlist not found.`);
    const json = Buffer.from(JSON.stringify({ name: pl.name, tracks: pl.tracks }, null, 2));
    const file = new AttachmentBuilder(json, { name: `${pl.name}.playlist.json` });
    return message.reply({ files: [file] }).catch(() => {});
  },
};
