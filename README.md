# millor-primera-paraula-wordle
Calculador de millor primera paraula pel wordle.

## Motivació
Us heu preguntat mai quina és la millor paraula que es pot usar en el wordle, en primera instància?

Aquest projecte intenta construir l'algoritme més refinat per trobar la paraula més útil del diccionari per començar el joc.

## Descripció
L'Script pren el diccionari que li coloquis amb un format LanguageTool, el llegeix i torna una paraula.

### Algortime

- Filtrem el diccionari per paraules de la llargada
- Enumerem les coincidencies de lletres en totes les paraules
- Enumerem les coincidencies de lletres en cada una de les posicions
- Ordenem les lletres per quantitat de coincidencia
- Ordenem les posicions per quantitat de coincidencia
- Busquem lletres fins que en tinguem tantes com desitjades, per defecte 5:
1) Prenem la següent lletra no utilitzada
2) prenem la següent posicio no utilitzada
3) busquem una paraula amb aquesta lletra
    - Si existeix, guardem la lletra i la posicio com a utilitzades
    - Si no existeix, tornem al pas 2, fins que comprovem totes les posicions
    - Si no existeix cap paraula, en cap posicio, amb la lletra, tornem al pas 1

## Ús

A la carpeta diccionari has de colocar-hi un fitxer _index.txt_ amb el diccionari que vulguis analitzar.

Córre `npm start` a la linea de comandes.

* Per defecte utilitza 5 lletres, està limitat desde 3 a 7 lletres, amdos inclosos, passant un paràmetre de la següent manera:
`NUM_LLETRES=7 npm start`

### Requisits

Necessites tenir _node_ amb _npm_ instalat.
