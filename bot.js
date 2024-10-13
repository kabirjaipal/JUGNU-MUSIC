import "dotenv/config";
import { Bot } from "./handlers/Client.js";

/**
 * The client instance representing the bot.
 * @type {Bot}
 */
export const client = new Bot();

// Login the bot using the provided token
client.build(client.config.TOKEN);

/**
 * Initializes and logs in the bot.
 * @module BotInitialization
 */

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("An uncaught exception occurred:", error);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("An unhandled promise rejection occurred:", error);
});
