const { MessageEmbed } = require("discord.js")
const Discord = require('discord.js');
module.exports = {
    name: "ping",
    aliases: ["p"],
    usage: "p.ping",
    description: "Status opóźnienia bota",
    userPerms: ['SEND_MESSAGES'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    run: async(client, message, args) => {
        const allowedChannels = ['cmd']; // Lista kanałów, w których komenda może być użyta

        if (!allowedChannels.includes(message.channel.name)) { // Sprawdzenie, czy kanał znajduje się na liście dozwolonych
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`<@${message.author.id}> Polecenie te można użyć tylko na <#1014395860647415819>.`);
            return message.channel.send({ embeds: [embed] });
        }
        const embed = new MessageEmbed()
        .setColor("#00FF00")
        .setDescription(`${client.ws.ping}ms`)
        message.channel.send({ embeds: [embed] });
    }
}