---
title: "Perché le animazioni a molla sembrano più veloci di quanto siano"
description: "Una molla che supera di poco il bersaglio può durare più di una semplice dissolvenza e sembrare comunque più rapida. Ecco perché, e dove il trucco smette di funzionare."
image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-07-02T00:00:00Z"
dateModified: "2026-07-02T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "motion-design"
categoryText: "Motion design"
language: "it"
tags: ["Motion", "CSS", "UX"]
faqs:
  - question: "Le animazioni a molla richiedono una libreria JavaScript?"
    answer: "Non più. La funzione CSS linear() può descrivere direttamente una curva a molla, quindi il browser la esegue come qualsiasi altra easing, senza script sul thread principale."
  - question: "Ogni animazione dovrebbe usare una molla?"
    answer: "No. Le molle sono adatte agli elementi che entrano in posizione, come pannelli, indicatori e segni di spunta. Gli elementi che escono dallo schermo di solito funzionano meglio con un ease-out breve e semplice."
---

## Il cronometro e la sensazione non sono d'accordo

Apri un menu a tendina che compare con una dissolvenza di 200 millisecondi, poi aprine uno che entra con una molla in 380. Quasi tutti ti diranno che il secondo è sembrato più veloce. Sembra un controsenso, ma è un risultato piuttosto affidabile, ed è il motivo per cui i componenti di UI Vintage usano le molle per quasi tutto ciò che entra in posizione.

Quindi, cosa succede? In breve: non giudichiamo la velocità da quando un'animazione finisce. La giudichiamo da quando compare qualcosa di utile.

## La maggior parte del movimento avviene all'inizio

Una curva a molla concentra il movimento all'inizio. Nel primo terzo dell'animazione l'elemento percorre gran parte della distanza, poi passa il tempo restante ad assestarsi, a volte superando di poco il bersaglio per poi tornare indietro. Una curva lineare o simmetrica fa l'opposto: parte lentamente, quindi i primi fotogrammi quasi non si muovono.

Per questo una molla diventa "leggibile" prima, anche quando la sua durata totale è maggiore. L'assestamento finale si percepisce come cura del dettaglio, non come attesa.

::BlogList
---
variant: checkmark
items:
  - "Pannelli e menu raggiungono presto la posizione finale, quindi il contenuto è leggibile quasi subito"
  - "Un piccolo superamento del bersaglio comunica che il movimento è fisico, e il risultato sembra intenzionale"
  - "Gli indicatori che seguono una selezione, come la sottolineatura delle schede, sembrano collegati al gesto dell'utente"
---
::

## Scrivere una molla in puro CSS

Fino a poco tempo fa, una molla convincente richiedeva una libreria di animazione in JavaScript. La funzione di easing `linear()` ha cambiato le cose: accetta un elenco di punti, quindi puoi campionare una curva a molla una volta sola e affidarla al browser.

::CodeBlock
---
title: "Una easing a molla come proprietà personalizzata CSS"
language: "css"
code: |
  :root {
      --ease-spring: linear(0, 0.0292 1.6%, 0.4254 8.4%, 0.6922 13.7%,
          0.8729 19.8%, 0.9764 27.2%, 1.0173 36.7%, 1.0201 43.1%, 1);
  }

  .menu[data-state="open"] {
      animation: float-in 380ms var(--ease-spring) both;
  }
---
::

Il browser la esegue esattamente come `ease-out`, quindi resta fluida anche quando il thread principale è occupato.

### Dove il trucco smette di funzionare

Attenzione però: le molle non sono gratis. Un superamento del bersaglio su un elemento grande, come un pannello a tutto schermo, può sembrare traballante più che vivace. E in uscita la fase di assestamento è solo ritardo: nessuno vuole guardare un menu che rimbalza mentre sparisce.

La regola che segue la libreria è semplice. Le molle fanno entrare gli elementi, curve ease-out brevi li fanno uscire, e chi chiede movimento ridotto non vede alcuna animazione. Quest'ultimo punto conta più di qualsiasi curva, perché per alcuni lettori il movimento non è una questione di gusti.

Il punto non è che le molle siano sempre migliori. È che la velocità percepita dipende da quando lo schermo diventa utile, e una buona curva ti permette di usare un po' più di tempo senza far aspettare nessuno.