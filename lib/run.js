function run () {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        return console.log('No command given');
    }

    const fs = require('fs');

    // todo: normalize
    const commandAction = args[1];

    if (!commandAction || args[0] === 'help') {

        const coreDefault = require(__dirname + '/CoreDefault');
        const coreDefaultInstance = new coreDefault();

        let userDefault = null;
        let userDefaultInstance = null;

        try {
            userDefault = require(__dirname + '../commands/Default');
            userDefaultInstance = new userDefault();
        } catch (e) {
            // don't mind
        }


        const instance = userDefaultInstance || coreDefaultInstance;

        try {
            instance[args[0]](args.slice(1));
        } catch (e) {
            console.log(e);
            let methods = new Set();

            if (userDefaultInstance !== null) {
                Object.getOwnPropertyNames(userDefault.prototype).filter(p => p !== 'constructor').forEach(prop => {
                    methods.add(prop);
                });
            }

            Object.getOwnPropertyNames(coreDefault.prototype).filter(p => p !== 'constructor').forEach(prop => {
                methods.add(prop);
            });

            console.log(args[0] + ' is not a command');
            console.log('Available base commands');
            for (let method of methods) {
                console.log('- ' + method);
            }
            process.exit();

        }
    }

    if (commandAction) {
        const normalizedCommandRoot = args[0][0].toUpperCase() + args[0].slice(1, args[0].length);
        let command = null;

        try {
            command = require('../commands/' + normalizedCommandRoot);
        } catch (e) {
            console.log(normalizedCommandRoot + ' module does not exists');
            console.log('Available modules');
            const commands = fs.readdirSync('commands').filter(command => !command.match(/Default.js/));
            return commands.forEach(command => {
                command = command.replace(/.js$/, '');
                console.log('- ' + command);
            });
        }

        try {
            const normalizedCommandActionCamel = commandAction.replace(/(-.)/g, function (x) {
                return x[1].toUpperCase()
            });
            new command()[normalizedCommandActionCamel](args.slice(2));
        } catch (e) {
            console.log('this command does not exist for ' + args[0]);
            console.log('Available commands');
            Object.getOwnPropertyNames(command.prototype).filter(c => c !== 'constructor').forEach(c => {
                console.log('- ' + c);
            });
        }
    }
}
module.exports = {
    run: run
};