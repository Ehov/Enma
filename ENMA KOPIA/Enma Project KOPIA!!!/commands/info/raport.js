const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'raport',
    aliases: ['report', 'zgłoś', 'zglos', 'takniewolno'],
    description: 'Zgłasza wiadomość do administracji.',
    usage: 'p.raport <ID wiadomości> <powód>',
    async run(client, message, args) {
        const messageId = args[0];
        const reason = args.slice(1).join(' ');

        // Sprawdzenie poprawności argumentów
        if (!args[0] || !args[1]) {
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription('Poprawne użycie: `p.raport [ID_Message] [Reason]`')
            return message.reply({ embeds: [embed] });
        }

        try {
            const reportedMessage = await message.channel.messages.fetch(messageId);
            const reportChannel = message.guild.channels.cache.find(channel => channel.name === 'reports'); // Zmień nazwę kanału, jeśli jest inna

            if (!reportChannel) {
                const noChannelEmbed = new MessageEmbed()
                    .setDescription('Nie znaleziono kanału do zgłoszeń.')
                    .setColor('#ff0000')
                await message.channel.send({ embeds: [noChannelEmbed] });
                return;
            }

            const reportEmbed = new MessageEmbed()
                .setTitle('Zgłoszenie Wiadomości')
                .addFields([
                    { name: 'Zgłoszona wiadomość', value: reportedMessage.content || 'Brak treści' },
                    { name: 'Autor wiadomości', value: reportedMessage.author.tag },
                    { name: 'Zgłoszone przez', value: message.author.tag },
                    { name: 'Powód', value: reason }
                ])
                .setColor('#ff0000')
            await reportChannel.send({ embeds: [reportEmbed] });
            await message.delete(); // Usuń komendę raportu

            const confirmationEmbed = new MessageEmbed()
                .setDescription('Twoje zgłoszenie zostało pomyślnie wysłane.')
                .setColor('#00FF00')

            await message.channel.send({ embeds: [confirmationEmbed] })
        } catch (error) {
            console.error('Błąd przy zgłaszaniu wiadomości:', error);

            const errorEmbed = new MessageEmbed()
                .setDescription('Nie udało się zgłosić wiadomości. Upewnij się, że ID wiadomości jest poprawne.')
                .setColor('#ff0000')

            await message.channel.send({ embeds: [errorEmbed] });
        }
    }
};
