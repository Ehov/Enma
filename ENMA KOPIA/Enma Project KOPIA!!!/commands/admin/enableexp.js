const { MessageEmbed } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'enableexp',
    description: 'Włącz naliczanie EXP na określonym kanale.',
    args: true,
    usage: '<channel_id>',
    adminOnly: true,
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('Nie masz uprawnień do używania tego polecenia.');
        }
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription('Poprawne użycie: `p.enableexp [ID_Channel]`');
            return message.reply({ embeds: [embed] });
        }
        const channelID = args[0];

        // Sprawdzanie, czy kanał jest już zarejestrowany
        db.get('SELECT * FROM Channels WHERE channelID = ?', [channelID], (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }

            if (row) {
                if (row.enabled) {
                    const embed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setDescription('Naliczanie EXP jest już włączone na tym kanale.');
                    return message.reply({ embeds: [embed] });
                }

                db.run('UPDATE Channels SET enabled = 1 WHERE channelID = ?', [channelID], (err) => {
                    if (err) {
                        console.error(err.message);
                        return;
                    }

                    const embed = new MessageEmbed()
                        .setColor('#00ff00')
                        .setDescription(`Naliczanie EXP zostało włączone na kanale <#${channelID}>.`);
                    message.reply({ embeds: [embed] });
                });
            } else {
                const embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription('Kanał nie jest zarejestrowany w bazie danych.');
                message.reply({ embeds: [embed] });
            }
        });
    }
};
