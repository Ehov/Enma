const { MessageEmbed } = require('discord.js');
const { version } = require('discord.js');
const { ownerID } = require('../../config.json');
const { PREFIX } = require('../../config.json');
const { Permissions } = require('discord.js');

module.exports = {
    name: 'botinfo',
    aliases: ["bi"],
    usage: "p.botinfo",
    description: 'Wyświetla informacje o bocie.',
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
        const Nazwa = message.client.user.username
        const Wersja = version
        const DataUtworzenia = message.client.user.createdAt.toDateString()
        const Właściciel = ownerID
        const Prefix = PREFIX
        const IDBota = message.client.user.id
        const embed = new MessageEmbed()
        .setTitle('Informacje o Bocie')
        .setThumbnail(message.client.user.displayAvatarURL())
        .setColor('#ff0000')
        .addFields(
            { name: 'Nazwa', value: `${Nazwa}` },
            { name: 'Wersja', value: `${Wersja}` },
            { name: 'Data Utworzenia', value: `${DataUtworzenia}` },
            { name: 'Właściciel', value: `${Właściciel}` },
            { name: 'Prefix', value: `${Prefix}`},
            { name: 'ID Bota', value: `${IDBota}` },
        )
        .setTimestamp()
            message.channel.send({ embeds: [embed] });
        
        },
};