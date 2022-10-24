const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const { readdirSync } = require("fs");
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
          switch (command.type) {
            case "CHAT_INPUT":
              {
                command.type = ApplicationCommandType.ChatInput;
              }
              break;
            case "MESSAGE":
              {
                command.type = ApplicationCommandType.Message;
              }
              break;
            case "USER":
              {
                command.type = ApplicationCommandType.User;
              }
              break;

            default:
              break;
          }
          if (command.options) {
            command.options.forEach((option) => {
              switch (option.type) {
                case "STRING":
                  {
                    option.type = ApplicationCommandOptionType.String;
                  }
                  break;
                case "NUMBER":
                  {
                    option.type = ApplicationCommandOptionType.Number;
                  }
                  break;
                case "ROLE":
                  {
                    option.type = ApplicationCommandOptionType.Role;
                  }
                  break;
                case "SUB_COMMAND":
                  {
                    option.type = ApplicationCommandOptionType.Subcommand;
                  }
                  break;
                case "SUB_COMMAND_GROUP":
                  {
                    option.type = ApplicationCommandOptionType.SubcommandGroup;
                  }
                  break;

                default:
                  break;
              }
            });
          }
          client.commands.set(command.name, command);
          allCommands.push(command);
        } else {
          console.log(`${cmd} is not ready`);
        }
      }
    });
    console.log(`${client.commands.size} Slash Commands Loaded`);

    client.on("ready", async () => {
      await client.application.commands.set(allCommands);
      // let guild = client.guilds.cache.get(client.config.guildID);
      // if (guild) await guild.commands.set(allCommands);
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
    console.log(`${eventCount} event loaded`);
  } catch (e) {
    console.log(e);
  }
};
