const { MessageEmbed } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: "register",
    aliases: ["reg", "r"],
    usage: "p.register",
    description: "Rejestruje użytkownika na serwerze.",
    userPerms: ['SEND_MESSAGES'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    run: async (client, message, args) => {
        const member = message.guild.members.cache.get(message.author.id);

        if (message.channel.name !== 'registration') { // Sprawdzenie, czy kanał nazywa się 'test'
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`<@${message.author.id}> Polecenie te można użyć tylko na <#1279857770400710770>.`);
            return message.reply({ embeds: [embed] });
        }

        if (!member) {
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`<@${message.author.id}> Nie mogę znaleźć twojego członkostwa na serwerze.`);
            return message.reply({ embeds: [embed] });
        }

        // Pobranie dat
        const registeredAt = new Date().toISOString();  // Data rejestracji
        const joinedAt = member.joinedAt ? member.joinedAt.toISOString() : new Date().toISOString(); // Data dołączenia na serwer
        const accountCreatedAt = message.author.createdAt ? message.author.createdAt.toISOString() : new Date().toISOString(); // Data założenia konta Discord

        db.get('SELECT * FROM Users WHERE userID = ?', [message.author.id], (err, row) => {
            if (err) {
                console.error(err.message);
                const embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription('Wystąpił błąd podczas rejestracji.');
                return message.reply({ embeds: [embed] });
            }

            if (row) {
                const embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription(`<@${message.author.id}> Jesteś już zarejestrowany.`);
                return message.reply({ embeds: [embed] });
            }

            // Dodanie do bazy danych
            db.run('INSERT INTO Users (userID, registeredAt, joinedAt, accountCreatedAt) VALUES (?, ?, ?, ?)', 
                   [message.author.id, registeredAt, joinedAt, accountCreatedAt], function(err) {
                if (err) {
                    console.error(err.message);
                    const embed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setDescription('Wystąpił błąd podczas rejestracji.');
                    return message.reply({ embeds: [embed] });
                }

                const verifiedRole = message.guild.roles.cache.find(role => role.name === 'Zweryfikowany');
                if (verifiedRole) {
                    member.roles.add(verifiedRole).then(() => {
                        const embed = new MessageEmbed()
                            .setColor('#00ff00')
                            .setDescription(`<@${message.author.id}> Zostałeś pomyślnie zarejestrowany i otrzymałeś rolę \`Zweryfikowany\`.`);
                        message.reply({ embeds: [embed] });
                    }).catch(err => {
                        console.error(err);
                        const embed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setDescription(`<@${message.author.id}> Nie udało się nadać roli 'Zweryfikowany'.`);
                        message.reply({ embeds: [embed] });
                    });
                } else {
                    const embed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setDescription(`<@${message.author.id}> Nie znaleziono roli 'Zweryfikowany'.`);
                    message.reply({ embeds: [embed] });
                }
            });
        });
    }
};
