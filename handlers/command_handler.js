const { Client } = require("discord.js");
const fs = require("fs");

/**
 *
 * @param {Client} client
 */

module.exports = (client) => {
  try {
    fs.readdirSync("./msgcommands").forEach((cmd) => {
      let commands = fs
        .readdirSync(`./msgcommands/${cmd}/`)
        .filter((file) => file.endsWith(".js"));
      for (cmds of commands) {
        let pull = require(`../msgcommands/${cmd}/${cmds}`);
        if (pull.name) {
          client.mcommands.set(pull.name, pull);
        } else {
          console.log(`${cmds} Command is not Ready`);
          continue;
        }
        if (pull.aliases && Array.isArray(pull.aliases))
          pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
      }
    });
    console.log(`${client.mcommands.size} Message Commands lOADED`);
  } catch (e) {
    console.log(e);
  }
};
