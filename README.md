# millor-primera-paraula-wordle
Calculador de millor primera paraula pel wordle.

## Motivació
Us heu preguntat mai quina és la millor paraula que es pot usar en el wordle, en primera instància?

Aquest projecte intenta construir l'algoritme més refinat per trobar la paraula més útil del diccionari per començar el joc.

## Descripció
L'Script pren el diccionari que li coloquis amb un format LanguageTool, el llegeix i torna una paraula.

## Ús

A la carpeta diccionari has de colocar-hi un fitxer _index.txt_ amb el diccionari que vulguis analitzar.

Córre `npm start` a la linea de comandes.

* Per defecte utilitza 5 lletres, està limitat desde 3 a 7 lletres, amdos inclosos, passant un paràmetre de la següent manera:
`NUM_LLETRES=7 npm start`

### Requisits

Necessites tenir _node_ amb _npm_ instalat.
