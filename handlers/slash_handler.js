const {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Guild,
} = require("discord.js");
const fs = require("fs");
const chalk = require("chalk");
const ee = require("../settings/embed.json");
const { Queue } = require("distube");
const emoji = require("../settings/emoji.json");

/**
 *
 * @param {Client} client
 */

module.exports = async (client) => {
  try {
    client.arrayOfcommands = [];
    let commandcount = 0;
    console.log(chalk.green.bold("SLASH COMMANDS━━━━━━━━━━━━━━━━━━━┓"));
    let cmdName;
    let cmdOption;
    fs.readdirSync("./commands").forEach((cmd) => {
      let commands = fs
        .readdirSync(`./commands/${cmd}/`)
        .filter((file) => file.endsWith(".js"));
      for (cmds of commands) {
        let pull = require(`../commands/${cmd}/${cmds}`);
        if (pull.options) {
          pull.options
            .filter((g) => g.type === "SUB_COMMAND")
            .forEach((sub) => {
              client.subcmd.set(sub.name, sub);
            });
        }
        if (pull.name) {
          client.commands.set(pull.name, pull);
          cmdName = pull.name;
          cmdOption = "✅";
          commandcount++;
          client.arrayOfcommands.push(pull);
        } else {
          continue;
        }
        console.log(
          `${chalk.green.bold("┃")} Loaded: ${cmdOption} ${chalk.green.bold(
            "┃"
          )} ${cmdName}`
        );
      }
    });
    console.log(chalk.green.bold("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"));

    client.on("ready", async () => {
      try {
        // await client.guilds.cache
        //   .get(`903532162236694539`)
        //   .commands.set(client.arrayOfcommands);
        await client.application.commands
          .set(client.arrayOfcommands)
          .then((s) => {
            console.log("Successfully reloaded application (/) commands.");
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (e) {
        console.log(e);
      }
    });

    // console.log(` Loaded ${commandcount} commands `);
  } catch (e) {
    console.log(e);
  }
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {String} data
   */
  client.embed = (interaction, data) => {
    return interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setColor(ee.color)
          .setTitle(data.substr(0, 2000))
          .setFooter({
            text: ee.footertext,
            iconURL: ee.footericon,
          }),
      ],
    });
  };
};
