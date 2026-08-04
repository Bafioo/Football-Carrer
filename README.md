# Football Career Sim

Simulatore di carriera calcistica in stile "manageriale": crei il tuo calciatore a 16 anni, scegli nazionalita e ruolo (la squadra si trova sul mercato), poi vivi una carriera completa fatta di stagioni simulate, eventi casuali, trasferimenti e prestiti, fino al ritiro a 40 anni. La carriera viene salvata automaticamente nel browser.

## Concetto in breve

Il gioco non simula singole partite: simula **stagioni intere**. Ogni scelta nel mercato fa avanzare la carriera: il gioco calcola in automatico partite giocate, gol, assist, parate e clean sheet per l'intero anno (o 2 se giochi 2 stagioni alla volta), tira 1-2 eventi casuali, fa evolvere il "gen" (valutazione del giocatore) e apre il riepilogo con la scelta per l'anno successivo: restare, cambiare squadra o andare in prestito.

## Il Gen (Overall)

Il gen e il numero che rappresenta la qualita del giocatore (quello che vedi nel cerchio grande in alto).

- **Base di partenza: 50** — tutte le stats iniziali sono normalizzate affinche l'overall parta esattamente da 50
- **Massimo: 99**
- **Curva per eta** (cambiamento casuale annuale):
  - **16-25 anni**: crescita random positiva, da +1 a +4 a stagione
  - **26-30 anni**: nessuna crescita forzata, il gen dipende solo dagli eventi casuali
  - **31+ anni fino al ritiro**: calo random negativo, da -1 a -3 a stagione
- **Eventi casuali**: influenzano direttamente il gen:
  - Eventi positivi: +2/+5 gen
  - Eventi negativi "da infortunio" (Infortunio, Stiramento): -1/-3 gen
  - Tutti gli altri eventi (prestazioni deludenti, cartellini, critiche...): **non toccano mai il gen** — hanno effetto solo sulle stats interne, invisibili
- Il gen non viene mai ricalcolato dalle stats: segue solo la curva di eta e gli eventi

## Le statistiche visibili per fascia di ruolo

Le vecchie 20 statistiche sono nascoste: restano come meccanica interna (generano il gen di partenza e vengono toccate dagli eventi), ma a schermo vedi solo i numeri di prestazione della tua fascia:

| Fascia | Statistiche visibili |
|--------|---------------------|
| Portiere (GK) | Partite, Parate, Clean sheet, Goal subiti |
| Attaccanti e Centrocampisti (ST, LW, RW, CAM, CM, CDM, CB, LB, RB) | Partite, Gol, Assist |

Il clean sheet esiste solo per il portiere: per tutti gli altri ruoli la statistica non viene nemmeno mostrata.

## Correlazione gen ↔ prestazioni

Gol, assist, parate, clean sheet e goal subiti sono **correlati al gen** con una stessa curva a S (smoothstep):

```
t = (gen - 50) / 49        (limitato tra 0 e 1)
fattore = 1 + t^2 * (3 - 2t)
```

- Gen 50 → fattore 1.0 (valori base)
- Gen 70 → fattore ~1.36
- Gen 80 → fattore ~1.67 (la spinta piu forte)
- Gen 99 → fattore 2.0 (doppio)

Ogni statistica annuale si calcola cosi:

```
stat = base_del_ruolo * fattore_gen * rumore_casuale
```

- Il **rumore casuale** va da -25% a +25% (0.75-1.25) ed e **tirato separatamente per ogni statistica**: una stagione puo avere pochi gol ma molti assist, per non rendere il gioco troppo sistematico
- I **goal subiti** del portiere funzionano al contrario: si dividono per il fattore (gen alto → subisci meno)

### Coefficienti base per ruolo (a gen 50)

| Ruolo | Gol | Assist |
|-------|-----|--------|
| ST | 12 | 5 |
| LW / RW | 9 | 9 |
| CAM | 8 | 11 |
| CM | 6 | 9 |
| CDM | 2 | 5 |
| CB | 3 | 1 |
| LB / RB | 2 | 7 |
| GK | 0 | 0 |

Il portiere ha in piu: **Parate** (base 70/anno) e **Clean sheet** (base 9/anno), sempre scalati dal fattore gen. Le partite giocate sono casuali tra 18 e 34 a stagione, uguali per tutti.

## Le stagioni

- La carriera **inizia a 16 anni** e finisce a 40 (24 stagioni al massimo)
- Alla creazione scegli se avanzare **1 o 2 stagioni alla volta** (select nel primo passo)
- Avanzando di 2, le due stagioni vengono calcolate di fila e i risultati si sommano in un unico riepilogo
- Ogni scelta sul mercato simula subito le stagioni e apre il riepilogo: numeri dell'anno, eventi capitati con impatto sul gen, nuovo overall
- La **sezione Mercato** nella dashboard mostra sempre la scelta per l'anno dopo:
  - `[x]` Resta al club attuale
  - `[+]` Firma per una squadra (offerta di trasferimento)
  - `[ ]` Vai in prestito per un anno (squadra casuale; a fine anno torni al club)
- All'inizio, senza squadra, il mercato mostra **3 offerte di contratto**: ogni firma ti fa giocare le prime stagioni

### Trasferimenti e prestiti

- Le squadre hanno **requisiti di gen**: 50+ per la maggior parte, 70+ per i club forti, 80+ per i top club
- Il **prestito** dura una stagione: l'anno lo giochi nella squadra in prestito (il badge "IN PRESTITO A" appare nell'header) e a fine anno torni automaticamente al club di proprieta

