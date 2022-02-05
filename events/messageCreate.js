const { MessageEmbed } = require("discord.js");
const client = require("..");
const ee = require("../settings/embed.json");
const { databasing } = require('../handlers/functions')

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  databasing(message.guild.id,message.member.id)
  let prefix = "!"
  let mentionprefix = new RegExp(
    `^(<@!?${client.user?.id}>|${mentionprefixnew(prefix)})`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, nprefix] = message.content.match(mentionprefix);
  if (nprefix.includes(client.user.id)) {
    message.reply(`**To See My All Commans Type **\`/help\``);
  }
  let args = message.content.slice(nprefix.length).trim().split(/ +/)
  let cmd = args.shift()?.toLowerCase()
  if(cmd === "rr"){
    process.exit()
    message.reply(`RESTARTING............`)
  }
});

function mentionprefixnew(newprefix) {
  return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
