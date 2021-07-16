const functions = require("../../functions");
const config = require("../../config.json")
module.exports = {
    name: "stop",
    category: "MUSIC COMMANDS",
    aliases: ["leave"],
    useage: "stop",
    description: "Stops playing and leaves the channel",
    run: async (client, message, args) => {
        //if not a dj, return error
          
    
        //If Bot not connected, return error
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")
        
        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")
        
        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)
                
        //send information message
        functions.embedbuilder(client, "null", message, config.colors.no, "STOPPED!", `Left the channel`)

        
        //stop distube
        client.distube.stop(message);

    }
};
