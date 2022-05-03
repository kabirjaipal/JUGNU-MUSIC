const { Message, MessageEmbed } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "help",
  aliases: ["h", "cmds", "commands"],
  description: `need help ? see my all commands`,
  userPermissions: [],
  botPermissions: ["EMBED_LINKS"],
  category: "Information",
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
    // this.commands = new Collection();
    // this.scategories = fs.readdirSync("./Commands/Slash");

    let commands = client.mcategories.map((dir) => {
      let cmds = client.mcommands
        .filter((cmd) => cmd.category === dir)
        .map((cmd) => `\`${cmd.name}\``)
        .join(" ");
      return {
        name: `** ${dir.toLocaleUpperCase()} **`,
        value: cmds || `Working`,
      };
    });

    message.reply({
      embeds: [
        new MessageEmbed()
          .setColor(client.config.embed.color)
          .setAuthor({
            name: `My Commands`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .addFields(commands)
          .setFooter(client.getFooter(message.author)),
      ],
    });
  },
};
