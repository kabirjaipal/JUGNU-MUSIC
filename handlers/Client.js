import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
} from "discord.js";
import settings from "../settings/config.js";

/**
 * Custom client class extending Discord.js Client.
 */
export class Bot extends Client {
  /**
   * Creates an instance of Bot.
   */
  constructor() {
    super({
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      shards: "auto",
      failIfNotExists: false,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });

    // Set global variables
    this.config = settings;
    this.scommands = new Collection();
    this.mcommands = new Collection();
    this.cooldowns = new Collection();
    this.events = new Collection();
  }

  /**
   * Builds the client and logs in with the provided token.
   * @param {string} token - The bot token.
   */
  async build(token) {
    await loadHandlers(this);
    this.login(token);
  }

  /**
   * Sends an embed message.
   * @param {Interaction} interaction - The interaction where the message is sent.
   * @param {string} data - The content of the message.
   * @param {boolean} [ephemeral=false] - Whether the message should be ephemeral.
   * @returns {Promise<Message | InteractionResponse>} The sent message or interaction response.
   */
  async sendEmbed(interaction, data, ephemeral = false) {
    return this.send(interaction, {
      embeds: [
        new EmbedBuilder()
          .setColor(this.config.embed.color)
          .setDescription(`${data.substring(0, 3000)}`),
      ],
      ephemeral: ephemeral,
    });
  }

  /**
   * Gets the footer for an embed message.
   * @param {User} user - The user to display in the footer.
   * @returns {Footer} The footer object.
   */
  getFooter(user) {
    return {
      text: `Requested By ${user.username}`,
      iconURL: user.displayAvatarURL(),
    };
  }

  /**
   * Sends a message or interaction response.
   * @param {CommandInteraction | Message} interactionOrMessage - The interaction or message.
   * @param {InteractionReplyOptions} options - The options for the reply.
   * @returns {Promise<Message | InteractionResponse>} The sent message or interaction response.
   */
  async send(interactionOrMessage, options) {
    try {
      if (interactionOrMessage.deferred || interactionOrMessage.replied) {
        await interactionOrMessage.deferReply().catch((e) => {});
        return interactionOrMessage.followUp(options);
      } else {
        return interactionOrMessage.reply(options);
      }
    } catch (error) {
      return interactionOrMessage.channel.send(options);
    }
  }
}

/**
 * Loads message, slash, and event handlers for the client.
 * @param {Bot} client - The client instance.
 */
async function loadHandlers(client) {
  ["messageHandler", "slashHandler", "eventHandler"].forEach(async (file) => {
    let handler = await import(`./${file}.js`).then((r) => r.default);
    await handler(client);
  });
}
