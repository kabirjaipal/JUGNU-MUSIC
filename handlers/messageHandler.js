import { Bot } from "./Client.js";
import { readdir } from "node:fs/promises";

/**
 * Loads message commands for the client.
 * @param {Bot} client - The client instance.
 */
export default async (client) => {
  try {
    const commandsDir = await readdir(`./Commands/Message`);

    await Promise.all(
      commandsDir.map(async (dir) => {
        const commands = await readdir(`./Commands/Message/${dir}`);
        const filterCommands = commands.filter((f) => f.endsWith(".js"));

        await Promise.all(
          filterCommands.map(async (cmd) => {
            try {
              /**
               * @type {import("../index.js").Scommand}
               */
              const command = await import(
                `../Commands/Message/${dir}/${cmd}`
              ).then((r) => r.default);

              if (command.name) {
                client.mcommands.set(command.name, command);
              }
            } catch (error) {
              console.error(`Error loading command from file ${cmd}:`, error);
            }
          })
        );
      })
    );

    console.log(
      `> ✅ Successfully loaded ${client.mcommands.size} message commands.`
    );
  } catch (error) {
    console.error(
      "An error occurred while reading the commands directory:",
      error
    );
  }
};
