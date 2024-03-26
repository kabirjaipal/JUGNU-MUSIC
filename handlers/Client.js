const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  User,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const Distube = require("distube").default;
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { filters, options } = require("../settings/config");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { StreamType } = require("distube");

class JUGNU extends Client {
  constructor() {
    super({
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      shards: "auto",
      failIfNotExists: false,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });

    this.events = new Collection();
    this.cooldowns = new Collection();
    this.mcommands = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.shuffleData = new Collection();
    this.leaveTimeoutHandles = new Collection();
    this.mcategories = fs.readdirSync("./Commands/Message");
    this.scategories = fs.readdirSync("./Commands/Slash");
    this.temp = new Collection();
    this.config = require("../settings/config");
    this.distube = new Distube(this, {
      leaveOnEmpty: false, // Leave voice channel only if manually stopped
      leaveOnFinish: false, // Don't leave after finishing a queue
      leaveOnStop: true, // Leave when the stop command is used
      searchSongs: 0, // Increase the number of search results to improve user choices
      emitNewSongOnly: true, // Emit 'playSong' event only when a new song starts playing
      directLink: true, // Direct link for youtube
      emptyCooldown: 0, // Reduce cooldown for empty queue
      nsfw: false, // Enable nsfw mode for searching
      streamType: StreamType.OPUS, // Use opus stream for better performance
      savePreviousSongs: true, // Save previous songs in the queue
      searchCooldown: 0, // Reduce search cooldown
      joinNewVoiceChannel: false, // Join the new voice channel when a song is played
      // Additional options
      customFilters: filters, // Use custom filters if needed
      ytdlOptions: {
        highWaterMark: 1024 * 1024 * 64, // Set higher highWaterMark for faster streaming
        quality: "highestaudio", // Get the highest quality audio
        format: "bestaudio/best", // Use the best audio format available
        liveBuffer: 60000, // Set liveBuffer to improve stream stability
        dlChunkSize: 1024 * 1024 * 4, // Increase download chunk size for faster downloading
      },
      // Plugins configuration
      plugins: [
        // Spotify Plugin with optimizations
        new SpotifyPlugin({
          emitEventsAfterFetching: true, // Emit events only after fetching data
          parallel: true, // Enable parallel fetching for faster processing
        }),
        new SoundCloudPlugin(), // SoundCloud Plugin remains the same
        // YouTube DL Plugin with optimizations
        new YtDlpPlugin({
          update: true, // Update youtube-dl automatically
          requestOptions: {
            // Configure request options for faster downloading
            maxRedirects: 5, // Increase maximum redirects
            timeout: 10000, // Set timeout for requests to avoid long waits
          },
        }),
      ],
    });
  }

  start(token) {
    [
      "handler",
      "DistubeEvents",
      "RequestChannel",
      "DistubeHandler",
      "utils",
    ].forEach((handler) => {
      require(`./${handler}`)(this);
    });
    this.login(token);
  }
  /**
   *
   * @param {User} user
   * @returns
   */
  getFooter(user) {
    const obj = {
      text: `Requested By ${user.username}`,
      iconURL: user.displayAvatarURL(),
    };

    return options.embedFooter ? obj : null;
  }

  embed(interaction, data) {
    let user = interaction.user ? interaction.user : interaction.author;
    if (interaction.deferred) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`${data.substring(0, 3000)}`)
              .setFooter(this.getFooter(user)),
          ],
        })
        .catch((e) => {});
    } else {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`${data.substring(0, 3000)}`)
              .setFooter(this.getFooter(user)),
          ],
        })
        .catch((e) => {});
    }
  }
}

module.exports = JUGNU;
