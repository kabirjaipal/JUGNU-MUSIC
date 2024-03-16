"use strict";
const { EmbedBuilder } = require("discord.js");
const JUGNU = require("./Client");
const { Song, SearchResultVideo } = require("distube");

const voiceMap = new Map();

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  client.distube.setMaxListeners(0);

  async function autoresume() {
    if (!client.autoresume) return;
    let guildIds = await client.autoresume.keys;
    if (!guildIds || !guildIds.length) return;
    for (const gId of guildIds) {
      let guild = client.guilds.cache.get(gId);
      if (!guild) await client.autoresume.delete(gId);
      let data = await client.autoresume.get(guild.id);
      if (!data) return;
      let voiceChannel = guild.channels.cache.get(data.voiceChannel);
      if (!voiceChannel && data.voiceChannel)
        voiceChannel =
          (await guild.channels.fetch(data.voiceChannel).catch(() => {})) ||
          false;
      if (
        !voiceChannel ||
        !voiceChannel.members ||
        voiceChannel.members.filter(
          (m) => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf
        ).size < 1
      ) {
        client.autoresume.delete(gId);
      }
      let textChannel = guild.channels.cache.get(data.textChannel);
      if (!textChannel)
        textChannel =
          (await guild.channels.fetch(data.textChannel).catch(() => {})) ||
          false;
      if (!textChannel) await client.autoresume.delete(gId);
      let tracks = data.songs;
      if (!tracks || !tracks[0]) continue;
      const makeTrack = async (track) => {
        return new Song(
          new SearchResultVideo({
            duration: track.duration,
            formattedDuration: track.formattedDuration,
            id: track.id,
            isLive: track.isLive,
            name: track.name,
            thumbnail: track.thumbnail,
            type: "video",
            uploader: track.uploader,
            url: track.url,
            views: track.views,
          }),
          guild.members.cache.get(track.memberId) || guild.members.me,
          track.source
        );
      };
      await client.distube.play(voiceChannel, tracks[0].url, {
        member: guild.members.cache.get(tracks[0].memberId) || guild.members.me,
        textChannel: textChannel,
      });
      let newQueue = client.distube.getQueue(guild.id);
      for (const track of tracks.slice(1)) {
        newQueue.songs.push(await makeTrack(track));
      }
      await newQueue.setVolume(data.volume);
      if (data.repeatMode && data.repeatMode !== 0) {
        newQueue.setRepeatMode(data.repeatMode);
      }
      if (!data.playing) {
        newQueue.pause();
      }
      await newQueue.seek(data.currentTime);
      if (!data.playing) {
        newQueue.pause();
      }
      await client.autoresume.delete(newQueue.textChannel.guildId);
    }
  }

  client.on("ready", async () => {
    setTimeout(async () => await autoresume(), 2 * client.ws.ping);
  });

  // events
  client.distube.on("playSong", async (queue, song) => {
    let data = await client.music.get(`${queue.textChannel.guildId}.music`);
    if (data) {
      await client.updatequeue(queue);
      await client.updateplayer(queue);
      if (data.channel === queue.textChannel.id) return;
    }
    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(`** [\`${song.name}\`](${song.url}) **`)
            .addFields([
              {
                name: `Requested By`,
                value: `\`${song.user.tag}\``,
                inline: true,
              },
              {
                name: `Author`,
                value: `\`${song.uploader.name}\``,
                inline: true,
              },
              {
                name: `Duration`,
                value: `\`${song.formattedDuration}\``,
                inline: true,
              },
            ])
            .setFooter(client.getFooter(song.user)),
        ],
        components: [client.buttons(false)],
      })
      .then((msg) => {
        client.temp.set(queue.textChannel.guildId, msg.id);
      });
  });

  client.distube.on("addSong", async (queue, song) => {
    let data = await client.music.get(`${queue.textChannel.guildId}.music`);
    if (data) {
      await client.updatequeue(queue);
      if (data.channel === queue.textChannel.id) return;
    }
    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setAuthor({
              name: `Added to Queue`,
              iconURL: song.user.displayAvatarURL({ dynamic: true }),
              url: song.url,
            })
            .setThumbnail(song.thumbnail)
            .setDescription(`[\`${song.name}\`](${song.url})`)
            .addFields([
              {
                name: `Requested By`,
                value: `\`${song.user.tag}\``,
                inline: true,
              },
              {
                name: `Author`,
                value: `\`${song.uploader.name}\``,
                inline: true,
              },
              {
                name: `Duration`,
                value: `\`${song.formattedDuration}\``,
                inline: true,
              },
            ])
            .setFooter(client.getFooter(song.user)),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("addList", async (queue, playlist) => {
    let data = await client.music.get(`${queue.textChannel.guildId}.music`);
    if (data) {
      await client.updatequeue(queue);
      if (data.channel === queue.textChannel.id) return;
    }

    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setAuthor({
              name: `Playlist Added to Queue`,
              iconURL: playlist.user.displayAvatarURL({ dynamic: true }),
              url: playlist.url,
            })
            .setThumbnail(playlist.thumbnail)
            .setDescription(`** [\`${playlist.name}\`](${playlist.url}) **`)
            .addFields([
              {
                name: `Requested By`,
                value: `\`${playlist.user.tag}\``,
                inline: true,
              },
              {
                name: `Songs`,
                value: `\`${playlist.songs.length}\``,
                inline: true,
              },
              {
                name: `Duration`,
                value: `\`${playlist.formattedDuration}\``,
                inline: true,
              },
            ])
            .setFooter(client.getFooter(playlist.user)),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("disconnect", async (queue) => {
    try {
      const guildId = queue.textChannel.guildId;
      const voiceChannelId = voiceMap.get(guildId);

      // Remove auto-resume entry
      await client.autoresume.delete(guildId);

      // Edit player message
      await client.editPlayerMessage(queue.textChannel);

      // Update embed
      await client.updateembed(client, queue.textChannel.guild);

      // Check if auto-joining is enabled in the database
      const db = await client.music?.get(`${guildId}.vc`);
      const data = await client.music.get(`${guildId}.music`);

      if (!db?.enable && data && data.channel !== queue.textChannel.id) {
        // If auto-joining is disabled and the current queue channel does not match the disconnected channel
        const embed = new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setDescription(
            `${client.config.emoji.ERROR} Disconnected From <#${voiceChannelId}> Voice Channel`
          );

        const msg = await queue.textChannel.send({ embeds: [embed] });
        setTimeout(() => msg.delete().catch(() => {}), 3000);
      } else if (db?.enable) {
        // If auto-joining is enabled, rejoin the voice channel
        await client.joinVoiceChannel(queue.textChannel.guild);
      }
    } catch (error) {
      console.error("An error occurred in disconnect event:", error);
    }
  });

  client.distube.on("error", async (channel, error) => {
    channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setTitle(`Found a Error...`)
            .setDescription(String(error).substring(0, 3000)),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("noRelated", async (queue) => {
    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setTitle(`No Related Song Found for \`${queue?.songs[0].name}\``),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("finishSong", async (queue, song) => {
    await client.editPlayerMessage(queue.textChannel);
  });

  client.distube.on("finish", async (queue) => {
    await client.updateembed(client, queue.textChannel.guild);
    await client.editPlayerMessage(queue.textChannel);
    queue.textChannel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(`Queue has ended! No more music to play`),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("initQueue", async (queue) => {
    voiceMap.set(queue.textChannel.guildId, queue.voiceChannel.id);
    queue.volume = client.config.options.defaultVolume;
    /**
     * Autoresume Code
     */
    setInterval(async () => {
      let newQueue = client.distube.getQueue(queue.textChannel.guildId);
      let autoresume = await client.music.get(
        `${queue.textChannel.guildId}.autoresume`
      );
      if (newQueue && autoresume) {
        const buildTrack = (track) => {
          return {
            memberId: track.member.id,
            source: track.source,
            duration: track.duration,
            formattedDuration: track.formattedDuration,
            id: track.id,
            isLive: track.isLive,
            name: track.name,
            thumbnail: track.thumbnail,
            type: "video",
            uploader: track.uploader,
            url: track.url,
            views: track.views,
          };
        };
        await client.autoresume.ensure(queue.textChannel.guildId, {
          guild: newQueue.textChannel.guildId,
          voiceChannel: newQueue.voiceChannel ? newQueue.voiceChannel.id : null,
          textChannel: newQueue.textChannel ? newQueue.textChannel.id : null,
          songs:
            newQueue.songs && newQueue.songs.length > 0
              ? [...newQueue.songs].map((track) => buildTrack(track))
              : null,
          volume: newQueue.volume,
          repeatMode: newQueue.repeatMode,
          playing: newQueue.playing,
          currentTime: newQueue.currentTime,
          autoplay: newQueue.autoplay,
        });
        let data = await client.autoresume.get(newQueue.textChannel.guildId);
        if (!data) return;
        if (data?.guild != newQueue.textChannel.guildId) {
          await client.autoresume.set(
            `${newQueue.textChannel.guildId}.guild`,
            newQueue.textChannel.guildId
          );
        }
        if (
          data?.voiceChannel != newQueue.voiceChannel
            ? newQueue.voiceChannel.id
            : null
        ) {
          await client.autoresume.set(
            `${newQueue.textChannel.guildId}.voiceChannel`,
            newQueue.voiceChannel ? newQueue.voiceChannel.id : null
          );
        }
        if (
          data?.textChannel != newQueue.textChannel
            ? newQueue.textChannel.id
            : null
        ) {
          await client.autoresume.set(
            `${newQueue.textChannel.guildId}.textChannel`,
            newQueue.textChannel ? newQueue.textChannel.id : null
          );
        }

        if (data?.volume != newQueue.volume) {
          await client.autoresume.set(
            `${newQueue.textChannel.guildId}.volume`,
            newQueue.volume
          );
        }
        if (data?.repeatMode != newQueue.repeatMode) {
          await client.autoresume.set(
            `${newQueue.textChannel.guildId}.repeatMode`,
            newQueue.repeatMode
          );
        }
        if (data?.playing != newQueue.playing) {
          await client.autoresume.set(
            `${newQueue.textChannel.guildId}.playing`,
            newQueue.playing
          );
        }
        if (data?.currentTime != newQueue.currentTime) {
          await client.autoresume.set(
            `${newQueue.textChannel.guildId}.currentTime`,
            newQueue.currentTime
          );
        }
        if (data?.autoplay != newQueue.autoplay) {
          await client.autoresume.set(
            `${newQueue.textChannel.guildId}.autoplay`,
            newQueue.autoplay
          );
        }
        if (newQueue?.songs && !arraysEqual(data?.songs, [...newQueue.songs])) {
          await client.autoresume.set(
            `${newQueue.textChannel.guildId}.songs`,
            [...newQueue.songs].map((track) => buildTrack(track))
          );
        }

        function arraysEqual(a, b) {
          if (a === b) return true;
          if (a == null || b == null) return false;
          if (a.length !== b.length) return false;

          for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
          }
          return true;
        }
      }
    }, 10000);
  });

  client.distube.on("searchCancel", async (message, quary) => {
    message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(`I cant search \`${quary}\``),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  client.distube.on("searchNoResult", async (message, quary) => {
    message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(
              `${client.config.emoji.ERROR} No result found for \`${quary}\`!`
            ),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => null);
        }, 5000);
      });
  });

  // interaction events handlers
  require("./DistubeHandler")(client);

  // request channel
  require("./RequestChannel")(client);
};
