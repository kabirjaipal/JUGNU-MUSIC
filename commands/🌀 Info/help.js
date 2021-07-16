const {
    MessageEmbed
} = require("discord.js");
const {
    stripIndents
} = require("common-tags");

const config = require("../../config.json")
const devname = config.devname
const { readdirSync } = require("fs");
const prefix = require("../../config.json").prefix;
module.exports = {
    name: "help",
    aliases: ["h"],
    cooldown: 3,
    category: "INFORMATION COMMANDS",
    description: "Returns all commands, or one specific command info",
    useage: "help [Command]",
    run: async (client, message, args) => {
        const roleColor =
            message.guild.me.displayHexColor === "#000000"
                ? "#ffffff"
                : message.guild.me.displayHexColor;

        if (!args[0]) {
            let categories = [];

            readdirSync("./commands/").forEach((dir) => {
                const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                const cmds = commands.map((command) => {
                    let file = require(`../../commands/${dir}/${command}`);

                    if (!file.name) return "No command name.";

                    let name = file.name.replace(".js", "");

                    return `\`${name}\``;
                });

                let data = new Object();

                data = {
                    name: dir.toUpperCase(),
                    value: cmds.length === 0 ? "In progress." : cmds.join(" "),
                };

                categories.push(data);
            });

            const embed = new MessageEmbed()
                .setTitle(" 😁😁 \` Welcome to My Help Menu \` 😁😁")
                .addField('Prefix Information', `Prefix: \`${config.prefix}\`\nYou can also mention ${client.user} to get prefix info.`, false)
                .addFields(categories)
                .setDescription(
                    `Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help play\`.`
                )
                .setFooter(`To see command descriptions and inforamtion, type: ${config.prefix}help [CMD NAME]`, client.user.displayAvatarURL())
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(config.colors.yes)
                .setFooter("Made By Kabir Jaipal aka Tech Boy Gaming")
            return message.channel.send(embed);
        } else {
            const command =
                client.commands.get(args[0].toLowerCase()) ||
                client.commands.find(
                    (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                );

            if (!command) {
                const embed = new MessageEmbed()
                    .setTitle(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
                    .setColor(config.colors.yes)
                return message.channel.send(embed);
            }

            const embed = new MessageEmbed()
                .setTitle("Command Details:")
                .setThumbnail(client.user.displayAvatarURL())
                .addField("PREFIX:", `\`${prefix}\``)
                .addField(
                    "COMMAND:",
                    command.name ? `\`${command.name}\`` : "No name for this command."
                )
                .addField(
                    "ALIASES:",
                    command.aliases
                        ? `\`${command.aliases.join("` `")}\``
                        : "No aliases for this command."
                )
                .addField(
                    "USAGE:",
                    command.usage
                        ? `\`${prefix}${command.name} ${command.usage}\``
                        : `\`${prefix}${command.name}\``
                )
                .addField(
                    "DESCRIPTION:",
                    command.description
                        ? command.description
                        : "No description for this command."
                )
                .setFooter(
                    `Requested by ${message.author.tag}`,
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .setTimestamp()
                .setColor(config.colors.yes)
            return message.channel.send(embed);
        }
    }
}