### Il riassunto carriera

Nel profilo trovi:

- **Storico Squadre**: ogni squadra con logo, lega e range di stagioni (quella attuale e marcata ORA)
- **Riassunto Carriera**: totali carriera, miglior stagione, e la tabella "Stagioni" con una riga per anno (o per coppia di anni se giochi a 2 stagioni alla volta) che mostra eta, squadra, e i numeri della tua fascia
- **Mercato**: le 3 scelte per la prossima stagione (resta / firma / prestito, o 3 contratti all'inizio)

### Fine carriera

A 40 anni si apre il riepilogo finale: gen finale, totali di tutta la carriera, miglior stagione e squadre in cui hai giocato. Il tasto "Riepilogo" (accanto a "Cambia Squadra") lo riapre quando vuoi. Da li puoi partire con una nuova carriera.

## Gli eventi casuali

Sono **24 eventi** divisi per fascia di ruolo, cosi che ogni giocatore vive eventi pertinenti:

- **Attaccante** (ST, LW, RW): gol della vittoria, hat-trick, giocate fantastiche, rigori sbagliati...
- **Centrocampista** (CAM, CM, CDM, CB, LB, RB): assist magici, clean sheet, autogol, diffide...
- **Portiere** (GK): rigori parati, clean sheet...
- **Eventi condivisi** (11): allenamenti, infortuni, critiche del mister, interviste, cambi tattici...

Gli infortuni (gli unici a far perdere gen) sono **rari**: ~25% di probabilita che un evento sia un infortunio. Ogni stagione tirano 1-2 eventi, automaticamente — il giocatore non li attiva mai a mano.

## Interfaccia e design

L'interfaccia segue lo stile "manpage" del file DESIGN.md (spec estetica di riferimento):

- **Tema scuro**: canvas #171717, testo #fdfcfc, bordi sottili hairline
- **Un solo font**: JetBrains Mono (titoli e testo), dal design minimale
- **Niente emoji**: solo codici ruolo (GK, CB, ST...) e parentesi ASCII per gli stati (`[x]`, `[+]`, `[ ]`, `[!]`)
- **Colori semantici** come segnali: verde = successo, rosso = pericolo, giallo = avviso, blu = info
- **Selezione ruolo su campo da calcio SVG**: scegli la posizione cliccando direttamente sul campo, tutti e 10 i ruoli visibili senza scroll

## Dati

- **10 ruoli**: GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST
- **41 nazionalita** con bandiere reali (flagpedia.net)
- **66 squadre in 10 leghe**: Serie A, Premier League, La Liga, Bundesliga, Ligue 1 + Serie B, Championship, La Liga 2, 2. Bundesliga, Ligue 2 — con loghi reali (football-logos.cc, URL con hash immutabile)
- **20 statistiche interne** (6 principali + 14 dettagliate, valori 1-99): invisibili a schermo, generano il gen iniziale e vengono modificate dagli eventi
- **24 eventi** divisi in 3 fasce di ruolo

## Persistenza

La carriera si salva in **localStorage** (chiave `football_career_sim_v1`) a ogni modifica: riaprendo il browser ritrovi esattamente dove eri. Il salvataggio contiene il giocatore con stats, gen, eta, stagione, storico stagioni (per stagione: squadra, partite, gol, assist, parate, clean sheet, subiti), cronologia e prestito attivo.

## Comandi

```bash
npm install        # installa le dipendenze
npm.cmd run dev    # avvia il dev server (su Windows usa npm.cmd, npm.ps1 e bloccato)
npm.cmd run build  # build di produzione
npm.cmd run preview
```

Apri il browser su `http://localhost:5173`

## Struttura del progetto

```
src/
├── components/
│   ├── PlayerCreation.jsx    # Creazione in 3 step: nome+avanzamento, nazionalita, ruolo (campo SVG)
│   ├── PlayerDashboard.jsx   # Dashboard: profilo, riepiloghi, stagioni, mercato con 3 offerte, modali
│   └── TeamSwitcher.jsx      # Catalogo squadre con requisiti di gen
├── data/
│   ├── nationalities.js      # 41 nazionalita + URL bandiere
│   ├── roles.js              # 10 ruoli, 20 stats, generazione normalizzata a gen 50, calcolo overall
│   ├── teams.js              # 66 squadre in 10 leghe + URL loghi reali
│   └── events.js             # 24 eventi divisi per fascia (attaccante/centrocampista/portiere)
├── utils/
│   ├── gen.js                # Funzione pura genFactor (curva a S) + seasonNoise (+-25%)
│   └── storage.js            # Salvataggio/lettura/cancellazione localStorage
├── App.jsx                   # Stato carriera e routing creazione/dashboard
├── main.jsx                  # Entry point
└── index.css                 # Tailwind + componenti custom (btn, card, text-input)
```

## Risorse esterne

- **Bandiere**: [flagpedia.net](https://flagpedia.net) — `https://flagpedia.net/data/flags/normal/{code}.png`
- **Loghi squadre**: [football-logos.cc](https://football-logos.cc) — `https://assets.football-logos.cc/logos/{country}/{size}/{slug}.{hash}.png` (gli hash non vanno rigenerati: ognuno e legato al logo)
- **Fallback loghi**: SVG placeholder inline in caso di errore di caricamento

## Licenza

Progetto personale - uso libero
