const { Client, Message, MessageEmbed } = require('discord.js');
const solenolyrics = require('solenolyrics');
const config = require("../../config.json")
const functions = require('../../functions')


module.exports = {
    name: "lyrics",
    aliases: ["ly", "songtext"],
    useage: "lyrics",
    description: "Shows you the Lyrics for the CURRENT playing song, ..",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)
        // if song not provided
        if (!args[0]) return functions.embedbuilder(client, 3000, message, config.colors.no, "Bruh, Provide a Song!")

        // wait for lyrics

        let embed = new MessageEmbed()
            .setDescription(`**Please wait, im looking for the Lyrics, It can take \`few \` seconds** ⌚ .`)
            .setColor(config.colors.yes)

        const msg = await message.channel.send(embed)

        // lyrics varibles
        let queue = client.distube.getQueue(message);
        let cursong = queue.songs[0];

        const solenolyrics = require('solenolyrics');
        let ar = args.join(' ').split(/\s*,\s*/);
        var lyrics = await solenolyrics.requestLyricsFor(cursong) || solenolyrics.requestLyricsFor(ar[0]);
        var title = await solenolyrics.requestTitleFor(ar[0]);
        // console.log(title);
        var author = await solenolyrics.requestAuthorFor(ar[0]);
        // console.log(author);
        var icon = await solenolyrics.requestIconFor(ar[0]);

        if (lyrics.length > 4095) {
            msg.delete()
            return functions.embedbuilder(client, 3000, message, config.colors.no, "Lyrics are too long to be returned as embed!")

        }
        let succesfull = new MessageEmbed()
            .setColor(config.colors.yes)
            .setTitle(title)
            .setThumbnail(icon)
            .setDescription(lyrics)
            .setAuthor(author)
            .setFooter("Made By Kabir Jaipal aka Tech Boy Gaming")
            .setTimestamp();
        msg.edit(succesfull)
    }
}