const { Permissions } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: 'serverinfo',
    aliases: ['srvi'],
    description: "Wyświetla podstawowe informacje o serverze",
    userPerms: ['SEND_MESSAGES'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    run: async (client, message, args) => {
        const allowedChannels = ['cmd']; // Lista kanałów, w których komenda może być użyta

        if (!allowedChannels.includes(message.channel.name)) { // Sprawdzenie, czy kanał znajduje się na liście dozwolonych
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`<@${message.author.id}> Polecenie te można użyć tylko na <#1014395860647415819>.`);
            return message.channel.send({ embeds: [embed] });
        }

        const guild = message.guild;
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const members = guild.memberCount;
        const channels = guild.channels.cache.size;
        const owner = await guild.fetchOwner();
        const region = guild.region || 'Unknown';

        // Sprawdzenie, czy komenda została wywołana na konkretnym kanale
        // Sprawdzenie, czy autor wiadomości jest administratorem
        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            // Jeśli użytkownik jest administratorem, nie sprawdzamy kanału
            (message);
        } else {
            const allowedChannelName = 'cmd'; // Wprowadź nazwę dozwolonego kanału
            if (message.channel.name !== allowedChannelName) {
                const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`Polecenie możesz wykonać tylko na kanele <#${message.guild.channels.cache.find(channel => channel.name === allowedChannelName).id}>.`);
                return message.channel.send({ embeds: [embed] });
            }
        }

        // Sprawdzenie czy wartości są prawidłowe łańcuchy
        if (!guild.name || typeof guild.name !== 'string' || !guild.name.trim().length) throw new Error("Invalid guild name.");
        if (!guild.id || typeof guild.id !== 'string' || !guild.id.trim().length) throw new Error("Invalid guild ID.");
        if (!owner.user.tag || typeof owner.user.tag !== 'string' || !owner.user.tag.trim().length) throw new Error("Invalid owner tag.");
        if (!region || typeof region !== 'string' || !region.trim().length) throw new Error("Invalid region.");
        if (!guild.verificationLevel || typeof guild.verificationLevel !== 'string' || !guild.verificationLevel.trim().length) throw new Error("Invalid verification level.");

        const embed = new Discord.MessageEmbed()
            .setTitle("Informacje o serverze")
            .setColor('#ff0000')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: "Server Name", value: guild.name.trim(), inline: true },
                { name: "Server ID", value: guild.id.trim(), inline: true },
                { name: "Owner", value: `${owner.user.tag.trim()} (${owner.user.id.trim()})`, inline: true },
                { name: "Region", value: region.trim(), inline: true },
                { name: "Verification Level", value: guild.verificationLevel.trim(), inline: true },
                { name: "Roles", value: roles.toString(), inline: true },
                { name: "Emojis", value: emojis.toString(), inline: true },
                { name: "Members", value: members.toString(), inline: true },
                { name: "Text Channels", value: guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size.toString(), inline: true },
                { name: "Voice Channels", value: guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size.toString(), inline: true }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
}
