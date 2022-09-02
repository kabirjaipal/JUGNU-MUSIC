const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const fs = require("fs");
const Distube = require("distube").default;
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { filters, options } = require("../settings/config");

class JUGNU extends Client {
  constructor() {
    super({
      messageCacheLifetime: 60,
      fetchAllMembers: false,
      messageCacheMaxSize: 10,
      restTimeOffset: 0,
      restWsBridgetimeout: 100,
      shards: "auto",
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
      },
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      intents: [
        ,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });

    this.events = new Collection();
    this.cooldowns = new Collection();
    this.mcommands = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.mcategories = fs.readdirSync("./Commands/Message");
    this.scategories = fs.readdirSync("./Commands/Slash");
    this.temp = new Collection();
    this.config = require("../settings/config");
    this.getFooter = function (user) {
      let obj = {
        text: `Requested By ${user.tag}`,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      };
      if (options.embedFooter) {
        return obj;
      } else {
        return {
          text: " ",
          iconURL: " ",
        };
      }
    };
    this.distube = new Distube(this, {
      leaveOnEmpty: false,
      leaveOnFinish: false,
      leaveOnStop: true,
      plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true,
          parallel: true,
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin({
          update: false,
        }),
      ],
      emitNewSongOnly: false,
      savePreviousSongs: true,
      searchSongs: 0,
      customFilters: filters,
    });
  }

  start(token) {
    ["handler", "DistubeEvents", "utils"].forEach((handler) => {
      require(`./${handler}`)(this);
    });
    this.login(token);
  }
}

module.exports = JUGNU;
