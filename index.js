
const config = require("./config.json");
const {
    Client,
    Collection
} = require("discord.js");
const keepAlive = require('./keepalive')
const Discord = require('discord.js');
const fs = require("fs");
const DisTube = require("distube");
//creating the client
const client = new Client({
    fetchAllMembers: false,
    restTimeOffset: 0,
    shards: "auto",
    disableEveryone: true
});

client.commands = new Collection();
client.queue = new Map();
client.aliases = new Collection();
const cooldowns = new Collection();
let prefix = config.prefix;
const https = require('https-proxy-agent');
const proxy = 'http://123.123.123.123:8080';
const agent = https(proxy);
client.distube = new DisTube(client, {
    youtubeCookie: config.cookie,
    requestOptions: {
        agent
    },
    emitNewSongOnly: true,
    highWaterMark: 1024 * 1024 * 64,
    leaveOnEmpty: false,
    leaveOnFinish: false,
    leaveOnStop: false,
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
        return message.reply(`Unkown command, try: ${prefix}help`).then(msg => msg.delete({
            timeout: 3000
        }));
});
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
