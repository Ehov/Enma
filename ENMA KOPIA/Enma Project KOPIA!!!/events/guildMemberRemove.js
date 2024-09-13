// W pliku guildMemberRemove.js w folderze events

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    run(member, client) {
        const channel = member.guild.channels.cache.find(ch => ch.name === 'mgła');
        if (!channel) return;
        channel.send(`${member} Umarł na haku 🔌`);
    },
};
// W pliku guildMemberRemove.js w folderze events

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    run(member, client) {
        // Wysyłanie wiadomości na kanale 'mgła'
        const channel = member.guild.channels.cache.find(ch => ch.name === 'mgła');
        if (channel) {
            channel.send(`${member} Umarł na haku 🔌`);
        }

        // Usunięcie użytkownika z bazy danych
        db.run('DELETE FROM Users WHERE userID = ?', [member.id], function(err) {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Usunięto użytkownika ${member.id} z bazy danych.`);
            }
        });
    },
};
