const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const { readdirSync } = require("fs");
const { slash } = require("../settings/config");
const JUGNU = require("./Client");

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  // LOADING SLASH COMMANDS
  try {
    let allCommands = [];
    readdirSync("./Commands/Slash").forEach((dir) => {
      const commands = readdirSync(`./Commands/Slash/${dir}`).filter((f) =>
        f.endsWith(".js")
      );

      for (const cmd of commands) {
        const command = require(`../Commands/Slash/${dir}/${cmd}`);
        if (command.name) {
          client.commands.set(command.name, command);
          allCommands.push(command);
        } else {
          console.log(`${cmd} is not ready`);
        }
      }
    });
    console.log(`${client.commands.size} Slash Commands Loaded`);
    client.on("ready", async () => {
      if (slash.global) {
        await client.application.commands.set(allCommands);
      } else {
        let guild = client.guilds.cache.get(slash.guildID);
        if (guild) await guild.commands.set(allCommands);
        await client.application.commands.set([]);
      }
    });
  } catch (e) {
    console.log(e);
  }

  // LOADING MESSAGE COMMANDS
  try {
    readdirSync("./Commands/Message").forEach((dir) => {
      const commands = readdirSync(`./Commands/Message/${dir}`).filter((f) =>
        f.endsWith(".js")
      );

      for (const cmd of commands) {
        const command = require(`../Commands/Message/${dir}/${cmd}`);
        if (command.name) {
          client.mcommands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases))
            command.aliases.forEach((a) => client.aliases.set(a, command.name));
        } else {
          console.log(`${cmd} is not ready`);
        }
      }
    });
    console.log(`${client.mcommands.size} Message Commands Loaded`);
  } catch (error) {
    console.log(error);
  }

  // Loading Event Files
  try {
    let eventCount = 0;
    readdirSync("./events")
      .filter((f) => f.endsWith(".js"))
      .forEach((event) => {
        require(`../events/${event}`);
        eventCount++;
      });
    console.log(`${eventCount} Events Loaded`);
  } catch (e) {
    console.log(e);
  }
};
