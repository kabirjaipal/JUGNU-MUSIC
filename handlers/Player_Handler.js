const player = require("./player");
const ee = require("../settings/embed.json");
const emoji = require("../settings/emoji.json");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Client,
  ButtonInteraction,
} = require("discord.js");
const chalk = require("chalk");

const status = (queue) =>
  `Volume: ${queue.volume}% • Filter: ${
    queue.filters.join(", ") || "Off"
  } • Status : ${queue.paused ? "Paused" : "Playing"} • Loop: ${
    queue.repeatMode ? (queue.repeatMode === 2 ? "Queue" : "Song") : "Off"
  } • Autoplay: ${queue.autoplay ? "On" : "Off"}`;

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  await player.setMaxListeners(25);
  try {
    // play song
    player.on("playSong", async (queue, song) => {
      if (!queue) return;
      client.updateplaymsg(queue);
      client.updatequeuemsg(queue);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setThumbnail(song.thumbnail)
              .setDescription(`>>> ** [\`${song.name}\`](${song.url}) **`)
              .addFields([
                {
                  name: `${emoji.song_by} Requested By`,
                  value: `>>> ${song.user}`,
                  inline: true,
                },
                {
                  name: `${emoji.time} Duration`,
                  value: `>>> \`${song.formattedDuration}\``,
                  inline: true,
                },
              ])
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
          components: [client.buttons],
        })
        .then((msg) => {
          client.temp2.set(queue.textChannel.guild.id, msg.id);
        });
    });

    // add song
    player.on("addSong", async (queue, song) => {
      if (!queue) return;
      client.updatequeuemsg(queue);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setAuthor({
                name: `Added to Queue`,
                iconURL: song.user.displayAvatarURL({ dynamic: true }),
                url: song.url,
              })
              .setDescription(`>>> ** [\`${song.name}\`](${song.url}) **`)
              .addFields([
                {
                  name: `${emoji.song_by} Requested By`,
                  value: `>>> ${song.user}`,
                  inline: true,
                },
                {
                  name: `${emoji.time} Duration`,
                  value: `>>> \`${song.formattedDuration}\``,
                  inline: true,
                },
              ])
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {});
          }, 5000);
        })
        .catch((e) => {});
    });

    // add list
    player.on("addList", async (queue, playlist) => {
      if (!queue) return;
      client.updatequeuemsg(queue);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setAuthor({
                name: `Playlist Added to Queue`,
                iconURL: playlist.user.displayAvatarURL({ dynamic: true }),
                url: playlist.url,
              })
              .setDescription(
                `>>> ** [\`${playlist.name}\`](${playlist.url}) **`
              )
              .addFields([
                {
                  name: `${emoji.song_by} Requested By`,
                  value: `>>> ${playlist.user}`,
                  inline: true,
                },
                {
                  name: `${emoji.time} Duration`,
                  value: `>>> \`${playlist.formattedDuration}\``,
                  inline: true,
                },
                {
                  name: `${emoji.lyrics} Songs`,
                  value: `>>> \`${playlist.songs.length} Songs\``,
                  inline: true,
                },
              ])
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {});
          }, 5000);
        })
        .catch((e) => {});
    });
    // disconnect
    player.on("disconnect", async (queue) => {
      if (!queue) return;
      client.updatemusic(queue.textChannel.guild);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      let ID = client.temp2.get(queue.textChannel.guild.id);
      let playembed = await queue.textChannel.messages.fetch(ID, {
        cache: true,
        force: true,
      });
      if (playembed) {
        playembed.edit({ components: [client.buttons2] }).catch((e) => {});
      }
      queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(
              `_ ${emoji.ERROR} Someone Disconnected me From Voice Channel _`
            )
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // finish song
    player.on("finishSong", async (queue, song) => {
      if (!queue) return;
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      let ID = client.temp2.get(queue.textChannel.guild.id);
      let playembed = await queue.textChannel.messages.fetch(ID, {
        cache: true,
        force: true,
      });
      if (playembed) {
        playembed.edit({ components: [client.buttons2] }).catch((e) => {});
      }
      queue.textChannel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setDescription(`_ [\`${song.name}\`](${song.url}) Ended Now  _`)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete().catch((e) => {});
          }, 10000);
        })
        .catch((e) => {});
    });
    // error
    player.on("error", async (channel, error) => {
      let channel1 = client.music.get(channel.guild.id, "channel");
      if (channel.id === channel1) return;
      let ID = client.temp2.get(channel.guild.id);
      let playembed = await channel.messages
        .fetch(ID, {
          cache: true,
          force: true,
        })
        .catch((e) => {});
      if (playembed) {
        playembed.edit({ components: [client.buttons2] }).catch((e) => {});
      }
      channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setTitle(`Found a Error...`)
            .setDescription(chalk.red(String(error).substr(0, 3000)))
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // no related
    player.on("noRelated", async (queue) => {
      if (!queue) return;
      client.updatemusic(queue.textChannel.guild);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setTitle(`No Related Song Found for \`${queue.songs[0].name}\``)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // finish queue
    player.on("finish", async (queue) => {
      if (!queue) return;
      client.updatemusic(queue.textChannel.guild);
      let data = await client.music.get(queue.textChannel.guild.id);
      if (queue.textChannel.id === data.channel) return;
      let ID = client.temp2.get(queue.textChannel.guild.id);
      let playembed = await queue.textChannel.messages.fetch(ID, {
        cache: true,
        force: true,
      });
      if (playembed) {
        playembed.edit({ components: [client.buttons2] }).catch((e) => {});
      }
      queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setDescription(
              ` Queue has ended! No more music to play... \n Enjoying  music with me? Consider voting me on [Top.gg](https://top.gg/bot/908662162174660619/vote)`
            )
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    });
    // init queue
    player.on("initQueue", async (queue) => {
      (queue.volume = 90), (queue.autoplay = false);
    });
  } catch (e) {
    console.log(chalk.red(e));
  }

  // interaction handling
  try {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.guild || interaction.user.bot) return;
      if (interaction.isButton()) {
        await interaction.deferUpdate().catch((e) => {});
        const { customId, member, guild } = interaction;
        let voiceMember = interaction.guild.members.cache.get(member.id);
        let channel = voiceMember.voice.channel;
        let queue = await player.getQueue(interaction.guild.id);
        switch (customId) {
          case "playp":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue || !queue.previousSongs.length) {
                send(
                  interaction,
                  `** ${emoji.ERROR} No Previous Song Found **`
                );
              } else {
                await queue.previous().catch((e) => {});
                send(
                  interaction,
                  `** ${emoji.previous_track} Playing Previous Song.**.`
                );
              }
            }
            break;
          case "skip":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else if (queue.songs.length === 1) {
                queue.stop().catch((e) => {});
                send(interaction, `** ${emoji.skip_track} Song Skiped !!**.`);
              } else {
                await queue.skip().catch((e) => {});
                send(interaction, `** ${emoji.skip_track} Song Skiped !!**.`);
              }
            }
            break;
          case "stop":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else {
                await queue.stop().catch((e) => {});
                send(interaction, `** ${emoji.stop} Song Stoped !!**.`);
              }
            }
            break;
          case "pause":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else if (queue.paused) {
                await queue.resume();
                client.buttons.components[1] = new MessageButton()
                  .setCustomId("pause")
                  .setStyle("SECONDARY")
                  .setLabel("Pause")
                  .setEmoji(emoji.pause);
                let ID =
                  client.temp.get(queue.textChannel.guild.id) ||
                  client.temp2.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});

                playembed
                  .edit({ components: [client.buttons] })
                  .catch((e) => {});

                send(interaction, `** ${emoji.resume} Song Resumed !! **`);
              } else if (!queue.paused) {
                await queue.pause();
                client.buttons.components[1] = new MessageButton()
                  .setCustomId("pause")
                  .setStyle("SECONDARY")
                  .setLabel("Resume")
                  .setEmoji(emoji.resume);
                let ID =
                  client.temp.get(queue.textChannel.guild.id) ||
                  client.temp2.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});
                if (playembed) {
                  playembed
                    .edit({ components: [client.buttons] })
                    .catch((e) => {});
                }
                send(interaction, `** ${emoji.pause} Song Paused !! **`);
              }
            }
            break;
          case "loop":
            {
              if (!channel) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join Voice Channel**`
                );
              } else if (
                interaction.guild.me.voice.channel &&
                !interaction.guild.me.voice.channel.equals(channel)
              ) {
                send(
                  interaction,
                  `** ${emoji.ERROR} You Need to Join __My__ Voice Channel **`
                );
              } else if (!queue) {
                send(interaction, `** 🎧 Nothing Playing **`);
              } else if (queue.repeatMode === 0) {
                await queue.setRepeatMode(1);
                client.buttons.components[3] = new MessageButton()
                  .setStyle("SECONDARY")
                  .setCustomId("loop")
                  .setLabel("Queue")
                  .setEmoji("🔁");
                  let ID =
                  client.temp.get(queue.textChannel.guild.id) ||
                  client.temp2.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});
                if (playembed) {
                  playembed
                    .edit({ components: [client.buttons] })
                    .catch((e) => {});
                }
                send(interaction, `** ${emoji.SUCCESS} Song Loop On !! **`);
              } else if (queue.repeatMode === 1) {
                await queue.setRepeatMode(2);
                client.buttons.components[3] = new MessageButton()
                  .setStyle("SECONDARY")
                  .setCustomId("loop")
                  .setLabel("Off")
                  .setEmoji(emoji.repeat_mode);
                  let ID =
                  client.temp.get(queue.textChannel.guild.id) ||
                  client.temp2.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});
                if (playembed) {
                  playembed
                    .edit({ components: [client.buttons] })
                    .catch((e) => {});
                }
                send(interaction, `** ${emoji.SUCCESS} Queue Loop On !! **`);
              } else if (queue.repeatMode === 2) {
                await queue.setRepeatMode(0);
                client.buttons.components[3] = new MessageButton()
                  .setStyle("SECONDARY")
                  .setCustomId("loop")
                  .setLabel("Song")
                  .setEmoji("🔂");
                  let ID =
                  client.temp.get(queue.textChannel.guild.id) ||
                  client.temp2.get(queue.textChannel.guild.id);
                let playembed = await queue.textChannel.messages
                  .fetch(ID, {
                    cache: true,
                    force: true,
                  })
                  .catch((e) => {});
                if (playembed) {
                  playembed
                    .edit({ components: [client.buttons] })
                    .catch((e) => {});
                }
                send(interaction, `** ${emoji.SUCCESS} Loop Off !! **`);
              }
            }
            break;
          default:
            break;
        }
      }
    });
  } catch (e) {
    console.log(chalk.red(e));
  }

  client.on("messageCreate", async (message) => {
    if (!message.guild || !message.guild.available) return;
    let data = await client.music.get(message.guildId);
    if (data.enable === false) return;
    let channel = await message.guild.channels.cache.get(data.channel);
    if (!channel) return;
    if (message.channel.id === channel.id) {
      if (message.author.bot) {
        setTimeout(() => {
          message.delete().catch((e) => {});
        }, 3000);
      } else {
        let voiceChannel = await message.member.voice.channel;
        if (!voiceChannel) {
          return send(message, `You need to Join Voice Channel`);
        } else if (
          message.guild.me.voice.channel &&
          !message.guild.me.voice.channel.equals(voiceChannel)
        ) {
          return send(message, `You need to Join \`My\` Voice Channel`);
        } else {
          let song = message.cleanContent;
          await message.delete().catch((e) => {});
          player
            .play(voiceChannel, song, {
              member: message.member,
              message: message,
              textChannel: message.channel,
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    }
  });
};

/**
 *
 * @param {ButtonInteraction} interaction
 * @param {String} string
 */
async function send(interaction, string) {
  interaction
    .followUp({
      embeds: [
        new MessageEmbed()
          .setColor(ee.color)
          .setTitle(string)
          .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
      ],
    })
    .then((m) => {
      setTimeout(() => {
        m.delete().catch((e) => {});
      }, 4000);
    });
}
