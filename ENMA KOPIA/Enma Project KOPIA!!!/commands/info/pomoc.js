const { PREFIX } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
module.exports = {
    name: 'pomoc',
    aliases: ['h', 'help', 'pmc'],
    usage: "p.pomoc",
    userPerms: ['SEND_MESSAGES'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    description: "Lista poleceń bota",
    run: async (client, message, args, prefix) => {
        if (!args[0]) {
            let categories = [];
            const Prefix = PREFIX
            readdirSync("./Commands/").forEach((dir) => {
                const commands = readdirSync(`./Commands/${dir}/`).filter((file) => file.endsWith(".js"))

                const cmds = commands.map((command) => {
                    let file = require(`../../Commands/${dir}/${command}`)
                    if (!file.name) return "No command name.";

                    let name = file.name.replace(".js", "");

                    return `\`${name}\``;
                });

                let data = {
                    name: dir.toUpperCase(),
                    value: cmds.length === 0 ? "In progress." : cmds.join(" | "),
                };
                categories.push(data);
            })
            let member = message.member
            const embed = new MessageEmbed()
                .setTitle("Commands")
                .addFields(categories)
                .setDescription(`${member} Użyj \`${Prefix}pomoc\` Aby uzyskać liste poleceń bota, przykładowe użycie: \`${Prefix}help ping\``)
                .setColor('#ff0000');
            return message.channel.send({ embeds: [embed] })
        } else {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));

            if (!command) {
                const embed = new MessageEmbed()
                    .setDescription(`Błąd polecenia, użyj \`${Prefix}pomoc\` Aby uzyskać liste poleceń bota`)
                    .setColor('#ff0000');
                return message.channel.send({ embeds: [embed] })
            }
            const embed = new MessageEmbed()
                .setTitle("Lista poleceń Enma")
                .addFields(
                    { name: "COMMAND:", value: command.name ? `\`${command.name}\`` : "Brak nazwy dla tej komendy" },
                    { name: "ALIASES:", value: command.aliases ? `\`${command.aliases.join("` `")}\`` : "Brak aliasu dla tej komendy" },
                    { name: 'USAGE:', value: command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : 'Brak określonego użycia' },
                    { name: "DESCRIPTION", value: command.description ? command.description : "Brak opisu dla tej komendy" },
                )
                .setColor('#ff0000');
            return message.channel.send({ embeds: [embed] });
        }
    }
}
