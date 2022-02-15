const { Command } = require(`reconlx`);
const ee = require(`../../settings/embed.json`);
const config = require(`../../settings/config.json`);
const { MessageEmbed, version } = require(`discord.js`);
const emoji = require(`../../settings/emoji.json`);
const { duration } = require(`../../handlers/functions`);

module.exports = new Command({
  // options
  name: `botinfo`,
  description: `get info of bot`,
  userPermissions: [`SEND_MESSAGES`],
  botPermissions: [`SEND_MESSAGES`],
  category: `Information`,
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setColor(ee.color)
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `** Name: <@882481863661342770> | [Youtube Channel](https://youtube.com/techboy2) | [Github](https://github.com/kabirsingh2004) ** \n\n`
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .addFields([
            {
              name: `🤖 Name`,
              value: `>>> \`${client.user.username}\``,
              inline: true,
            },
            {
              name: `🏓 Ping`,
              value: `>>> \`${client.ws.ping}ms\``,
              inline: true,
            },
            {
              name: `🎛️ Servers`,
              value: `>>> \`${client.guilds.cache.size} Servers\``,
              inline: true,
            },
            {
              name: `👨‍👧‍👧 Users`,
              value: `>>> \`${client.users.cache.size} Users\``,
              inline: true,
            },
            {
              name: `📂 Channels`,
              value: `>>> \`${client.channels.cache.size} Channels\``,
              inline: true,
            },
            {
              name: `🔗 Node.js Version`,
              value: `>>> \`${process.version}\``,
              inline: true,
            },
            {
              name: `🔗 Discord.js Version`,
              value: `>>> \`${version}\``,
              inline: true,
            },
            {
              name: `${emoji.setup} Bot Commands`,
              value: `>>> \`\`\` Commands ${client.commands.size} , SubCommands ${client.subcmd.size}\`\`\``,
            },
            {
              name: `${emoji.time} Bot Uptime`,
              value: `>>> \`\`\`${duration(client.uptime)
                .map((i) => `${i}`)
                .join(` , `)}\`\`\``,
            },
          ])
          .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
      ],
    });
  },
});
