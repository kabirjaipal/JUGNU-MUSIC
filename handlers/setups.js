const config = require("../config.json")
console.log("Loading Setups")
const functions = require("../functions");
const { readdirSync } = require("fs");
module.exports = (client) => {
    client.on("guildCreate", guild => {
        client.settings.delete(guild.id, "prefix");
        client.settings.delete(guild.id, "djroles");
        client.settings.delete(guild.id, "playingembed");
        client.settings.delete(guild.id, "playingchannel");
        client.settings.delete(guild.id, "botchannel");
        client.custom.delete(guild.id, "playlists");
        client.custom.ensure(guild.id, {
            playlists: [],
        });
        client.settings.ensure(guild.id, {
            prefix: config.prefix,
            djroles: [],
            playingembed: "",
            playingchannel: "",
            botchannel: [],
        });
        getAll(client, guild)
    })
    //When a Channel got deleted, try to remove it from the BOTCHANNELS     
    client.on("channelDelete", function (channel) {
        client.settings.remove(channel.guild.id, channel.id, `botchannel`);
    });
    //When a Role got deleted, try to remove it from the DJROLES
    client.on("roleDelete", function (role) {
        client.settings.remove(role.guild.id, role.id, `djroles`);
    });
    client.on("message", async message => {
        client.custom.ensure(message.guild.id, {
            playlists: [],
        });
        client.custom2.ensure(message.author.id, {
            myplaylists: [],
        });
        client.infos.ensure("global", {
            cmds: 0,
            songs: 0,
            filters: 0,
        })
        client.settings.ensure(message.guild.id, {
            prefix: config.prefix,
            djroles: [],
            playingembed: "",
            playingchannel: "",
            botchannel: [],
        });
        if (message.author.bot) return;
        if (!message.guild) return;
        //create the database for the OWN user
        client.custom2.ensure(message.author.id, {
            myplaylists: [],
        });

    });
    const {
        MessageEmbed
    } = require("discord.js");
    const {
        stripIndents
    } = require("common-tags");

    function getAll(client, guild) {
        const embed = new MessageEmbed()
            .setColor(config.colors.yes)
            .setTitle('THANKS FOR INVITING ME!')
            .addField("**__BOT BY:__**", `
                >>> <@821095540569407508> \`ᴋᴀʙɪʀ々ꜱɪɴɢʜ🌙#8148\` [\`INVITE\`](https://discord.com/api/oauth2/authorize?client_id=848431361094058006&permissions=8&scope=bot)
                `)
            .addField(`If You Want to Use 24/7 Service of Bot so \n Just Type ${config.prefix}setup to Active 24/7 Bot in Voice Channel Service IN Free...`)
            .setFooter(`To see command descriptions and usage type   ${config.prefix}help [CMD Name]`, client.user.displayAvatarURL())
        const channel = guild.channels.cache.find(
            channel =>
                channel.type === "text" &&
                channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        );
        return channel.send(embed.setDescription(`*use the Prefix **\`${config.prefix}\`** infront of EACH command, to use it correctly!*\n`));
    }
    client.on('voiceStateUpdate', (oldState, newState) => {
        if (newState.id === client.user.id && oldState.serverDeaf === true && newState.serverDeaf === false) {
            try {
                const channel = newState.member.guild.channels.cache.find(
                    channel =>
                        channel.type === "text" &&
                        (channel.name.includes("cmd") || channel.name.includes("command") || channel.name.includes("bot")) &&
                        channel.permissionsFor(newState.member.guild.me).has("SEND_MESSAGES")
                );
                channel.send("Don't unmute me!, i muted my self again! This safes Data so it gives you a faster and smoother experience")
                newState.setDeaf(true);
            } catch (error) {
                try {
                    const channel = newState.member.guild.channels.cache.find(
                        channel =>
                            channel.type === "text" &&
                            channel.permissionsFor(newState.member.guild.me).has("SEND_MESSAGES")
                    );
                    channel.send("Don't unmute me!, i muted my self again! This safes Data so it gives you a faster and smoother experience")
                    newState.setDeaf(true);
                } catch (error) {
                    newState.setDeaf(true);
                }
            }
        }
    });
}
