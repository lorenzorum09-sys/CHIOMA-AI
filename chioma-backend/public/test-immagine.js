require('dotenv').config();
const { ai } = require('./src/config/gemini');
const fs = require('fs');

async function testGenerazioneImmagine() {
    const fotoBuffer = fs.readFileSync('./foto-test.jpg');
    const fotoBase64 = fotoBuffer.toString('base64');

    const risposta = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: fotoBase64
                        }
                    },
                    {
                        text: 'Modifica questa foto applicando un taglio di capelli buzz cut corto. Mantieni il viso della persona riconoscibile.'
                    }
                ]
            }
        ]
    });

    console.log('Risposta completa:', JSON.stringify(risposta, null, 2));
}

testGenerazioneImmagine().catch(console.error);