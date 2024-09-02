module.exports = {
    name: 'hai',
    async execute(client, message){
        await client.sendMessage(message.key.remoteJid, {text: `Hello ${message.pushName}!`})
    }
}