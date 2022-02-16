// slash command

const { Command } = require("reconlx");
const emoji = require("../../settings/emoji.json");
const embed = require("../../settings/embed.json");
const config = require("../../settings/config.json");


module.exports = new Command({
  // options
  name: "",
  description: ``,
  userPermissions: [],
  botPermissions: [],
  category: "",
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
  },
});

// message command aka prefix cmd
const { Message, Client } = require("discord.js");
const emoji = require("../../settings/emoji.json");
const embed = require("../../settings/embed.json");
const config = require("../../settings/config.json");

module.exports = {
  name: "",
  aliases: [""],
  description: ``,
  userPermissions: [],
  botPermissions: [],
  category: "",
  cooldown: 10,

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args , prefix) => {
    // code
  },
};
