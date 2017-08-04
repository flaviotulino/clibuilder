const fs = require('fs');

class CoreDefault {
    list () {
        const commands = fs.readdirSync(dirname + '/commands').filter(command => !command.match(/Default.js/));
        commands.forEach(command => {
            command = command.replace(/.js$/, '');
            const cmd = require(dirname + '/../commands/' + command);
            const methods = Object.getOwnPropertyNames(cmd.prototype).filter(m => !m.match(/constructor/));
            console.log(command.toLowerCase() + " usage:");
            methods.forEach(m => {
                console.log('- ' + m.replace(/([A-Z])/g, "-$1").toLowerCase());
            })
        });
    }

    help(command = null) {
        if (command.length === 0) {
            console.log('Usage: help <command>');
            process.exit();
        }
        const cmd = require(__dirname + '../commands/' + command[0][0].toUpperCase() + command[0].slice(1, command.length));
        const methods = Object.getOwnPropertyNames(cmd.prototype).filter(m => !m.match(/constructor/));
        console.log(command.toLowerCase() + " usage:");
        methods.forEach(m => {
            console.log('- ' + m.replace(/([A-Z])/g, "-$1").toLowerCase());
        })
    }
}
module.exports = CoreDefault;