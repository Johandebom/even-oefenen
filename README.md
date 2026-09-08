# Even oefenen — Blok 1

[Open de leerpagina](https://johandebom.github.io/even-oefenen/)

Een zelfstandige HTML-pagina met 42 flashcards en 28 nieuwe meerkeuzevragen over wetenschapsfilosofie. Open index.html of publiceer deze pagina met GitHub Pages.

- Gemengde setjes van maximaal 7 unieke leeritems; herhalingen gaan voor nieuwe items.
- Quizvragen worden direct nagekeken. Flashcards hebben een modelantwoord en zelfbeoordeling.
- Fout: uitleg, achteraan aansluiten en opnieuw beantwoorden. Fouten resetten de dagenopbouw.
- Goed: tussenpozen van 1, 3, 5, 8, 11, 14 en daarna telkens 14 dagen.
- Dezelfde dag goed herhalen verhoogt de stap niet. Na een fout en succesvolle herhaling is de volgende beurt morgen.
- Voortgang en onafgemaakte setjes worden lokaal in de browser bewaard. Back-up exporteren/importeren ondersteunt overstappen naar een ander apparaat. Geen accounts of automatische synchronisatie.

## Bronnen en afbakening

Alle aangeleverde bronbestanden zijn bekeken: College 1 voor Canvas.pdf (42 slides), litratuur.txt en elf screenshots van de Week 1 Quiz (10 vragen en een resultaatbeeld). Het literatuurbestand is een samenvatting; de originele publicaties van Okasha en Pfeffer & Sutton zijn niet meegeleverd. De leeritems claimen geen volledige dekking van die ontbrekende publicaties of van het volledige tentamen. Collegeorganisatie, deadlines en toetsweging zijn geen leerkaarten geworden.

De bronverwijzing staat bij elk item. L = literatuursamenvatting, C = college, Q = Week 1 Quiz. Casussen zijn nieuw geschreven variaties op dezelfde begrippen; het zijn geen officiële examenvragen. De oorspronkelijke PDF en screenshots horen niet in de publieke repository.

## Uitbreiden

Voeg inhoud toe in blok-1.js met nieuwe stabiele IDs. Hernoem bestaande IDs niet: daaraan is voortgang gekoppeld. Houd vragen met gewijzigde betekenis apart met een nieuw ID. Voor een volgend blok kunnen nieuwe blokbestanden aan de databank en blokkeuze worden toegevoegd, zonder bestaande voortgang te verwijderen.

De leesbare data staan ook in blok-1.json. Bouw de zelfstandige pagina opnieuw met `node build.cjs`; controleer de logica met `node test.cjs`. De pagina zelf heeft geen installatie of externe bibliotheken nodig.

Publicatie: plaats index.html op de hoofdbranch en stel GitHub Pages in op deploy from branch, main, /(root).

