const { readdirSync } = require('fs');
const ascii = require('ascii-table');
let table = new ascii("Events");
table.setHeading('EVENTS', ' LOAD STATUS');

module.exports = (client) => {
    readdirSync('./events/').forEach(dir => {
        const events = readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));
        for(let file of events) {
            let pull = require(`../events/${dir}/${file}`);
            if(pull.name) {
                client.events.set(pull.name, pull);
            } else {
                table.addRow(file, 'EVENT REGISTERED')
                continue;
            } if(pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
        }
    });
    console.log(table.toString());
}