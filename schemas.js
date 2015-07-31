var schemas = {
    lezione : {
        id : null,
        facolta: null,
        corsoLaurea: null,
        corso: null, //denominazione
        docente: null,
        aula: null,
        giorno: null,
        orarioInizio: null,
        orarioFine: null
    },
    /* Gli avvisi sono a più livelli, da Ateneo a docente
     * Gli avvisi di ateneo hanno tutti i campi (facolta,corsoLaurea,corso,docente) a 'all'
     * Gli avvisi di facolta hanno tutti i campi a 'all' tranne facolta : nomeFacolta
     * E così via fino agli avvisi del singolo docente.
     */
    avviso: {
        id: null,
        facolta: null,
        corsoLaurea: null,
        corso: null,
        docente: null,
        testo: null
    },
    aula: {
        id: null,
        nome: null,
        capacita: null
    },
    utente: {
        id: null,
        id_telegram: null,
        facolta: null,
        corsoLaurea: null,
        corsiSeguiti: null, // array di corsi
        email: null
    }
};

module.exports = schemas;