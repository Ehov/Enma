const { MessageEmbed } = require('discord.js');
const db = require('../database');

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
    name: 'messageCreate',
    async run(client, message) {
        if (message.author.bot || message.content.startsWith('p.')) return;

        // Sprawdzanie, czy kanał jest dozwolony do naliczania EXP
        db.get('SELECT * FROM Channels WHERE channelID = ?', [message.channel.id], (err, row) => {
            if (err) {
                console.error('Błąd przy pobieraniu danych kanału:', err.message);
                return;
            }

            if (row && !row.enabled) {
                // Kanał jest zablokowany dla EXP
                return;
            }

            const xpConfig = {
                CharPerPoint: 30,
                MinPerMessage: 0.01,  // Zmieniono wartość minimalną dla widocznego efektu
                MaxPerMessage: 5,
            };

            // Obliczanie zdobytego EXP
            const rawExpEarned = message.content.length / xpConfig.CharPerPoint;
            const expEarned = Math.min(
                Math.max(rawExpEarned, xpConfig.MinPerMessage),
                xpConfig.MaxPerMessage
            );

            const userID = message.author.id;

            // Pobieranie użytkownika z bazy danych
            db.get('SELECT * FROM Users WHERE userID = ?', [userID], (err, row) => {
                if (err) {
                    console.error('Błąd przy pobieraniu danych użytkownika:', err.message);
                    return;
                }

                if (!row) {
                    // Jeśli użytkownik nie jest zarejestrowany, zainicjuj jego rekord w bazie
                    db.run('INSERT INTO Users (userID, exp, level) VALUES (?, ?, ?)', [userID, expEarned, 1], function(err) {
                        if (err) {
                            console.error('Błąd przy zapisywaniu nowego użytkownika:', err.message);
                            return;
                        }
                    });
                } else {
                    // Aktualizacja EXP i poziomu użytkownika
                    let { exp, level } = row;
                    exp += expEarned;

                    const nextLevelXP = level * 75; // XP wymagane do następnego poziomu (np. level * 100)

                    if (exp >= nextLevelXP) {
                        level += 1;
                        exp -= nextLevelXP;

                        const embed = new MessageEmbed()
                            .setColor('#00ff00')
                            .setTitle('Awans na nowy poziom!')
                            .setDescription(`<@${message.author.id}> awansowałeś na poziom [${level}]!`
                            );

                        message.channel.send({ embeds: [embed] });
                    }

                    // Zastosowanie formatowania przy zapisywaniu EXP do bazy danych i wyświetlaniu
                    db.run(
                        'UPDATE Users SET exp = ?, level = ? WHERE userID = ?',
                        [exp, level, userID],
                        function(err) {
                            if (err) {
                                console.error('Błąd przy aktualizacji danych użytkownika:', err.message);
                            }
                        }
                    );
                }
            });
        });
    }
};
