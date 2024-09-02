module.exports = {
    name: 'ping',
    async execute(client, message){
        await client.sendMessage(message.key.remoteJid, {text: `Pong!`})
    }
}