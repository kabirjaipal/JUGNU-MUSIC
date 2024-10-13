import {
  CommandInteraction,
  Collection,
  PermissionFlagsBits,
} from "discord.js";

/**
 * Manages cooldown for commands.
 * @param {CommandInteraction} interaction - The command interaction.
 * @param {Object} cmd - The command object containing cooldown information.
 * @returns {number | false} The time left on cooldown in seconds, or false if the command is not on cooldown.
 */
export function cooldown(interaction, cmd) {
  if (!interaction || !cmd) return;
  let { client, member } = interaction;

  // Ensure cooldowns collection exists for the command
  if (!client.cooldowns.has(cmd.name)) {
    client.cooldowns.set(cmd.name, new Collection());
  }

  const now = Date.now();
  const timestamps = client.cooldowns.get(cmd.name);
  const cooldownAmount = cmd.cooldown * 1000;

  if (timestamps.has(member.id)) {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000; // Get the time left until cooldown expires
      return timeLeft;
    } else {
      timestamps.set(member.id, now);
      setTimeout(() => timestamps.delete(member.id), cooldownAmount);
      return false; // Command is not on cooldown
    }
  } else {
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    return false; // Command is not on cooldown
  }
}
