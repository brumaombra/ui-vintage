---
title: "La modalità scura è un secondo design, non un filtro"
description: "Invertire i colori produce un tema scuro che funziona ma sembra leggermente sbagliato ovunque. I token semantici risolvono quasi tutto. Ombre e accenti richiedono più attenzione."
image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-09-08T00:00:00Z"
dateModified: "2026-09-10T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "design-systems"
categoryText: "Sistemi di design"
language: "it"
tags: ["Sistemi di design", "Temi", "CSS"]
faqs:
  - question: "La modalità scura dovrebbe seguire il sistema operativo?"
    answer: "Come impostazione predefinita, sì. Il selettore del tema di UI Vintage parte in modalità automatica e segue il sistema, ma permette di scegliere esplicitamente chiaro o scuro e ricorda la scelta."
  - question: "Perché le ombre scure sono molto più marcate?"
    answer: "Perché un'ombra ha bisogno di contrasto con la superficie dietro. Su uno sfondo scuro un'ombra morbida è quasi invisibile, quindi il tema scuro usa valori più profondi e opachi per creare la stessa sensazione di profondità."
---

## Il tema che sembra quasi giusto

Il modo più rapido per avere una modalità scura è scambiare il bianco con il nero e il nero con il bianco. Funziona, nel senso che il testo resta leggibile. Ma sembra anche leggermente sbagliato, in un modo difficile da descrivere: le ombre spariscono, il colore d'accento abbaglia e ogni bordo sembra troppo marcato o del tutto assente.

Questo perché un tema scuro non è il tema chiaro a luci spente. I colori si comportano diversamente su uno sfondo scuro, e alcuni hanno bisogno di decisioni proprie.

## Dai un nome ai colori in base al ruolo, non alla tonalità

La correzione che fa gran parte del lavoro è un cambio di vocabolario. Invece di usare `white`, `gray-100` o `#1b222d`, i componenti usano nomi che descrivono un ruolo: `background`, `card`, `surface`, `border`, `muted-foreground`. Ogni tema decide poi che aspetto hanno quei ruoli.

::Flow
---
title: "Come un token diventa un colore"
orientation: vertical
items:
  - "Un componente chiede bg-card"
  - "Il token punta a --card"
  - "Il tema chiaro o scuro definisce --card"
  - "Tutte le card si aggiornano insieme"
---
::

In pratica, un componente scritto una volta non ha mai bisogno di una variante `dark:` per i suoi colori. Quando il tema cambia, ogni superficie cambia con lui.

### Tre cose che i token non risolvono

Sembra tutto il lavoro, ma alcuni dettagli richiedono ancora un occhio umano:

::BlogList
---
variant: numbered
items:
  - "I colori d'accento hanno bisogno di un valore più chiaro e un po' più caldo in modalità scura, altrimenti abbagliano sullo sfondo"
  - "Le ombre richiedono un'opacità molto più alta, perché un'ombra morbida sparisce su una superficie scura"
  - "Immagini e illustrazioni possono richiedere versioni scure dedicate, perché i token non possono ricolorare una foto"
---
::

## Due design, un solo vocabolario

Il punto non è che la modalità scura richieda il doppio del lavoro. Con i token semantici, gran parte è davvero automatica. È che la parte restante, gli accenti, la profondità, le immagini, merita la stessa attenzione del tema chiaro. Chi sceglie la modalità scura spesso la usa tutto il giorno, e si accorge quando è stata un ripensamento.