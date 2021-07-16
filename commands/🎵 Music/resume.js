const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
    name: "resume",
    category: "MUSIC COMMANDS",
    aliases: ["r"],
    useage: "resume",
    description: "Resume the song",
    run: async (client, message, args) => {
        //if not a dj, return error
          
    
        //If Bot not connected, return error
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")
        
        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")
        
        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)
        
        //if Bot is not paused, return error
        if (!client.distube.isPaused(message)) return functions.embedbuilder(client, "null", message, config.colors.no, "Not paused!")
        
        //send information embed
        functions.embedbuilder(client, 3000, message, config.colors.yes, "Resume!")

        //resume
        client.distube.resume(message);
    }
};
