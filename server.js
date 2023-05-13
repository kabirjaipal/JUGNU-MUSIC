const express = require("express");
const client = require("./index");
const cors = require("cors");
const { version } = require("discord.js");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const ip = process.env.IP;
const os = require("systeminformation");
const { msToDuration, formatBytes } = require("./handlers/functions");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/home", (req, res) => {
  res.send(client.user);
});

app.get("/commands", (req, res) => {
  function cmdData(cmd) {
    return {
      name: cmd.name,
      description: cmd.description,
      category: cmd.category,
    };
  }
  const commands = {
    mcommands: client.mcommands.map((cmd) => cmdData(cmd)),
    mcategories: client.mcategories.map((cat) => cat),
    scommands: client.commands.map((cmd) => cmdData(cmd)),
    scategories: client.scategories.map((cat) => cat),
  };
  res.send(commands);
});

app.get("/about", async (req, res) => {
  let memory = await os.mem();
  let cpu = await os.cpu();

  let options = {
    guildsCount: client.guilds.cache.size,
    usersCount: client.users.cache.size,
    channelsCount: client.channels.cache.size,
    uptime: msToDuration(client.uptime),
    DJSVersion: `v${version}`,
    NodeVersion: `${process.version}`,
    ping: `${client.ws.ping}ms`,
    cpu: cpu.brand,
    ram: {
      total: formatBytes(memory.total),
      usage: formatBytes(memory.used),
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

// Serve the uptime HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/uptime.html");
});

// Get the bot uptime as JSON data
app.get("/uptime", (req, res) => {
  let totalSeconds = client.uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  let hours = Math.floor(totalSeconds / 3600) % 24;
  let minutes = Math.floor(totalSeconds / 60) % 60;
  let seconds = Math.floor(totalSeconds) % 60;
  let uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  res.json({ uptime });
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});


app.listen(port, () => {
  console.log(`Bot Site at http://${ip}:${port}`);
});
