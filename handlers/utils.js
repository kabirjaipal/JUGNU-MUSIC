const JUGNU = require("./Client");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  CommandInteraction,
  ChannelType,
  Guild,
} = require("discord.js");
const { Queue, Song } = require("distube");

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  // code
  /**
   *
   * @param {Queue} queue
   */
  client.buttons = (state) => {
    let raw = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("skip")
        // .setLabel("Skip")
        .setEmoji(client.config.emoji.skip)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("pauseresume")
        // .setLabel("P/R")
        .setEmoji(client.config.emoji.pause_resume)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("loop")
        // .setLabel("Loop")
        .setEmoji(client.config.emoji.loop)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("stop")
        // .setLabel("Stop")
        .setEmoji(client.config.emoji.stop)
        .setDisabled(state),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("autoplay")
        // .setLabel("Autoplay")
        .setEmoji(client.config.emoji.autoplay)
        .setDisabled(state),
    ]);
    return raw;
  };

  client.editPlayerMessage = async (channel) => {
    const ID = client.temp.get(channel.guild.id);
    if (!ID) return;

    let playembed =
      channel.messages.cache.get(ID) ||
      (await channel.messages.fetch(ID).catch(console.error));
    if (!playembed) return;

    if (client.config.options.nowplayingMsg) {
      playembed.delete().catch(() => {});
    } else {
      const embeds = playembed?.embeds?.[0];
      if (embeds) {
        playembed
          .edit({
            embeds: [
              embeds.setFooter({
                text: `⛔️ SONG & QUEUE ENDED!`,
                iconURL: channel.guild.iconURL({ dynamic: true }),
              }),
            ],
            components: [client.buttons(true)],
          })
          .catch(console.error);
      }
    }
  };

  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.getQueueEmbeds = async (queue) => {
    const guild = client.guilds.cache.get(queue.textChannel.guildId);
    const maxTracks = 10; // Tracks per Queue Page
    const tracks = queue.songs.slice(1); // Make a shallow copy and remove the first song

    const quelist = [];
    for (let i = 0; i < tracks.length; i += maxTracks) {
      const songs = tracks.slice(i, i + maxTracks);
      quelist.push(
        songs
          .map(
            (track, index) =>
              `\` ${i + index + 1}. \` ** ${client.getTitle(track)}** - \`${
                track.isLive
                  ? `LIVE STREAM`
                  : track.formattedDuration.split(` | `)[0]
              }\` \`${track.user.tag}\``
          )
          .join(`\n`)
      );
    }

    const embeds = [];
    for (let i = 0; i < quelist.length; i++) {
      const desc = String(quelist[i]).substring(0, 2048);
      embeds.push(
        new EmbedBuilder()
          .setAuthor({
            name: `Queue for ${guild.name}  -  [ ${tracks.length} Tracks ]`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
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
      .setAuthor({ name: `Jugnu Music Queue` })
      .setDescription("The music queue is empty.");

    return embed;
  };

  /**
   *
   * @param {Guild} guild
   */
  client.playembed = (guild) => {
    const embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: "Join a Voice Channel and Type Song Link/Name to Play",
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `[Invite Now](${client.config.links.inviteURL}) • [Support Server](${client.config.links.DiscordServer}) • [Website](${client.config.links.Website})`
      )
      .setImage(
        guild.banner
          ? guild.bannerURL({ size: 4096 })
          : "http://cdn.wallpaperinhd.net/wp-content/uploads/2018/11/02/Music-Background-Wallpaper-025.jpg"
      )
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL(),
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
    try {
      const data = await client.music.get(`${guild.id}.music`);
      if (!data) return;

      const musicchannel = guild.channels.cache.get(data.channel);
      if (!musicchannel) return;

      // Fetch both playmsg and queuemsg simultaneously using Promise.all()
      const [playmsg, queuemsg] = await Promise.all([
        musicchannel.messages.fetch(data.pmsg).catch(() => {}),
        musicchannel.messages.fetch(data.qmsg).catch(() => {}),
      ]);

      // If either playmsg or queuemsg is not found, return
      if (!playmsg || !queuemsg) return;

      // Edit playmsg and queuemsg simultaneously using Promise.all()
      await Promise.all([
        playmsg.edit({
          embeds: [client.playembed(guild)],
          components: [client.buttons(true)],
        }),
        queuemsg.edit({ embeds: [client.queueembed(guild)] }),
      ]);
    } catch (error) {
      console.error("Error updating embed:", error);
    }
  };

  // update queue
  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.updatequeue = async (queue) => {
    try {
      const guild = client.guilds.cache.get(queue.textChannel.guildId);
      if (!guild) return;

      const data = await client.music.get(`${guild.id}.music`);
      if (!data) return;

      const musicchannel = guild.channels.cache.get(data.channel);
      if (!musicchannel) return;

      let queueembed = await musicchannel.messages
        .fetch(data.qmsg)
        .catch(() => {});

      if (!queueembed) return;

      const currentSong = queue.songs[0];

      let queueString = "";
      for (let index = 1; index < Math.min(queue.songs.length, 10); index++) {
        const track = queue.songs[index];
        queueString += `\`${index}.\` **${client.getTitle(track)}** - ${
          track.isLive ? "LIVE STREAM" : track.formattedDuration.split(" | ")[0]
        } - \`${track.user.tag}\`\n`;
      }

      const newQueueEmbed = new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setAuthor({
          name: `Jugnu Queue - [${queue.songs.length} Tracks]`,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .addFields([
          {
            name: `**\`0.\` __CURRENT TRACK__**`,
            value: `**${client.getTitle(currentSong)}** - ${
              currentSong?.isLive
                ? "LIVE STREAM"
                : currentSong?.formattedDuration.split(" | ")[0]
            } - \`${currentSong?.user.tag}\``,
          },
        ]);

      if (queueString.length > 0) {
        newQueueEmbed.setDescription(queueString.substring(0, 2048));
      }

      await queueembed.edit({ embeds: [newQueueEmbed] });
    } catch (error) {
      console.error("Error updating queue:", error);
    }
  };

  // update player
  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.updateplayer = async (queue) => {
    try {
      const guild = client.guilds.cache.get(queue.textChannel.guildId);
      if (!guild) return;

      const data = await client.music.get(`${guild.id}.music`);
      if (!data) return;

      const musicchannel = guild.channels.cache.get(data.channel);
      if (!musicchannel) return;

      let playembed = await musicchannel.messages
        .fetch(data.pmsg)
        .catch(() => {});
      if (!playembed) return;

      const track = queue.songs[0];

      if (!track || !track.name) return;

      const newEmbed = new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setImage(track?.thumbnail)
        .setTitle(client.getTitle(track))
        .setURL(track?.url)
        .addFields(
          {
            name: "**Requested By**",
            value: `\`${track.user.tag}\``,
            inline: true,
          },
          {
            name: "**Author**",
            value: `\`${track.uploader.name || "😏"}\``,
            inline: true,
          },
          {
            name: "**Duration**",
            value: `\`${track.formattedDuration}\``,
            inline: true,
          }
        )
        .setFooter(client.getFooter(track.user));

      await playembed.edit({
        embeds: [newEmbed],
        components: [client.buttons(false)],
      });
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  /**
   *
   * @param {Guild} guild
   * @returns
   */
  client.joinVoiceChannel = async (guild) => {
    try {
      const db = await client.music?.get(`${guild.id}.vc`);
      if (!db || !db.enable) return;

      if (!guild.members.me.permissions.has(PermissionFlagsBits.Connect))
        return;

      const voiceChannel = guild.channels.cache.get(db.channel);
      if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) return;

      // Join the voice channel immediately
      await client.distube.voices.join(voiceChannel);
    } catch (error) {
      console.error("Error joining voice channel:", error);
    }
  };

  /**
   *
   * @param {CommandInteraction} interaction
   */
  client.handleHelpSystem = async (interaction) => {
    const send = interaction?.deferred
      ? interaction.followUp.bind(interaction)
      : interaction.reply.bind(interaction);

    const user = interaction.member.user;
    const commands = interaction?.user ? client.commands : client.mcommands;
    const categories = interaction?.user
      ? client.scategories
      : client.mcategories;

    const emoji = { Information: "🔰", Music: "🎵", Settings: "⚙️" };

    const allcommands = client.mcommands.size;
    const allguilds = client.guilds.cache.size;
    const botuptime = `<t:${Math.floor(
      Date.now() / 1000 - client.uptime / 1000
    )}:R>`;
    const buttons = [
      new ButtonBuilder()
        .setCustomId("home")
        .setStyle(ButtonStyle.Success)
        .setEmoji("🏘️"),
      categories
        .map((cat) =>
          new ButtonBuilder()
            .setCustomId(cat)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emoji[cat])
        )
        .flat(),
    ].flat();
    const row = new ActionRowBuilder().addComponents(buttons);

    const help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(
        `**An advanced Music System with Audio Filtering A unique Music Request System and much more!**`
      )
      .addFields([
        {
          name: `Stats`,
          value: `>>> **:gear: \`${allcommands}\` Commands\n:file_folder: \`${allguilds}\` Guilds\n⌚️ ${botuptime} Uptime\n🏓 \`${client.ws.ping}\` Ping\nMade by [\`Fire Bird\`](https://discord.gg/PcUVWApWN3)**`,
        },
      ])
      .setFooter(client.getFooter(user));

    const main_msg = await send({
      embeds: [help_embed],
      components: [row],
      ephemeral: true,
    });

    const filter = async (i) => {
      if (i.user.id === user.id) return true;
      else {
        await i.deferReply().catch(() => {});
        i.followUp({
          content: `Not Your Interaction !!`,
          ephemeral: true,
        }).catch(() => {});
        return false;
      }
    };

    const colector = main_msg.createMessageComponentCollector({ filter });

    colector.on("collect", async (i) => {
      if (i.isButton()) {
        await i.deferUpdate().catch(() => {});
        const directory = i.customId;
        if (directory == "home")
          main_msg.edit({ embeds: [help_embed] }).catch(() => {});
        else {
          main_msg
            .edit({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.embed.color)
                  .setTitle(
                    `${emoji[directory]} ${directory} Commands ${emoji[directory]}`
                  )
                  .setDescription(
                    `>>> ${commands
                      .filter((cmd) => cmd.category === directory)
                      .map((cmd) => `\`${cmd.name}\``)
                      .join(",  ")}`
                  )
                  .setThumbnail(client.user.displayAvatarURL())
                  .setFooter(client.getFooter(user)),
              ],
            })
            .catch(() => {});
        }
      }
    });

    colector.on("end", async () => {
      row.components.forEach((c) => c.setDisabled(true));
      main_msg.edit({ components: [row] }).catch(() => {});
    });
  };

  /**
   *
   * @param {CommandInteraction} interaction
   */
  client.HelpCommand = async (interaction) => {
    const send = interaction?.deferred
      ? interaction.followUp.bind(interaction)
      : interaction.reply.bind(interaction);
    const user = interaction.member.user;
    // for commands
    const commands = interaction?.user ? client.commands : client.mcommands;
    // for categories
    const categories = interaction?.user
      ? client.scategories
      : client.mcategories;

    const emoji = {
      Information: "🔰",
      Music: "🎵",
      Settings: "⚙️",
    };

    let allCommands = categories.map((cat) => {
      let cmds = commands
        .filter((cmd) => cmd.category == cat)
        .map((cmd) => `\`${cmd.name}\``)
        .join(" ' ");

      return {
        name: `${emoji[cat]} ${cat}`,
        value: cmds,
      };
    });

    let help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: `My Commands`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(allCommands)
      .setFooter(client.getFooter(user));

    send({
      embeds: [help_embed],
    });
  };

  /**
   *
   * @param {Song} song
   * @returns {string}
   */
  client.getTitle = (song) => {
    try {
      if (!song) return;
      const TrackTitle = song.name || song.playlist.name;

      if (!TrackTitle) return "Unknown Track";

      const title = TrackTitle.replace(/[\[\(][^\]\)]*[\]\)]/, "").trim();

      const parts = title.split("|");

      const shortTitle = parts[0].trim();

      return shortTitle.substring(0, 25);
    } catch (error) {
      console.error("Error while processing track title:", error);
      return "Unknown Track";
    }
  };
};
