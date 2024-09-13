const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    once: false,
    async run(client, message) {  // Dodanie argumentu client
        if (message.author.bot || message.channel.type === 'DM') return;

        // Sprawdź, czy wiadomość zawiera link zaproszeniowy
        const inviteLinkRegex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)\/\w+)/gi;
        if (inviteLinkRegex.test(message.content)) {
            // Usuń wiadomość
            await message.delete();

            // Wyślij wiadomość na specjalny kanał
            const logsChannelName = 'logs'; // Nazwa kanału anty-zaproszeń
            const logsChannel = message.guild.channels.cache.find(channel => channel.name === logsChannelName);
            if (!logsChannel) return console.log(`Kanał o nazwie "${logsChannelName}" nie został znaleziony.`);

            // Przygotuj wiadomość do wysłania
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Ostrzeżenie: Link zaproszeniowy')
                .setDescription('Użytkownik wysłał link zaproszeniowy na inny serwer.')
                .addFields(
                    { name: 'Id Użytkownika', value: message.author.id, inline: true },
                    { name: 'Nazwa Użytkownika', value: message.author.username, inline: true },
                    { name: 'Usunięta Wiadomość', value: message.content },
                );

            if (message.author.avatar) {
                embed.setThumbnail(message.author.avatarURL({ dynamic: true }));
            }

            // Wyślij wiadomość na kanał anty-zaproszeń
            await logsChannel.send({ embeds: [embed] });

            // Zbanuj użytkownika za powtarzające się wysyłanie zaproszeń
            const user = message.guild.members.cache.get(message.author.id);
            if (user) {
                await user.kick('Wysyłanie linków zaproszeniowych na inne serwery');
            } else {
                console.error(`Nie można znaleźć użytkownika o Id ${message.author.id}.`);
            }
        }
    },
};
