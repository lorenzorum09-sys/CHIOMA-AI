/**
 * Modulo API Client per la comunicazione con il Backend Express
 */
export async function inviaFotoAnalisi(fileImmagine) {
    const formData = new FormData();
    formData.append('foto', fileImmagine);

    const risposta = await fetch('/api/analizza', {
        method: 'POST',
        body: formData
    });

    if (!risposta.ok) {
        const erroreJson = await risposta.json().catch(() => ({}));
        throw new Error(erroreJson.errore || `Errore del server (${risposta.status})`);
    }

    const dati = await risposta.json();
    return dati;
}

export async function generaAnteprimaTaglio(fileImmagine, nomeTaglio, descrizioneTaglio) {
    const formData = new FormData();
    formData.append('foto', fileImmagine);
    formData.append('nomeTaglio', nomeTaglio);
    formData.append('descrizioneTaglio', descrizioneTaglio || '');

    const risposta = await fetch('/api/genera-immagine', {
        method: 'POST',
        body: formData
    });

    if (!risposta.ok) {
        const erroreJson = await risposta.json().catch(() => ({}));
        throw new Error(erroreJson.errore || `Errore del server (${risposta.status})`);
    }

    return risposta.json();
}
