const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    name: 'messages.upsert',
    async execute(client, connectToWhatsApp, mvalue){
        if (mvalue.messages[0].fromMe) return;

        const prefix = "!"
        const isMessage = mvalue.messages[0]
        const isText = isMessage.message.conversation
        const commandFolders = fs.readdirSync("Commands");

        for (const folder of commandFolders){
            const commandFiles = fs.readdirSync(`Commands/${folder}`).filter(f => f.endsWith(".js"))

            for (const file of commandFiles){
                const getCommand = require(`../Commands/${folder}/${file}`);
                const args = isText.toLowerCase().split(" ");
                const isCommand = args[0];

                if (!isCommand.startsWith(prefix)) return;

                if (isCommand.slice(prefix.length) == getCommand.name){
                    getCommand.execute(client, isMessage, ...args)
                };
            }
        }
    }
}