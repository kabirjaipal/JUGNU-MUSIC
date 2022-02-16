const { MessageEmbed } = require("discord.js");
const client = require("..");
const ee = require("../settings/embed.json");
const { databasing, cooldown } = require("../handlers/functions");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  databasing(message.guild.id, message.member.id);
  let prefix = "!";
  let mentionprefix = new RegExp(
    `^(<@!?${client.user?.id}>|${mentionprefixnew(prefix)})`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, nprefix] = message.content.match(mentionprefix);
  if (nprefix.includes(client.user.id)) {
    message.reply(`**To See My All Commans Type **\`/help\``);
  }
  let args = message.content.slice(nprefix.length).trim().split(/ +/);
  let cmd = args.shift()?.toLowerCase();
  const command =
    client.mcommands.get(cmd) ||
    client.mcommands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
  if (!command) return;
  if (command) {
    if (!message.member.permissions.has(command.userPermissions || [])) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(
              `** ❌ You don't Have ${command.userPermissions} To Run Command.. **`
            ),
        ],
      });
    } else if (!message.member.permissions.has(command.botPermissions || [])) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(
              `** ❌ I don't Have ${command.botPermissions} To Run Command.. **`
            ),
        ],
      });
    } else if (cooldown(message, command)) {
      return message.channel.send(
        `*You are On Cooldown , wait \`${cooldown(
          message,
          command
        ).toFixed()}\` Seconds*`
      );
    } else {
      command.run(client, message, args, nprefix);
    }
  }
});

function mentionprefixnew(newprefix) {
  return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
