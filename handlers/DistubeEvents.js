const { EmbedBuilder } = require("discord.js");
const JUGNU = require("./Client");
const AutoresumeHandler = require("./AutoresumeHandler");
const InitAutoResume = require("./InitAutoResume");

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  client.on("ready", async () => {
    setTimeout(async () => await AutoresumeHandler(client), 2 * client.ws.ping);
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
            .setDescription(`** [\`${client.getTitle(song)}\`](${song.url}) **`)
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
            .setDescription(`[\`${client.getTitle(song)}\`](${song.url})`)
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
            `> The bot has been disconnected from the voice channel.`
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
    await client.updatequeue(queue);
    await client.updateplayer(queue);
  });

  client.distube.on("finish", async (queue) => {
    await client.updateembed(client, queue.textChannel.guild);
    await client.editPlayerMessage(queue.textChannel);
    // Remove auto-resume entry
    await client.autoresume.delete(queue.textChannel.guild.id);

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
    queue.volume = client.config.options.defaultVolume;

    // init auto resume for the queue
    await InitAutoResume(client, queue);
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
};
