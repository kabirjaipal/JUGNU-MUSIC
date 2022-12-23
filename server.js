const express = require("express");
const client = require("./index");
const cors = require("cors");
const { version } = require("discord.js");
const app = express();
const port = process.env.PORT || 3000;
const os = require("os");
const { msToDuration } = require("./handlers/functions");

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send(`Hello World`);
});

app.get("/home", (req, res) => {
  res.send(client.user);
});

app.get("/commands", (req, res) => {
  const commands = {
    mcommands: client.mcommands,
    mcategories: client.mcategories,
    scommands: client.commands,
    scategories: client.scategories,
  };
  res.send(commands);
});

app.get("/about", (req, res) => {
  let TotalRam = Math.floor(os.totalmem() / (1024 * 1024));
  let FreeRam = Math.floor(os.freemem() / (1024 * 1024));

  let options = {
    guildsCount: client.guilds.cache.size,
    usersCount: client.users.cache.size,
    channelsCount: client.channels.cache.size,
    uptime: msToDuration(client.uptime),
    DJSVersion: `v${version}`,
    NodeVersion: `${process.version}`,
    ping: `${client.ws.ping}ms`,
    cpu: os.cpus().map((i) => `${i.model}`)[0],
    ram: {
      total: `${TotalRam}MB`,
      usage: `${TotalRam - FreeRam}MB`,
    },
  };
  res.send(options);
});

app.get("/contact", (req, res) => {
  let options = {
    user: client.user,
  };
  res.send(options);
});

app.listen(port, () => {
  console.log(`Listing at http://localhost:${port}`);
});
