const { EmbedBuilder, Events } = require("discord.js");
const JUGNU = require("./Client");
const { check_dj, skip } = require("./functions");

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  // interaction handling
  try {
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.guild || interaction.user.bot) return;
      if (interaction.isButton()) {
        await interaction.deferUpdate().catch((e) => {});
        const { customId, member } = interaction;
        let voiceMember = interaction.guild.members.cache.get(member.id);
        let channel = voiceMember.voice.channel;
        let queue = client.distube.getQueue(interaction.guildId);
        let checkDJ = await check_dj(
          client,
          interaction.member,
          queue?.songs[0]
        );

        const refresh = (q, ms = 0) => {
          try {
            setTimeout(() => {
              client.updateplayer(q).catch(() => {});
            }, ms);
          } catch {}
        };

        switch (customId) {
          case "previous":
            {
              if (!channel) return send(interaction, ` ${client.config.emoji.ERROR} You Need to Join Voice Channel`);
              if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))
                return send(interaction, ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `);
              if (!queue) return send(interaction, ` ${client.config.emoji.ERROR} i am Not Playing Right Now `);
              if (checkDJ) return send(interaction, `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`);
              try {
                await queue.previous();
                refresh(queue, 300);
                return send(interaction, `${client.config.emoji.SUCCESS}  Playing previous track`);
              } catch (e) {
                return send(interaction, `${client.config.emoji.ERROR} No previous track available`);
              }
            }
            break;
          case "rewind10":
            {
              if (!channel) return send(interaction, ` ${client.config.emoji.ERROR} You Need to Join Voice Channel`);
              if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))
                return send(interaction, ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `);
              if (!queue) return send(interaction, ` ${client.config.emoji.ERROR} i am Not Playing Right Now `);
              if (checkDJ) return send(interaction, `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`);
              const pos = Math.max(0, (queue.currentTime || 0) - 10);
              try {
                await queue.seek(pos);
                refresh(queue, 200);
                return send(interaction, `${client.config.emoji.SUCCESS} Rewound 10s`);
              } catch {}
            }
            break;
          case "forward10":
            {
              if (!channel) return send(interaction, ` ${client.config.emoji.ERROR} You Need to Join Voice Channel`);
              if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))
                return send(interaction, ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `);
              if (!queue) return send(interaction, ` ${client.config.emoji.ERROR} i am Not Playing Right Now `);
              if (checkDJ) return send(interaction, `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`);
              const duration = queue.songs[0]?.duration || 0;
              const pos = Math.min(duration - 1, (queue.currentTime || 0) + 10);
              try {
                await queue.seek(pos);
                refresh(queue, 200);
                return send(interaction, `${client.config.emoji.SUCCESS} Forwarded 10s`);
              } catch {}
            }
            break;
          case "shuffle":
            {
              if (!channel) return send(interaction, ` ${client.config.emoji.ERROR} You Need to Join Voice Channel`);
              if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel))
                return send(interaction, ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `);
              if (!queue) return send(interaction, ` ${client.config.emoji.ERROR} i am Not Playing Right Now `);
              if (checkDJ) return send(interaction, `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`);
              try {
                await queue.shuffle();
                refresh(queue, 0);
                return send(interaction, `${client.config.emoji.SUCCESS} Queue shuffled`);
              } catch {}
            }
            break;
          case "autoplay":
            {
              if (!channel) {
                return send(
                  interaction,
                  `** ${client.config.emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} i am Not Playing Right Now `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`
                );
              } else if (!queue.autoplay) {
                queue.toggleAutoplay();
                refresh(queue, 0);
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Autoplay Enabled !! `
                );
              } else {
                queue.toggleAutoplay();
                refresh(queue, 0);
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Autoplay is Disabled !!.`
                );
              }
            }
            break;
          case "skip":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join Voice Channel`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} i am Not Playing Right Now `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`
                );
              } else {
                await skip(queue);
                refresh(queue, 300);
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS}  Song Skipped !!`
                );
              }
            }
            break;
          case "stop":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join Voice Channel`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} i am Not Playing Right Now `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`
                );
              } else {
                await queue.stop().catch((e) => {});
                try {
                  const db = await client.music?.get(`${interaction.guildId}.vc`);
                  if (!db?.enable) await client.distube.voices.leave(interaction.guild);
                  // Reset embeds to default immediately
                  try {
                    await client.updateembed(client, interaction.guild);
                    await client.editPlayerMessage(queue.textChannel);
                  } catch {}
                } catch {}
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Song Stoped and Left Channel !!.`
                );
              }
            }
            break;
          case "pauseresume":
            {
              if (!channel) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join Voice Channel`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel `
                );
              } else if (!queue) {
                return send(
                  interaction,
                  ` ${client.config.emoji.ERROR} i am Not Playing Right Now `
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} You are not DJ and also you are not song requester..`
                );
              } else if (queue.paused) {
                await queue.resume();
                refresh(queue, 0);
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Queue Resumed!! `
                );
              } else if (!queue.paused) {
                await queue.pause();
                refresh(queue, 0);
                return send(
                  interaction,
                  ` ${client.config.emoji.SUCCESS} Queue Paused !! `
                );
              }
            }
            break;
          case "loop":
            {
              if (!channel) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} You Need to Join Voice Channel`
                );
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel`
                );
              } else if (!queue) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} I am Not Playing Right Now`
                );
              } else if (checkDJ) {
                return send(
                  interaction,
                  `${client.config.emoji.SUCCESS} You are not a DJ and also you are not the song requester..`
                );
              } else {
        switch (queue.repeatMode) {
                  case 0: // off
                    await queue.setRepeatMode(1);
          refresh(queue, 0);
                    return send(
                      interaction,
                      `${client.config.emoji.SUCCESS} Song Loop On !!`
                    );
                  case 1: // song
                    await queue.setRepeatMode(2);
          refresh(queue, 0);
                    return send(
                      interaction,
                      `${client.config.emoji.SUCCESS} Queue Loop On !!`
                    );
                  case 2: // queue
                    await queue.setRepeatMode(0);
          refresh(queue, 0);
                    return send(
                      interaction,
                      `${client.config.emoji.SUCCESS} Loop Off !!`
                    );
                  default:
                    return send(
                      interaction,
                      `${client.config.emoji.ERROR} Unknown loop mode`
                    );
                }
              }
            }
            break;

          default:
            break;
        }
      }
    });

    async function send(interaction, string) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setDescription(`> ${string.substring(0, 3000)}`)
              .setFooter(client.getFooter(interaction.user)),
          ],
          ephemeral: true,
        })
        .catch((e) => null);
    }
  } catch (e) {
    console.log(e);
  }
};
