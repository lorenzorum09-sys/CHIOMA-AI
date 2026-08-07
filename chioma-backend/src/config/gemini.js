const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn('⚠️ ATTENZIONE: GEMINI_API_KEY non è impostata nel file .env!');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

module.exports = { ai };
