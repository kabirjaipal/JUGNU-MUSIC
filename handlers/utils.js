const JUGNU = require("./Client");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Queue } = require("distube");

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  // code
  client.embed = (interaction, data) => {
    let user = interaction.user ? interaction.user : interaction.author;
    if (interaction.deferred) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setDescription(` ${data.substring(0, 3000)}`)
              .setFooter(client.getFooter(user)),
          ],
        })
        .catch((e) => {});
    } else {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.embed.color)
              .setDescription(` ${data.substring(0, 3000)}`)
              .setFooter(client.getFooter(user)),
          ],
        })
        .catch((e) => {});
    }
  };
  /**
   *
   * @param {Queue} queue
   */
  client.buttons = (enable) => {
    let raw = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("skip")
        .setLabel("Skip")
        .setDisabled(enable),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setCustomId("pauseresume")
        .setLabel("Pause & Resume")
        .setDisabled(enable),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("loop")
        .setLabel("Loop")
        .setDisabled(enable),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId("stop")
        .setLabel("Stop")
        .setDisabled(enable),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("autoplay")
        .setLabel("Autoplay")
        .setDisabled(enable),
    ]);
    return raw;
  };

  client.editPlayerMessage = async (channel) => {
    let ID = client.temp.get(channel.guild.id);
    if (!ID) return;
    let playembed = channel.messages.cache.get(ID);
    if (!playembed) {
      playembed = await channel.messages.fetch(ID).catch((e) => {});
    }
    if (!playembed) return;
    if (client.config.options.nowplayingMsg == true) {
      playembed.delete().catch((e) => {});
    } else {
      let embeds = playembed?.embeds ? playembed?.embeds[0] : null;
      if (embeds) {
        playembed
          ?.edit({
            embeds: [
              embeds.setFooter({
                text: `⛔️ SONG & QUEUE ENDED!`,
                iconURL: channel.guild.iconURL({ dynamic: true }),
              }),
            ],
            components: [client.buttons(true)],
          })
          .catch((e) => {});
      }
    }
  };

  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.getQueueEmbeds = async (queue) => {
    let guild = client.guilds.cache.get(queue.textChannel.guildId);
    let quelist = [];
    var maxTracks = 10; //tracks / Queue Page
    let tracks = queue.songs;
    for (let i = 0; i < tracks.length; i += maxTracks) {
      let songs = tracks.slice(i, i + maxTracks);
      quelist.push(
        songs
          .map(
            (track, index) =>
              `\` ${i + ++index}. \` ** ${track.name.substring(0, 35)}** - \`${
                track.isLive
                  ? `LIVE STREAM`
                  : track.formattedDuration.split(` | `)[0]
              }\` \`${track.user.tag}\``
          )
          .join(`\n`)
      );
    }
    let limit = quelist.length <= 5 ? quelist.length : 5;
    let embeds = [];
    for (let i = 0; i < quelist.length; i++) {
      let desc = String(quelist[i]).substring(0, 2048);
      await embeds.push(
        new EmbedBuilder()
          .setAuthor({
            name: `Queue for ${guild.name}  -  [ ${tracks.length} Tracks ]`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .addFields([
            {
              name : `**\` N. \` *${
                tracks.length > maxTracks
                  ? tracks.length - maxTracks
                  : tracks.length
              } other Tracks ...***`,
              value : `\u200b`
            },
            {
              name : `**\` 0. \` __CURRENT TRACK__**`,
              value : `**${queue.songs[0].name.substring(0, 35)}** - \`${
                queue.songs[0].isLive
                  ? `LIVE STREAM`
                  : queue.songs[0].formattedDuration.split(` | `)[0]
              }\` \`${queue.songs[0].user.tag}\``
            }
          ])
          .setColor(client.config.embed.color)
          .setDescription(desc)
      );
    }
    return embeds;
  };

  client.status = (queue) =>
    `Volume: ${queue.volume}% • Status : ${
      queue.paused ? "Paused" : "Playing"
    } • Loop:  ${
      queue.repeatMode === 2 ? `Queue` : queue.repeatMode === 1 ? `Song` : `Off`
    } •  Autoplay: ${queue.autoplay ? `On` : `Off`} `;

  // embeds
  /**
   *
   * @param {Guild} guild
   */
  client.queueembed = (guild) => {
    let embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`${guild.name} || Queue`)
      .setDescription(`\n\n ** There are \`0\` Songs in Queue ** \n\n`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL({ dynamic: true }),
      });
    return embed;
  };

  /**
   *
   * @param {Guild} guild
   */
  client.playembed = (guild) => {
    let embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`Join a Voice Channel and Type Song Link/Name to Play`)
      .setDescription(
        ` [Invite Now](${client.config.links.inviteURL}) • [Support Server](${client.config.links.DiscordServer}) • [Vote Now](${client.config.links.VoteURL})`
      )
      .setImage(
        guild.banner
          ? guild.bannerURL({ size: 4096 })
          : `http://cdn.wallpaperinhd.net/wp-content/uploads/2018/11/02/Music-Background-Wallpaper-025.jpg`
      )
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL({ dynamic: true }),
      });

    return embed;
  };

  /**
   *
   * @param {Client} client
   * @param {Guild} guild
   * @returns
   */
  client.updateembed = async (client, guild) => {
    let data = await client.music.get(`${guild.id}.music`);
    if (!data) return;
    let musicchannel = guild.channels.cache.get(data.channel);
    if (!musicchannel) return;
    // play msg
    let playmsg = musicchannel.messages.cache.get(data.pmsg);
    if (!playmsg) {
      playmsg = await musicchannel.messages.fetch(data.pmsg).catch((e) => {});
    }
    // queue message
    let queuemsg = musicchannel.messages.cache.get(data.qmsg);
    if (!queuemsg) {
      queuemsg = await musicchannel.messages.fetch(data.qmsg).catch((e) => {});
    }
    if (!queuemsg || !playmsg) return;
    await playmsg
      .edit({
        embeds: [client.playembed(guild)],
        components: [client.buttons(true)],
      })
      .then(async (msg) => {
        await queuemsg
          .edit({ embeds: [client.queueembed(guild)] })
          .catch((e) => {});
      })
      .catch((e) => {});
  };

  // update queue
  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.updatequeue = async (queue) => {
    let guild = client.guilds.cache.get(queue.textChannel.guildId);
    if (!guild) return;
    let data = await client.music.get(`${guild.id}.music`);
    if (!data) return;
    let musicchannel = guild.channels.cache.get(data.channel);
    if (!musicchannel) return;
    let queueembed = musicchannel.messages.cache.get(data.qmsg);
    if (!queueembed) {
      queueembed = await musicchannel.messages
        .fetch(data.qmsg)
        .catch((e) => {});
    }
    if (!queueembed) return;
    let currentSong = queue.songs[0];
    let string = queue.songs
      ?.filter((t, i) => i < 10)
      ?.map((track, index) => {
        return `\` ${index + 1}. \` ** ${track.name.substring(0, 35)}** - \`${
          track.isLive ? `LIVE STREAM` : track.formattedDuration.split(` | `)[0]
        }\` \`${track.user.tag}\``;
      })
      ?.reverse()
      .join("\n");
    queueembed.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setAuthor({
            name: `Queue for ${guild.name}  -  [ ${queue.songs.length} Tracks ]`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setDescription(string.substring(0, 2048))
          .addFields([{
            name : `**\` 0. \` __CURRENT TRACK__**`,
            value : `**${currentSong.name.substring(0, 35)}** - \`${
              currentSong.isLive
                ? `LIVE STREAM`
                : currentSong.formattedDuration.split(` | `)[0]
            }\` \`${currentSong.user.tag}\``
          }])
          .setFooter({
            text: guild.name,
            iconURL: guild.iconURL({ dynamic: true }),
          }),
      ],
    });
  };
  // update player
  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.updateplayer = async (queue) => {
    let guild = client.guilds.cache.get(queue.textChannel.guildId);
    if (!guild) return;
    let data = await client.music.get(`${guild.id}.music`);
    if (!data) return;
    let musicchannel = guild.channels.cache.get(data.channel);
    if (!musicchannel) return;
    let playembed = musicchannel.messages.cache.get(data.pmsg);
    if (!playembed) {
      playembed = await musicchannel.messages.fetch(data.pmsg).catch((e) => {});
    }
    if (!playembed || !playembed.id) return;
    let track = queue.songs[0];
    if (!track.name) queue.stop();
    playembed.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setImage(track.thumbnail)
          .setTitle(track?.name)
          .setURL(track.url)
          .addFields([
            {
              name: `** Requested By **`,
              value: `\`${track.user.tag}\``,
              inline: true,
            },
            {
              name: `** Author **`,
              value: `\`${track.uploader.name || "😏"}\``,
              inline: true,
            },
            {
              name: `** Duration **`,
              value: `\`${track.formattedDuration}\``,
              inline: true,
            },
          ])
          .setFooter(client.getFooter(track.user)),
      ],
      components: [client.buttons(false)],
    });
  };

  client.joinVoiceChannel = async (guild) => {
    let db = await client.music?.get(`${guild.id}.vc`);
    if (!db?.enable) return;
    if (!guild.members.me.permissions.has("CONNECT")) return;
    let voiceChannel = guild.channels.cache.get(db.channel);
    setTimeout(() => {
      client.distube.voices.join(voiceChannel);
    }, 2000);
  };
  
};
