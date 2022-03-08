const Distube = require("distube").default;
const client = require("../index");
const filters = require("../settings/filters.json");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require(`@distube/yt-dlp`);
let spotifyoptions = {
  parallel: true,
  emitEventsAfterFetching: true,
};

let player = new Distube(client, {
  customFilters: filters,
  emitAddListWhenCreatingQueue: true,
  emitAddSongWhenCreatingQueue: true,
  emitNewSongOnly: false,
  emptyCooldown: 2,
  leaveOnEmpty: false,
  leaveOnFinish: false,
  leaveOnStop: true,
  nsfw: true,
  savePreviousSongs: true,
  searchCooldown: 0,
  searchSongs: 0,
  updateYouTubeDL: true,
  youtubeDL: true,
  plugins: [
    new SpotifyPlugin(spotifyoptions),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});

module.exports = player;
