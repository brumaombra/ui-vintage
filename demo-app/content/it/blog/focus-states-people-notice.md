---
title: "Progettare stati di focus che le persone notano davvero"
description: "Chi naviga con la tastiera si affida all'anello di focus per sapere dove si trova. Molti design lo nascondono o lo rendono sbiadito. Poche regole lo rendono visibile ed elegante."
image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-07-21T00:00:00Z"
dateModified: "2026-07-24T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "accessibility"
categoryText: "Accessibilità"
language: "it"
tags: ["Accessibilità", "CSS", "Sistemi di design"]
faqs:
  - question: "Perché usare focus-visible invece di focus?"
    answer: "Il selettore :focus-visible si attiva solo quando il browser ritiene utile un indicatore visibile, di solito durante la navigazione da tastiera. Chi usa il mouse non vede un anello dopo ogni clic, chi usa la tastiera lo vede sempre."
  - question: "Basta un cambio di colore per mostrare il focus?"
    answer: "Di solito no. Un semplice cambio di colore può sfuggire a chi ha una vista ridotta o non distingue bene i colori. Un anello o un contorno che cambia la forma intorno all'elemento è molto più facile da individuare."
---

## L'anello che tutti rimuovono

Se ti è mai capitato di premere Tab su un sito e perdere il punto in cui ti trovavi, hai incontrato il bug di accessibilità più comune del web. Qualcuno ha rimosso il contorno di focus perché era brutto, e niente lo ha sostituito.

È una scelta comprensibile. I contorni predefiniti del browser raramente si adattano al design. Ma per chi naviga con la tastiera, l'indicatore di focus è il cursore. Senza di esso, la pagina diventa di fatto cieca.

## Visibile, non invadente

La distinzione importante è tra uno stato di focus **visibile** e uno **che distrae**. L'obiettivo è un anello impossibile da non vedere quando lo cerchi, e quasi invisibile quando non ti serve.

In UI Vintage ogni elemento interattivo usa la stessa ricetta: un anello di tre pixel nel colore primario con opacità parziale, disegnato all'esterno dell'elemento così da non spostare mai il layout.

::BlogTable
---
headers: ["Approccio", "Visibile da tastiera", "Disturba chi usa il mouse", "Resiste agli stili personalizzati"]
rows:
  - ["Contorno predefinito del browser", "Sì", "A volte", "Spesso si perde"]
  - ["outline: none", "No", "No", "Non applicabile"]
  - ["Solo cambio di colore", "A malapena", "No", "Sì"]
  - ["Anello su :focus-visible", "Sì", "No", "Sì"]
highlightCol: 1
---
::

### Il contrasto conta ancora

Sembra semplice, ma un anello è utile solo se si distingue sia dall'elemento sia dalla pagina dietro. Un anello arancione su un pulsante arancione sparisce. La soluzione è un piccolo spazio tra l'elemento e l'anello, di solito nel colore di sfondo della pagina, così l'anello ha sempre qualcosa con cui contrastare.

## Provalo nel modo più noioso

Non esistono scorciatoie. Scollega il mouse, o semplicemente smetti di toccarlo, e percorri una pagina con Tab, Maiusc+Tab, Invio e i tasti freccia. Se in qualsiasi momento non capisci dove ti trovi, non lo capirà nemmeno chi legge.

Il punto non è aggiungere decorazioni. È fare in modo che la pagina risponda in ogni momento a una domanda: dove mi trovo? Un buono stato di focus risponde con discrezione, e di solito il design ne guadagna.