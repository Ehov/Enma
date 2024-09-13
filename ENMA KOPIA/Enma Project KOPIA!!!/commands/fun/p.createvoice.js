const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'createvoice',
    description: 'Tworzy własny kanał głosowy w specjalnym kanale. Można ustawić nazwę i limit użytkowników (0 = brak limitu).',
    usage: 'p.createvoice [nazwa] [limit]',
    run: async (client, message, args) => {
        // Pobranie kategorii dla kanałów głosowych
        const voiceChannelCategory = message.guild.channels.cache.find(c => c.name === 'Voice Channels' && c.type === 'GUILD_CATEGORY');
        
        if (!voiceChannelCategory) {
            return message.reply('Nie znaleziono kategorii "Voice Channels".');
        }
        if (message.channel.name !== 'stwórz-kanał') { // Sprawdzenie, czy kanał nazywa się 'test'
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`<@${message.author.id}> Tą komenda może być użyta tylko na kanale <#1281832866648559617>.`);
            return message.reply({ embeds: [embed] });
        }

        // Sprawdzenie poprawności argumentów
        if (!args[0] || !args[1]) {
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription('Poprawne użycie: `p.createvoice [nazwa] [limit]`, gdzie `[limit]` to liczba osób (0 oznacza brak limitu).');
            return message.reply({ embeds: [embed] });
        }

        const channelName = args[0];
        const userLimit = parseInt(args[1]);

        // Sprawdzenie poprawności limitu
        if (isNaN(userLimit) || userLimit < 0) {
            return message.reply(`<@${message.author.id}> Podaj prawidłowy limit użytkowników (0 oznacza brak limitu).`);
        }

        try {
            // Tworzenie nowego kanału głosowego
            const voiceChannel = await message.guild.channels.create(channelName, {
                type: 'GUILD_VOICE',
                parent: voiceChannelCategory.id,
                userLimit: userLimit, // Limit użytkowników
                permissionOverwrites: [
                    {
                        id: message.guild.id, // Dla wszystkich
                        allow: ['VIEW_CHANNEL', 'CONNECT'],
                    },
                    {
                        id: message.author.id, // Dla autora komendy
                        allow: ['MANAGE_CHANNELS', 'CONNECT', 'VIEW_CHANNEL'],
                    },
                ],
            });

            // Wiadomość potwierdzająca
            const embed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle('Kanał Głosowy Utworzony')
                .setDescription(`<@${message.author.id}> Twój kanał głosowy został utworzony: **${channelName}**\nLimit użytkowników: **${userLimit === 0 ? 'Bez limitu' : userLimit}**.`);

            message.reply({ embeds: [embed] });

            // Funkcja monitorująca kanał i usuwająca go, jeśli jest pusty
            monitorVoiceChannel(voiceChannel);

        } catch (error) {
            console.error(error);
            message.reply('Wystąpił błąd podczas tworzenia kanału głosowego.');
        }

        // Funkcja monitorująca kanał głosowy i usuwająca go, jeśli jest pusty przez minutę
        function monitorVoiceChannel(voiceChannel) {
            const checkInterval = setInterval(() => {
                if (voiceChannel.members.size === 0) {  // Sprawdzenie, czy kanał jest pusty
                    setTimeout(() => {
                        if (voiceChannel.members.size === 0) { // Ponowne sprawdzenie po minucie
                            voiceChannel.delete().catch(console.error);  // Usunięcie kanału
                            clearInterval(checkInterval);  // Zatrzymanie monitorowania
                        }
                    }, 60000);  // 60 sekund
                }
            }, 10000);  // Sprawdzanie co 10 sekund
        }
    }
};
