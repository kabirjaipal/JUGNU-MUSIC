const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
    name: "clearqueue",
    category: "MUSIC COMMANDS",
    aliases: ["clearqu"],
    useage: "clearqueue",
    description: "Clears the Queue",
    run: async (client, message, args) => {
        //if not a dj, return error
         

        //If Bot not connected, return error
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

        //get queue
        let queue = client.distube.getQueue(message);
        
        //if no queue return error
        if (!queue) return functions.embedbuilder(client, 3000, message, config.colors.no, "There is nothing playing!");

        //clear the queue
        queue.songs = [queue.songs[0]];
        
        //Send info message
        functions.embedbuilder(client, 3000, message, config.colors.yes, "Cleared the Queue!")
    }
};
