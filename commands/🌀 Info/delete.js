const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'delete',
    aliases: [''],
    description: 'delete messgaes in channel',
    useage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MANAGE_MESSAGES"))
            return message.channel.send(`You Do Not Have Permissions To Use This Command, ${message.author.username}`);

        if (!args[0]) {
            return message.channel.send("Please Enter An Amount Between 1 and 100")
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;

        } else {
            deleteAmount = parseInt(args[0]);
        }

        await message.channel.bulkDelete(deleteAmount, true);

        const embed = new MessageEmbed()
            .setDescription(`Successfully Deleted ${deleteAmount} Messages`)
            .setColor('#06198C')

        await message.channel.send(embed).then(message => message.delete({ timeout: 5000 }))
    }
}