---
title: "Progettare un sistema editoriale riutilizzabile"
description: "Come abbiamo trasformato un'interfaccia blog usata una sola volta in una superficie editoriale riutilizzabile, capace di mantenere la propria identità anche fuori dal prodotto originale."
image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
datePublished: "2026-06-10T00:00:00Z"
dateModified: "2026-06-12T00:00:00Z"
author: "Bruma"
authorUrl: "https://brumaombra.com"
authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
categorySlug: "design-systems"
categoryText: "Sistemi di design"
language: "it"
faqs:
  - question: "Perché spostare l'interfaccia blog in una libreria condivisa?"
    answer: "Perché permette a più progetti di riutilizzare le stesse superfici editoriali, le scelte di spaziatura e i pattern di interazione senza ricostruirli ogni volta."
  - question: "Cosa dovrebbe restare specifico dell'app?"
    answer: "Le query dei contenuti, la strategia SEO e i blocchi di conversione specifici del prodotto appartengono all'app, mentre card, liste, sidebar e pannelli informativi riutilizzabili appartengono alla libreria."
---

## Parti dal ritmo editoriale

Un'interfaccia blog riutilizzabile funziona meglio quando tipografia e spaziatura sono stabili prima di pensare al branding del prodotto. Quando ogni progetto deve reinterpretare titoli, card o metadati, il livello condiviso dei componenti smette di far risparmiare tempo.

In questa demo l'obiettivo non è simulare un CMS con dati infiniti. È dimostrare che i componenti condivisi per i contenuti possono visualizzare un articolo credibile, un flusso di categorie e un'esperienza di navigazione coerente tra le route.

::BlogList
---
variant: checkmark
items:
  - "Tipografia e spaziatura stabili rendono portabile la pagina dell'articolo"
  - "I blocchi condivisi riducono la duplicazione tra app basate sui contenuti"
  - "I wrapper preservano la compatibilità a livello di app mentre spostano la UI reale nella libreria"
---
::

### Un sistema riutilizzabile ha bisogno di confini chiari

La libreria possiede gli elementi di interfaccia riutilizzabili: card hero, carousel, griglie di categorie, FAQ, informazioni sull'autore e comportamento dell'indice dei contenuti. La demo app possiede la sorgente dei contenuti e la composizione delle route.

È questo confine a rendere il setup portabile. Un altro progetto può cambiare l'inventario degli articoli, le informazioni sull'autore o la frequenza di pubblicazione senza riscrivere i blocchi condivisi.

---

## I contenuti reali sono un test migliore degli array statici

Gli array simulati sono utili all'inizio, ma nascondono la forma reale di una pagina editoriale. Quando i contenuti vivono nel markdown, puoi verificare subito la gestione dei percorsi, i campi del frontmatter, le query dei contenuti correlati e il rendering del corpo dell'articolo.

È qui che il comportamento simile alla produzione diventa importante. Una pagina articolo funzionante non è solo un'immagine hero con qualche paragrafo. Include:

::BlogList
---
variant: circle
items:
  - "Metadati della categoria"
  - "Informazioni sull'autore e sulla pubblicazione"
  - "Un indice dei contenuti basato sui dati"
  - "Link agli articoli correlati"
  - "Link alle categorie correlate"
---
::

::Terminal
---
title: Installa il progetto
commands:
  - npm install
  - npm run dev
---
::

::BlogTable
---
highlightCol: 1
headers: ["Responsabilità", "Libreria", "App"]
rows:
  - ["Blocchi UI editoriali", "Card, liste, tabelle, divisori, indice, FAQ, informazioni autore", "Li utilizza tramite wrapper o import diretti"]
  - ["Sorgente dei contenuti", "Nessun contenuto di prodotto hardcoded", "Entry markdown e query delle route"]
  - ["Blocchi di conversione specifici", "Opzionali", "Gestisce card CTA come GiveItATryCard"]
---
::

### Il markdown fa emergere le ipotesi sui contenuti

Con il markdown nel flusso, la pagina deve gestire prosa lunga e titoli annidati in modo naturale. Se spaziatura, stili della prosa o dati dell'indice si rompono, il problema diventa subito evidente.

## La demo app dovrebbe comportarsi come un consumer

La demo app è più utile quando esercita la libreria come farebbe un prodotto reale. Questo significa importare i subpath pubblicati, affidarsi ai moduli Nuxt usati in produzione e interrogare i contenuti tramite le stesse API invece di aggirarle.

Questo approccio mantiene la demo onesta. Se qualcosa è complicato qui, sarà complicato anche per la prossima app che utilizzerà la libreria.