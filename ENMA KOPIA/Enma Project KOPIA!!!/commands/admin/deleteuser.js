const { MessageEmbed } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: "removeuser",
    aliases: ["deluser", "deleteuser"],
    usage: "!p.removeuser <userID>",
    description: "Usuwa użytkownika z bazy danych po jego ID.",
    userPerms: ['ADMINISTRATOR'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('Nie masz uprawnień do używania tego polecenia.');
        }
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription('Poprawne użycie: `p.removeuser [ID_User]`');
            return message.reply({ embeds: [embed] });
        }

        const userID = args[0];

        db.get('SELECT * FROM Users WHERE userID = ?', [userID], (err, row) => {
            if (err) {
                console.error(err.message);
                const embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription(`<@${message.author.id}> wystąpił błąd podczas przetwarzania żądania.`);
                return message.reply({ embeds: [embed] });
            }

            if (!row) {
                const embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription(`<@${message.author.id}> nie znaleziono użytkownika o podanym ID.`);
                return message.reply({ embeds: [embed] });
            }

            db.run('DELETE FROM Users WHERE userID = ?', [userID], function(err) {
                if (err) {
                    console.error(err.message);
                    const embed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setDescription(`<@${message.author.id}> wystąpił błąd podczas usuwania użytkownika.`);
                    return message.reply({ embeds: [embed] });
                }

                const embed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription(`<@${message.author.id}> pomyślnie usunięto użytkownika o ID ${userID} z bazy danych.`);
                message.reply({ embeds: [embed] });
            });
        });
    }
};
