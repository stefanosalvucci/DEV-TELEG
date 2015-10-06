var schemas = {
    lezione : {
        facolta: null,
        corsoLaurea: null,
        denominazione: null,
        dettagli: null,
        docente: null,
        aula: null,
        giorno: null,
        orarioInizio: null,
        orarioFine: null,
        dateInizio: null, // Date
        dateFine: null // Date
    },
    /* Gli avvisi sono a più livelli, da Ateneo a docente
     * Gli avvisi di ateneo hanno tutti i campi (facolta,corsoLaurea,corso,docente) a 'all'
     * Gli avvisi di facolta hanno tutti i campi a 'all' tranne facolta : nomeFacolta
     * E così via fino agli avvisi del singolo docente.
     */
    avviso: {
        facolta: null,
        corsoLaurea: null,
        corso: null,
        docente: null,
        testo: null,
        titolo: null,
        url: null,
        sent: false
    },
    aula: {
        nome: null,
        capacita: null
    },
    utente: {
        telegramId: null,
        facolta: null,
        corsoLaurea: null,
        corsiSeguiti: null, // array di corsi
        email: null
    }
};

module.exports = schemas;