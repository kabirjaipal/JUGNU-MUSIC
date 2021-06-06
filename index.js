
const config = require("./config.json");
const {
    Client,
    Collection
} = require("discord.js");
const keepAlive = require('./keepalive')
const Discord = require('discord.js');
const fs = require("fs");
const DisTube = require("distube");
require('canvas').registerFont("Genta.ttf", {
    family: "Genta"
}); //loading a font
//creating the client
const client = new Client({
    fetchAllMembers: false,
    restTimeOffset: 0,
    shards: "auto",
    disableEveryone: true
});
// const mongoose = require('mongoose');
// mongoose.connect('mongourl', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// }).then(console.log("MongoDB Connected"))

client.commands = new Collection();
client.queue = new Map();
client.aliases = new Collection();
const cooldowns = new Collection();

const https = require('https-proxy-agent');
const proxy = 'http://123.123.123.123:8080';
const agent = https(proxy);
client.distube = new DisTube(client, {
    youtubeCookie: config.cookie,
    requestOptions: {
        agent
    },
    searchSongs: true,
    emitNewSongOnly: true,
    highWaterMark: 1024 * 1024 * 64,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: true,
    searchSongs: false,
    youtubeDL: true,
    updateYouTubeDL: false,
    customFilters: config.customs
})
client.setMaxListeners(0);
require('events').defaultMaxListeners = 0;
//Externalfiles setups
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});
require("./handlers/setups")(client)
const functions = require("./functions")
//databases setups
const Enmap = require("enmap");
client.settings = new Enmap({
    name: "settings",
    dataDir: "./databases/settings"
});
client.infos = new Enmap({
    name: "infos",
    dataDir: "./databases/infos"
});
client.custom = new Enmap({
    name: "custom",
    dataDir: "./databases/playlist"
});
client.custom2 = new Enmap({
    name: "custom",
    dataDir: "./databases/playlist2"
});
function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
}


//registering a command setup
client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    //GET THE PREFIX

    let prefix = client.settings.get(message.guild.id, `prefix`);
    if (prefix === null) prefix = config.prefix; //if not prefix set it to standard prefix in the config.json file
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    prefix = matchedPrefix;

    if (!message.content.startsWith(prefix) && message.content.includes(client.user.id))
        if (!message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
            message.reply(new Discord.MessageEmbed().setColor(config.colors.yes).setAuthor(`${message.author.username}, My prefix is ${prefix}, to get started; type ${prefix}help`, message.author.displayAvatarURL({
                dynamic: true
            }), "Tech Boy Gaming"));
        else
            message.reply(`${message.author.username}, My prefix is ${prefix}, to get started; type ${prefix}help`)
    if (!message.content.startsWith(prefix)) return;

    //if not allowed to send embeds, return that
    if (!message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
        return message.reply("**:x: I am missing the Permission to `EMBED_LINKS`**")

    //CHECK IF IN A BOT CHANNEL OR NOT
    if (client.settings.get(message.guild.id, `botchannel`).toString() !== "") {
        if (!client.settings.get(message.guild.id, `botchannel`).includes(message.channel.id) && !message.member.hasPermission("ADMINISTRATOR")) {
            let leftb = "";
            for (let i = 0; i < client.settings.get(message.guild.id, `botchannel`).length; i++) {
                leftb += "<#" + client.settings.get(message.guild.id, `botchannel`)[i] + "> / "
            }
            return functions.embedbuilder(client, 5000, message, config.colors.no, `Not in the Bot Chat!`, `There is a Bot chat setup in this GUILD! try using the Bot Commands here: 
            > ${leftb}`)
        }
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 2) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(
                    `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
                );
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        client.infos.set("global", Number(client.infos.get("global", "cmds")) + 1, "cmds");

        message.react("✅").catch(e => console.log("COULD NOT REACT F"))

        try {
            command.run(client, message, args);
        } catch (error) {
            console.error(error)
            functions.embedbuilder(client, 5000, message, "RED", "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
            functions.errorbuilder(error.stack.toString().substr(0, 2000))
        }
    } else
        return message.reply(`Unkown command, try: ${prefix}help`)
});

// 24 w
const { CHANNEL_ID, SERVER_ID, YT_LINK } = require("./24.json");
const ytdl = require('ytdl-core');

client.on('ready', async () => {
    // let channel = client.channels.cache.get("JUGNU") || await client.channels.fetch("JUGNU")
    let channel = client.channels.cache.find(ch => ch.name === "🎧｜JUGNU Music") || client.channels.cache.get(CHANNEL_ID)
    // replace JUGNU Music To Your Voice Channel Name

    if (!channel) return;
    const connection = await channel.join();
    connection.play(ytdl(YT_LINK))
})
setInterval(async function () {
    if (!client.voice.connections.get(SERVER_ID)) {
        // let channel = client.channels.cache.get("JUGNU") || await client.channels.fetch("JUGNU")
        let channel = client.channels.cache.find(ch => ch.name === "🎧｜JUGNU Music") || client.channels.cache.get(CHANNEL_ID)
        // replace JUGNU Music To Your Voice Channel Name
        if (!channel) return;

        const connection = await channel.join()
        connection.play(ytdl(YT_LINK))
    }
})

client.on('message', async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.channel.partial) await message.channel.fetch();
    if (message.partial) await message.fetch();
    let prefix = config.prefix
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) {
        if (matchedPrefix.includes(client.user.id)) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor(config.colors.yes)
                .setFooter("Made By Kabir Jaipal aka Tech Boy Gaming")
                .setTitle(`Hugh? I got pinged? Imma give you some help`)
                .setDescription(`To see all Commands type: \`${prefix}help\``)
            )
        }
    }
})
keepAlive();
client.login(config.token);


