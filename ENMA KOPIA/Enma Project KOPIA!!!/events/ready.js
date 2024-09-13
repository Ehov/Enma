const { Client } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    run(client) {
        console.log('Bot został uruchomiony!');

        // Lista statusów Rich Presence
        const statuses = [
            { 
                name: 'p.pomoc', 
                type: 'PLAYING', 
                details: 'Zobacz polecenia!', // Dodatkowy opis dla Rich Presence
                state: 'DuBuDu', // Dodatkowy stan dla Rich Presence
                largeImageKey: 'avatar', // Klucz obrazka w Rich Presence Assets
                largeImageText: 'Przegląd servera', // Tekst po najechaniu na obrazek
            },
        ];

        let currentIndex = 0;
            const status = statuses[currentIndex];

            // Ustawienie Rich Presence
            client.user.setPresence({
                activities: [{
                    name: status.name,
                    type: status.type,
                    details: status.details,
                    state: status.state,
                    assets: {
                        large_image: status.largeImageKey,  // Obrazek Rich Presence
                        large_text: status.largeImageText,  // Tekst wyświetlany po najechaniu na obrazek
                    },
                }],
                status: 'online' // Status online bota
            });
    },
};
