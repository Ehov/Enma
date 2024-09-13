const { Client, Collection, MessageEmbed } = require('discord.js');
const config = require('./config.json');
const db = require('./database');  // Importowanie bazy danych
const { TOKEN, PREFIX } = config;
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "MESSAGE_CONTENT"],
    partials: ["CHANNEL", "MESSAGE"]
});

// Ładowanie plików obsługujących zdarzenia z folderu "events"

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(__dirname, 'events', file));
    if (event.once) {
        client.once(event.name, (...args) => event.run(client, ...args)); // Zmiana kolejności argumentów
    } else {
        client.on(event.name, (...args) => event.run(client, ...args));  // Zmiana kolejności argumentów
    }
}

// Global Variables
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./Commands");
['Command'].forEach(handler => {
    require(`./handler/${handler}`)(client);
});


client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.toLowerCase().startsWith(PREFIX)) return;
    if (!message.guild) return;

    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;

    let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!command) return;

    // User Permissions
    const missingUserPerms = command.userPerms?.filter(perm => !message.member.permissions.has(perm)) || [];
    if (missingUserPerms.length > 0) {
        return message.channel.send(`Nie masz uprawnień do użycia tego polecenia: \`${missingUserPerms.join('`, `')}\``);
    }

    // Bot Permissions
    const missingClientPerms = command.clientPerms?.filter(perm => !message.guild.members.me.permissions.has(perm)) || [];
    if (missingClientPerms.length > 0) {
        return message.channel.send(`Bot nie ma uprawnień do użycia tego polecenia: \`${missingClientPerms.join('`, `')}\``);
    }

    try {
        await command.run(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('Wystąpił błąd podczas wykonywania tego polecenia.');
    }
});

client.login(TOKEN);