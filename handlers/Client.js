const { Client, Collection, Intents } = require("discord.js");
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
      partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "USER"],
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS,
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
        text: `Requsted By ${user.tag}`,
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
      emitNewSongOnly: true,
      emitAddSongWhenCreatingQueue: false,
      emitAddListWhenCreatingQueue: false,
      plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true,
          parallel: true,
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin(),
      ],
      youtubeDL: false,
      emptyCooldown: 2,
      nsfw: false,
      savePreviousSongs: true,
      searchCooldown: 0,
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
