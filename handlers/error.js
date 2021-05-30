const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, txt) => {
        let embed = new MessageEmbed()
            .setColor("RED")
            .setDescription(text)
            .setFooter("")
        await message.channel.send(embed)
    }
}