const { Message } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "dj",
  aliases: ["setupdj"],
  description: `DJ system on/off`,
  userPermissions: ["MANAGE_GUILD"],
  botPermissions: ["MANAGE_GUILD"],
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code
    let options = args[0];
    switch (options) {
      case "enable":
        {
          let role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[1]);
          if (!role) {
            return client.embed(
              message,
              `${client.config.emoji.ERROR} Please Provide A Role ID or Mentions`
            );
          } else {
            await client.music.set(`${message.guild.id}.djrole`, role.id);
            client.embed(
              message,
              `${client.config.emoji.SUCCESS} ${role} Role Added to DJ Role`
            );
          }
        }
        break;
      case "disable":
        {
            await client.music.set(`${message.guild.id}.djrole`, null);
            client.embed(
              message,
              `${client.config.emoji.SUCCESS} DJ System Disabled`
            );
        }
        break;

      default:{
          client.embed(message,`** ${client.config.emoji.ERROR} Wrong Usage **  \n\n \`${prefix}dj enable <@role>\` \n\n \`${prefix}dj disable\` `)
      }
        break;
    }
  },
};
