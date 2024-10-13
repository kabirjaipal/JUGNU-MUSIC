import { cooldown } from "../handlers/functions.js";
import { client } from "../bot.js";
import { useMainPlayer } from "discord-player";

/**
 * Event listener for when a message is created.
 * @param {Message} message - The message object received from Discord.
 */
client.on("messageCreate", async (message) => {
  try {
    // Check for necessary conditions
    if (message.author.bot || !message.guild || !message.id) return;

    const prefix = client.config.PREFIX;

    const mentionPrefix = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );

    if (!mentionPrefix.test(message.content)) return;
    const [, nPrefix] = message.content.match(mentionPrefix);
    const args = message.content.slice(nPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) {
      if (nPrefix.includes(client.user.id)) {
        return client.sendEmbed(
          message,
          ` ${client.config.emoji.success} To See My All Commands Type  \`/help\` or \`${prefix}help\``
        );
      }
    }

    // Find the command
    /**
     * @type {import("../index.js").Mcommand}
     */
    const command =
      client.mcommands.get(cmd) ||
      client.mcommands.find(
        (cmds) => cmds.aliases && cmds.aliases.includes(cmd)
      );

    // Check if the command exists
    if (!command) return;

    const { owneronly, userPermissions, botPermissions } = command;
    const { author, member, guild } = message;
    const player = useMainPlayer();
    const voiceChannel = member.voice.channel;
    const botVoiceChannel = guild.members.me.voice.channel;

    // Check ownership
    if (owneronly && !client.config.Owners.includes(author.id)) {
      return client.sendEmbed(
        message,
        `This command is restricted to authorized person only.`
      );
    }
    // Check user permissions
    const missingUserPerms = userPermissions.filter(
      (perm) => !member.permissions.has(perm)
    );
    if (missingUserPerms.length > 0) {
      await client.sendEmbed(
        message,
        `You are missing the following permissions: \`${missingUserPerms.join(
          ", "
        )}\``
      );
      return;
    }

    // Check bot permissions
    const missingBotPerms = botPermissions.filter(
      (perm) => !guild.members.me.permissions.has(perm)
    );
    if (missingBotPerms.length > 0) {
      await client.sendEmbed(
        message,
        `I am missing the following permissions: \`${missingBotPerms.join(
          ", "
        )}\``
      );
      return;
    }

    // Check cooldown
    if (cooldown(message, command)) {
      return client.sendEmbed(
        message,
        `You are currently on cooldown. Please wait for ${cooldown(
          message,
          command
        ).toFixed()} seconds before trying again.`
      );
    }

    if (command.inVoiceChannel && !voiceChannel) {
      return client.sendEmbed(
        message,
        `${client.config.emoji.ERROR} You Need to Join Voice Channel`
      );
    } else if (
      command.inSameVoiceChannel &&
      botVoiceChannel &&
      !botVoiceChannel?.equals(voiceChannel)
    ) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} You Need to Join ${botChannel} Voice Channel`
      );
    } else if (command.Player && !player) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Music Not Playing`
      );
    }

    // Run the command
    await command.run({ client, message, args, prefix, player });
  } catch (error) {
    console.error(
      "An error occurred while processing messageCreate event:",
      error
    );
  }
});

/**
 * Escapes special characters in a string to create a regex pattern.
 * @param {string} newPrefix - The string to escape.
 * @returns {string} The escaped string.
 */
function escapeRegex(newPrefix) {
  return newPrefix?.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
