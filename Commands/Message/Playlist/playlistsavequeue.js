const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistsavequeue",
  aliases: ["plsavequeue"],
  description: `Save current queue to a playlist`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,
  run: async (client, message, args) => {
    const name = args.join(" ").trim();
    if (!name) return client.embed(message, `${client.config.emoji.ERROR} Provide a playlist name.`);
    const q = client.distube.getQueue(message.guild.id);
    if (!q || !q.songs?.length) return client.embed(message, `${client.config.emoji.ERROR} Queue is empty.`);
    const tracks = q.songs.map((s) => Store.serializeSong(s, message.author)).filter(Boolean);
    await Store.create(client, message.guild.id, message.author.id, name);
    await Store.addTracks(client, message.guild.id, message.author.id, name, tracks);
    return client.embed(message, `${client.config.emoji.SUCCESS} Saved ${tracks.length} tracks to \`${name}\`.`);
  },
};
