/**
 * Modulo Storage per la gestione della cronologia e utilità di copia
 */
const KEY_CRONOLOGIA = 'chioma_ai_cronologia';

export function salvaAnalisiInCronologia(analisiData) {
    try {
        const storia = caricaCronologia();
        const nuovoElemento = {
            id: Date.now(),
            data: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }),
            risultato: analisiData
        };

        // Manteniamo massimo le ultime 5 analisi
        const aggiornato = [nuovoElemento, ...storia].slice(0, 5);
        localStorage.setItem(KEY_CRONOLOGIA, JSON.stringify(aggiornato));
        return nuovoElemento;
    } catch (e) {
        console.error('Impossibile salvare in localStorage:', e);
    }
}

export function caricaCronologia() {
    try {
        const raw = localStorage.getItem(KEY_CRONOLOGIA);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

export async function copiaInAppunti(testo) {
    try {
        await navigator.clipboard.writeText(testo);
        mostraToast('✨ Scheda copiata negli appunti!');
        return true;
    } catch (err) {
        // Fallback per browser senza API clipboard
        const textArea = document.createElement('textarea');
        textArea.value = testo;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        mostraToast('✨ Scheda copiata negli appunti!');
        return true;
    }
}

export function mostraToast(messaggio) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = messaggio;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
