---
title: "Pubblicare una libreria Vue senza passaggio di build"
description: "UI Vintage pubblica il proprio codice sorgente e lascia che ogni app Nuxt lo compili. Questa scelta elimina un'intera categoria di problemi e ne introduce un paio di nuovi."
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-08-12T00:00:00Z"
dateModified: "2026-08-12T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "engineering"
categoryText: "Sviluppo"
language: "it"
tags: ["Nuxt", "Librerie di componenti", "Strumenti"]
faqs:
  - question: "Pubblicare il sorgente rende più lenta la build delle app?"
    answer: "Un po', perché l'app compila la libreria insieme al proprio codice. In pratica la differenza è piccola, e l'app compila solo i componenti che importa davvero."
  - question: "Un'app Vue senza Nuxt può usare il pacchetto?"
    answer: "Non direttamente. I componenti si basano su funzionalità di Nuxt come NuxtImg e sul modulo che inietta stili e traduzioni."
---

## La maggior parte delle librerie pubblica una seconda copia di sé stessa

Una tipica libreria di componenti ha due versioni del proprio codice: il sorgente che modifichi e un bundle compilato in `dist/` che pubblichi. Tenerle allineate è un lavoro a sé, con la configurazione del bundler, i file di dichiarazione e qualche bug che esiste solo nella build.

UI Vintage salta la seconda copia. Il pacchetto npm contiene i file `.vue` e `.ts` così come sono scritti, e il modulo Nuxt dice a ogni app di compilarli come se fossero codice suo.

## Cosa ottieni gratis

Il vantaggio evidente è avere meno strumenti da gestire. Quello meno evidente è che la libreria si comporta esattamente come il codice dell'app, perché viene compilata dagli stessi strumenti con le stesse impostazioni.

::Flow
---
title: "Dall'installazione alla pagina"
description: "La libreria non si compila mai da sola. Lo fa l'app, una volta, insieme a tutto il resto."
orientation: horizontal
items:
  - "npm install"
  - "Il modulo si registra"
  - "L'app compila il sorgente"
  - "Pagina con tree-shaking"
---
::

Tailwind analizza direttamente i template della libreria, quindi ogni classe di utilità usata da un componente finisce nel foglio di stile dell'app. Vite applica il tree-shaking per ogni sottopercorso importato, quindi una pagina che usa solo un pulsante non carica mai il selettore di date.

::CodeBlock
---
title: "Installare la libreria"
language: "bash"
code: |
  npm install @brumaombra/ui-vintage
  npx nuxi module add @brumaombra/ui-vintage
---
::

### I compromessi sono reali

L'argomento più forte contro questo approccio è che lega la libreria al suo framework. Un bundle compilato potrebbe, in teoria, funzionare in qualsiasi app Vue. Un pacchetto sorgente ha bisogno degli strumenti per cui è stato scritto, che qui significa Nuxt.

C'è anche un contratto di versione da rispettare. Poiché le app compilano il sorgente, un aggiornamento della libreria può far emergere un errore di tipo nella build dell'app che un bundle precompilato avrebbe nascosto. Si può considerare una funzionalità, ma significa che ogni rilascio richiede un controllo dei tipi prima della pubblicazione.

Per una libreria usata solo da app Nuxt, il compromesso è facile da accettare. Il punto non è che i passaggi di build siano sbagliati. È che anche una build è codice, e il codice più economico da mantenere è quello di cui non hai bisogno.