// W pliku guildMemberAdd.js w folderze events

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async run(member, client) {
        const welcomeChannel = member.guild.channels.cache.get('1048548042636267570');

        if (welcomeChannel && welcomeChannel.permissionsFor(client.user).has('SEND_MESSAGES')) {
            welcomeChannel.send(`Witaj, ${member} na naszym serwerze!🪓`);
        }

        const { MessageEmbed } = require('discord.js');
        const embed = new MessageEmbed()
            .setTitle('Witaj na serverze DuBuDu!')
            .setDescription(`Witaj, ${member}! Wszystkie informacje, zasady dotyczące serwera znajdziesz na <#1165193846280433735>`)
            .setColor('#ff0000');
        return member.send({ embeds: [embed] });
    },
};