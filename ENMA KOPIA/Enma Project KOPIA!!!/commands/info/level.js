const { MessageEmbed } = require('discord.js');
const db = require('../../database');

// Funkcja do formatowania dużych liczb (np. 1000 -> 1K, 1000000 -> 1M)
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(0) + 'M'; // Miliony
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K'; // Tysiące
    }
    return num.toFixed(0); // Dla liczb mniejszych niż 1000, zaokrąglanie do 0 miejsc po przecinku
}

module.exports = {
    name: 'level',
    description: 'Wyświetla poziom, EXP oraz ile brakuje do następnego poziomu.',
    usage: 'p.level [@użytkownik]',
    run: async (client, message, args) => {
        const target = message.mentions.users.first() || message.author;

        // Pobranie danych użytkownika z bazy danych
        db.get('SELECT * FROM Users WHERE userID = ?', [target.id], (err, row) => {
            if (err) {
                console.error(err.message);
                const embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription('Wystąpił błąd podczas pobierania danych użytkownika.');
                return message.reply({ embeds: [embed] });
            }

            if (!row) {
                // Jeśli użytkownik nie jest zarejestrowany
                const embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription(`<@${target.id}> nie jest jeszcze zarejestrowany.`);
                return message.reply({ embeds: [embed] });
            }

            // Obliczenia dla następnego poziomu
            const { exp = 0, level = 1 } = row;
            const nextLevelXP = level * 75;
            const remainingXP = nextLevelXP - exp;

            // Tworzenie embed message
            const embed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle(`Level Status ${target.username}`)
                .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Poziom', value: `${level}`, inline: true },
                    { name: 'EXP', value: `${formatNumber(exp)}`, inline: true },
                    { name: 'Do następnego poziomu', value: `${formatNumber(remainingXP)} EXP`, inline: true }
                );

            // Wysłanie embed message
            message.reply({ embeds: [embed] });
        });
    }
};