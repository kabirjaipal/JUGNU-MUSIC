const { EmbedBuilder, Events, ChannelType } = require("discord.js");
const JUGNU = require("./Client");
const Store = require("./PlaylistStore");
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

          case "savecurrent_btn":
            {
              // Validate context
              if (!channel) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} You Need to Join Voice Channel`
                );
              }
              if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel`
                );
              }
              if (!queue || !queue.songs?.length) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} I am Not Playing Right Now`
                );
              }

              // Open a private thread asking for playlist name
              const baseMsgId = client.temp.get(interaction.guildId);
              const baseMsg = baseMsgId
                ? await interaction.channel.messages.fetch(baseMsgId).catch(() => null)
                : null;
              const threadName = `save ▶ ${interaction.user.username}`.substring(0, 90);
              const starter = baseMsg || (await interaction.message?.fetch().catch(() => null)) || null;
              let thread;
              try {
                thread = await interaction.channel.threads.create({
                  name: threadName,
                  autoArchiveDuration: 60,
                  type: ChannelType.PrivateThread,
                  reason: `Save current song prompt for ${interaction.user.tag}`,
                });
              } catch (e) {
                return send(
                  interaction,
                  `${client.config.emoji.ERROR} I need permission to create threads in this channel.`
                );
              }
              // Invite only the clicker
              try { await thread.members.add(interaction.user.id).catch(() => {}); } catch {}
              await thread.send({
                content: `${interaction.user}, reply with the playlist name to save "${client.getTitle(queue.songs[0])}" (timeout 60s).`,
              });

              const collector = thread.createMessageCollector({
                time: 60_000,
                max: 1,
                filter: (m) => m.author.id === interaction.user.id,
              });

              collector.on("collect", async (m) => {
                const name = m.content.trim().slice(0, 64);
                const track = Store.serializeSong(queue.songs[0], interaction.user);
                await Store.create(client, interaction.guildId, interaction.user.id, name);
                await Store.addTracks(client, interaction.guildId, interaction.user.id, name, [track]);
                await thread.send(`${client.config.emoji.SUCCESS} Saved to \`${name}\`. This thread will close soon.`);
              });

              collector.on("end", async () => {
                setTimeout(() => thread.setArchived(true, "Completed save prompt").catch(() => {}), 5000);
              });
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
