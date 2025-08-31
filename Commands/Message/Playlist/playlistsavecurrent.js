const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistsavecurrent",
  aliases: ["plsavenowplaying", "plsavenc", "plsavenp"],
  description: `Save current song to a playlist`,
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
    if (!q || !q.songs?.length) return client.embed(message, `${client.config.emoji.ERROR} Nothing is playing.`);
    const track = Store.serializeSong(q.songs[0], message.author);
    await Store.create(client, message.guild.id, message.author.id, name);
    await Store.addTracks(client, message.guild.id, message.author.id, name, [track]);
    return client.embed(message, `${client.config.emoji.SUCCESS} Saved current song to \`${name}\`.`);
  },
};
