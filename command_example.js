// chat input slash commands
const { ApplicationCommandType, CommandInteraction } = require("discord.js");
const { embed: ee, emoji } = require("../../../settings/config");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "",
  description: ``,
  userPermissions: [],
  botPermissions: [],
  category: "",
  cooldown: 10,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
  },
};

// message input slash commands
const { ApplicationCommandType, ContextMenuCommandInteraction } = require("discord.js");
const { embed: ee, emoji } = require("../../../settings/config");
const JUGNU = require("../../../handlers/Client");

module.exports = {
  name: "",
  category: "",
  type: ApplicationCommandType.Message,
  /**
   *
   * @param {JUGNU} client
   * @param {ContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    // Code
  },
};

// user slash commands

const { ApplicationCommandType, ContextMenuCommandInteraction } = require("discord.js");
const { embed: ee, emoji } = require("../../../settings/config");
const JUGNU = require("../../../handlers/Client");

module.exports = {
  name: "",
  category: "",
  type: ApplicationCommandType.User,
  /**
   *
   * @param {JUGNU} client
   * @param {ContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    // Code
  },
};

// message commands
const { Message } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "",
  aliases : [],
  description: ``,
  userPermissions: [],
  botPermissions: [],
  category: "",
  cooldown: 10,
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
  },
};
