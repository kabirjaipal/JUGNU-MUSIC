const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const player = require("../../handlers/player");
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require("discord.js");

module.exports = new Command({
  // options
  name: "playmix",
  description: `play top playlist with me`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    let channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.followUp(
        `** ${emoji.ERROR} You Need to Join Voice Channel first **`
      );
    }  else if (
      interaction.guild.me.voice.channel &&
      !interaction.guild.me.voice.channel.equals(channel)
    ) {
      return interaction.followUp(
        `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
      );
    } else if (interaction.guild.me.voice.serverMute) {
      return interaction.followUp(
        `** ${emoji.ERROR} I am Muted in Voice Channel , unmute me first **`
      );
    } else {
      let menuraw = new MessageActionRow().addComponents([
        new MessageSelectMenu()
          .setCustomId("mix")
          .setPlaceholder(`Click to See Best PlayList`)
          .addOptions([
            {
              label: "NCS Best Song",
              value: `https://www.youtube.com/playlist?list=PLRBp0Fe2GpglvwYma4hf0fJy0sWaNY_CL`,
              description: "Click to Play Best Ncs Songs",
              emoji: "924259350976036915",
            },
            {
              label: "English Best Song",
              value: `https://www.youtube.com/playlist?list=PLI_7Mg2Z_-4IWcD4drvDLYWp-eIZQUMUN`,
              description: "Click to Play Best English Songs",
              emoji: "924259350976036915",
            },
            {
              label: "Justin Beiber Best Song",
              value: `https://www.youtube.com/playlist?list=PLv5NrJjqHQ_MIgs-gEWlkvPElJ_2BY8PP`,
              description: "Click to Play Best Justin Beiber Songs",
              emoji: "924259350976036915",
            },
            {
              label: "BTS Best Song",
              value: `https://www.youtube.com/playlist?list=PLOa8BHrUPdaQ3jePqgKJ1vcO5Y8_GTnwq`,
              description: "Click to Play Best Bts Songs",
              emoji: "924259350976036915",
            },
            {
              label: "Arjit Singh Best Song",
              value: `https://www.youtube.com/playlist?list=PL0Z67tlyTaWq7xmJYR0Im1fwtIhc0T0_6`,
              description: "Click to Play Best Arjit Singh Songs",
              emoji: "924259350976036915",
            },
            {
              label: "Aish Best Song",
              value: `https://www.youtube.com/playlist?list=PLn745S-SiNkg0pXVX18nRDYupKfA79okd`,
              description: "Click to Play Best Aish Songs",
              emoji: "924259350976036915",
            },
            {
              label: "Emma Heesters(Indian Covers) Best Song",
              value: `https://www.youtube.com/playlist?list=PLMDOg4hOhCgoXri8t924R3ufPmiU0pqhV`,
              description: "Click to Play Best Emma Heesters Songs",
              emoji: "924259350976036915",
            },
            {
              label: "All Time BollyWood Best Song",
              value: `https://www.youtube.com/playlist?list=PLsQuyLqYpjSMF6bSX7C4W4e7YNqyXDHOM`,
              description: "Click to Play Best BollyWood Songs",
              emoji: "924259350976036915",
            },
          ]),
      ]);
      let embed = new MessageEmbed()
        .setColor(ee.color)
        .setTitle(`Best Top PlayList For You`)
        .setDescription(`>>> Click to See All PlayList and Select to Play`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: ee.footertext, iconURL: ee.footericon });

      interaction
        .followUp({ embeds: [embed], components: [menuraw] })
        .then(async (msg) => {
          let filter = (i) => i.user.id === interaction.user.id;
          let collector = await msg.createMessageComponentCollector({
            filter: filter,
          });
          collector.on("collect", async (interaction) => {
            if (interaction.isSelectMenu()) {
              if (interaction.customId === "mix") {
                await interaction.deferUpdate().catch((e) => {});
                let song = interaction.values[0];
                player.play(channel, song, {
                  member: interaction.member,
                  textChannel: interaction.channel,
                });
              }
            }
          });
        });
    }
  },
});
