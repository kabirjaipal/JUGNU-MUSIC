const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistplay",
  aliases: ["plplay"],
  description: `Play a saved playlist`,
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
    const pl = await Store.get(client, message.guild.id, message.author.id, name);
    if (!pl || !pl.tracks.length) return client.embed(message, `${client.config.emoji.ERROR} Playlist is empty or not found.`);
    const vc = message.member.voice.channel;
    if (!vc) return client.embed(message, `${client.config.emoji.ERROR} Join a voice channel first.`);
    if (message.guild.members.me.voice.channel && !message.guild.members.me.voice.channel.equals(vc))
      return client.embed(message, `${client.config.emoji.ERROR} You need to join my voice channel.`);
    const first = pl.tracks[0];
    await client.distube.play(vc, first.url || first.name, {
      member: message.member,
      textChannel: message.channel,
      message,
    });
    for (const t of pl.tracks.slice(1)) {
      await client.distube.play(vc, t.url || t.name, {
        member: message.member,
        textChannel: message.channel,
        message,
      });
    }
    return client.embed(message, `${client.config.emoji.SUCCESS} Playing playlist \`${pl.name}\` (${pl.tracks.length} tracks).`);
  },
};
