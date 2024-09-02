const {makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')
const logger = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, P.destination('./wa-logs.txt'))
const path = require('node:path');
const fs = require('fs')

async function connectToWhatsApp(){
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
    const client = makeWASocket({
        printQRInTerminal: true,
        auth: {
			creds: state.creds,
			/** caching makes the store faster to send/recv messages */
			keys: makeCacheableSignalKeyStore(state.keys, logger),
		},
    });
    const eventPath = path.join(__dirname, 'Events');
    const eventFiles = fs.readdirSync(eventPath).filter(f => f.endsWith(".js"));

    for (const file of eventFiles){
        const filePath = path.join(eventPath, file);
        const event = require(filePath)

        client.ev.on(event.name, (...args) => event.execute(client, connectToWhatsApp, ...args))
    }

    // this will be called as soon as the credentials are updated
    client.ev.on ('creds.update', saveCreds)
}

connectToWhatsApp()