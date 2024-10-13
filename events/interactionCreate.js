import { InteractionType } from "discord.js";
import { client } from "../bot.js";

/**
 * Handles interaction events, such as slash commands.
 * @param {Interaction} interaction - The interaction received from Discord.
 */
client.on("interactionCreate", async (interaction) => {
  try {
    // Ignore interactions from bots or outside of guilds
    if (interaction.user.bot || !interaction.guild) return;

    // Check if the interaction is a command
    if (interaction.type == InteractionType.ApplicationCommand) {
      // Get the command object from the command collection
      const command = client.scommands.get(interaction.commandName);

      // If command not found, respond with error message
      if (!command) {
        return client.send(interaction, {
          content: `\`${interaction.commandName}\` is not a valid command !!`,
          ephemeral: true,
        });
      }

      // Extract member and command permissions
      const { member, guild } = interaction;
      const { userPermissions, botPermissions } = command;

      // Check user permissions
      const missingUserPerms = userPermissions.filter(
        (perm) => !member.permissions.has(perm)
      );
      if (missingUserPerms.length > 0) {
        await client.sendEmbed(
          interaction,
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
          interaction,
          `I am missing the following permissions: \`${missingBotPerms.join(
            ", "
          )}\``
        );
        return;
      }

      // Run the command
      await command.run({ client, interaction });
    }
  } catch (error) {
    // Log any errors that occur
    console.error("An error occurred in interactionCreate event:", error);

    // Send a generic error message to the user
    await client.sendEmbed(
      interaction,
      "An error occurred while processing your command. Please try again later."
    );
  }
});
