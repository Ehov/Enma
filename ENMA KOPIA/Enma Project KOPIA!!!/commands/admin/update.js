const { MessageEmbed } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'update',
    description: 'Aktualizuje liczbę kanałów tekstowych w bazie danych, zapisując również nazwy kanałów.',
    usage: 'p.update',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('Nie masz uprawnień do używania tego polecenia.');
        }

        // Pobranie wszystkich kanałów tekstowych na serwerze
        const textChannels = message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT');
        const serverTextChannelCount = textChannels.size;

        // Pobranie liczby kanałów w bazie danych
        db.get('SELECT COUNT(*) as count FROM Channels', (err, row) => {
            if (err) {
                console.error('Błąd podczas pobierania danych z bazy:', err.message);
                return message.reply('Wystąpił błąd podczas aktualizacji.');
            }

            const dbChannelCount = row.count;

            if (serverTextChannelCount === dbChannelCount) {
                const embed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription('Liczba kanałów tekstowych w bazie danych jest aktualna.');
                return message.reply({ embeds: [embed] });
            } else {
                // Zaktualizuj bazę danych
                let updatedChannels = 0;

                textChannels.forEach(channel => {
                    db.run('INSERT OR REPLACE INTO Channels (channelID, channelName) VALUES (?, ?)', 
                           [channel.id, channel.name], 
                           function(err) {
                        if (err) {
                            console.error(`Błąd przy aktualizacji kanału ${channel.id}:`, err.message);
                        } else {
                            updatedChannels++;
                        }
                    });
                });

                const embed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription(`Baza danych została zaktualizowana. ${serverTextChannelCount - dbChannelCount} kanał.`);
                message.reply({ embeds: [embed] });
            }
        });
    }
};