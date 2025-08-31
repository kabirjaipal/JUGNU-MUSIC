const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const Store = require("../../../handlers/PlaylistStore");

module.exports = {
  name: "playlistcreate",
  aliases: ["plcreate"],
  description: `Create a new playlist`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.SendMessages,
  category: "Playlist",
  cooldown: 3,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,
  /**
   * @param {JUGNU} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    const name = args.join(" ").trim();
    if (!name) return client.embed(message, `${client.config.emoji.ERROR} Provide a playlist name.`);
    await Store.create(client, message.guild.id, message.author.id, name);
    return client.embed(message, `${client.config.emoji.SUCCESS} Created playlist \`${name}\`.`);
  },
};
