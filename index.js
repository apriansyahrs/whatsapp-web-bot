const { Configuration, OpenAIApi } = require('openai');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { API_KEY_AI } = require('./config');

const configuration = new Configuration({
    apiKey: API_KEY_AI,
});
const openai = new OpenAIApi(configuration);

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    const text = msg.body.toLowerCase() || '';

    // check pesan
    if (text) {
        // Kirim pesan ke OpenAi dan dapatkan balasan
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: text,
            temperature: 0.3,
            max_tokens: 3000,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        // Kirim balasan kepada pengirim pesan
        msg.reply(response.data.choices[0].text);
    }
});

client.initialize();
