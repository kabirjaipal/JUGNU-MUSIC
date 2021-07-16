const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
  name: "autoplay",
  category: "MUSIC COMMANDS",
  aliases: ["ap", "randomsong"],
  useage: "autoplay",
  description: "Enables autoplay - random similar songs",
  run: async (client, message, args) => {

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

    //send info message + toggle autoplay
    await functions.embedbuilder(client, 3000, message, config.colors.yes, `Autoplay is now **${client.distube.toggleAutoplay(message) ? "active" : "deactive"}**!`)
  }
};
