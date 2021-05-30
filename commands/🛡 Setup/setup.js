const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'setup',
    aliases: ['musicsetup'],
    cooldown: 10,
    usage: "setup",
    description: "Creates an unique Music Setup for Requesting Songs!",
    memberpermissions: ["ADMINISTRATOR"],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        // code here
        message.guild.channels.create("JUGNU Music - Requests", {
            type: 'category',
            permissionOverwrites: [{
                id: message.guild.id,
                allow: ['VIEW_CHANNEL'],
            },],
        }).then((channel1) => {
            //set the maximumbitrate limit
            let maxbitrate = 96000;
            //get the boosts amount
            let boosts = message.guild.premiumSubscriptionCount;
            if (boosts >= 2) maxbitrate = 128000;
            if (boosts >= 15) maxbitrate = 256000;
            if (boosts >= 30) maxbitrate = 384000;
            message.guild.channels.create(`🎧｜JUGNU Music`, {
                type: 'voice', //voice Channel
                bitrate: maxbitrate, //set the bitrate to the maximum possible
                userLimit: 30, //set the limit for voice users
                parent: channel1.id, //ADMINISTRATOR
                permissionOverwrites: [{
                    id: message.guild.id,
                    allow: ['VIEW_CHANNEL', "CONNECT"],
                },],
            }).then((channel2) => {
                message.guild.channels.create(`🎵｜requests`, {
                    type: 'text', // text channel
                    rateLimitPerUser: 6, //set chat delay
                    topic: `To request a Track, simply Type the **SONG NAME** into the Channel or the **URL** and the Bot will play it! Make sure that you are in the **right** Voice Channel (🎧｜JUGNU Music)!`,
                    parent: channel1.id,
                    permissionOverwrites: [{
                        id: message.guild.id,
                        allow: ['VIEW_CHANNEL', "SEND_MESSAGES", "ADD_REACTIONS"],
                    },
                    { //giving the Bot himself permissions
                        id: client.user.id,
                        allow: ["MANAGE_MESSAGES", "MANAGE_CHANNELS", "ADD_REACTIONS", "SEND_MESSAGES", "MANAGE_ROLES"]
                    }
                    ],
                }).then((channel3) => {
                    message.reply(`Setting up in <#${channel3.id}>`)
                    let pehla = new MessageEmbed()
                        .setColor(config.colors.yes)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setAuthor(message.author.username)
                        .setTitle("JUGNU Music | Request | Guide")
                        .setDescription(`Enter the song name or URL to play a song\n\n For Example ${config.prefix}play \`Rockstar baby song\``)
                        .setFooter("Made By Kabir Jaipal aka Tech Boy Gaming")

                    let dusra = new MessageEmbed()
                        .setColor(config.colors.yes)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setAuthor(message.author.username)
                        .setTitle("JUNGU Music - Best Free Music Bot of 2021")
                        .setDescription(`Join a voice channel and enter a song name or url to play.\n[Invite JUGNU Music](https://discord.com/api/oauth2/authorize?client_id=848431361094058006&permissions=8&scope=bot) • [Join Server](https://discord.gg/tVWrU5PWZV) • [Subscribe Now](https://www.youtube.com/channel/UCINCfgiBYCykOemiuVhqtIQ)`)
                        .setImage('https://thumbs.gfycat.com/MeekBeautifulCaterpillar-size_restricted.gif')
                        .setFooter("Made By Kabir Jaipal aka Tech Boy Gaming")

                    //send a temp message
                    channel3.send(new MessageEmbed().setColor(config.colors.yes).setDescription("Setting Up..")).then(msg => {
                        //edit the message again
                        msg.edit(pehla)
                        //save it in the database
                        // client.setups.set(message.guild.id, msg.id, "message_queue_info");

                    })


                    //send a temp message
                    channel3.send(new MessageEmbed().setColor(config.colors.yes).setDescription("Setting Up..")).then(msg => {
                        //edit the message again
                        msg.edit(dusra)
                        //save it in the database
                        // client.setups.set(message.guild.id, msg.id, "message_queue_info");

                        // // send a reaction message 
                        // channel3.send(new MessageEmbed().setColor(config.colors.yes).setDescription("Setting Up..")).then( async msg => {
                        //     msg.edit(dusra)
                        //     //react with all reactions
                        //     await msg.react("⏭") // skip song
                        //     await msg.react("⏹") // stop song
                        //     await msg.react("🔉") // down volume
                        //     await msg.react("🔊") // up volume
                        //     await msg.react("⬅️") // forward 10s 
                        //     await msg.react("➡️") // backward 10s

                        // })

            
                    })
                })
            })
        })
    }
}