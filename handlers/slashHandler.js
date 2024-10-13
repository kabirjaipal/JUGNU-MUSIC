import { Bot } from "./Client.js";
import { readdir } from "node:fs/promises";

/**
 * Loads slash commands for the client and registers them globally or in a specific guild.
 * @param {Bot} client - The client instance.
 */
export default async function loadSlashCommands(client) {
  const {
    Slash: { Global, GuildID },
  } = client.config;

  try {
    let allCommands = [];
    const commandsDir = await readdir(`./Commands/Slash`);

    await Promise.all(
      commandsDir.map(async (dir) => {
        const commands = await readdir(`./Commands/Slash/${dir}`);
        let filterCommands = commands.filter((f) => f.endsWith(".js"));

        await Promise.all(
          filterCommands.map(async (cmd) => {
            try {
              /**
               * @type {import("../index.js").Scommand}
               */
              const command = await import(
                `../Commands/Slash/${dir}/${cmd}`
              ).then((r) => r.default);

              if (command.name) {
                client.scommands.set(command.name, command);
                allCommands.push(command);
              }
            } catch (error) {
              console.error(`Error loading command from file ${cmd}:`, error);
            }
          })
        );
      })
    );

    // Register commands globally or in a specific guild
    await client.on("ready", async () => {
      if (Global) {
        client.application.commands.set(allCommands);
      } else {
        const guild = client.guilds.cache.get(GuildID);
        if (guild) await guild.commands.set(allCommands);
      }
    });

    console.log(
      `> ✅ Successfully loaded ${client.scommands.size} slash commands.`
    );
  } catch (error) {
    console.error(
      "An error occurred while reading the commands directory:",
      error
    );
  }
}
