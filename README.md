# millor-primera-paraula-wordle
Calculador de millor primera paraula pel wordle.

## Motivació
Us heu preguntat mai quina és la millor paraula que es pot usar en el wordle, en primera instància?

Aquest projecte intenta construir l'algoritme més refinat per trobar la paraula més útil del diccionari per començar el joc.

## Descripció
L'Script pren el diccionari que li coloquis amb un format LanguageTool, el llegeix i torna una paraula.

### Algortime
1) ens interessa la lletra que tingui un valor total de coincidències (comptant també les paraules en que es repeteix).
Hem de tenir en compte dues vegades la 'a' a la paraula 'taula', encara que després no ens interessi utilitzar-la.
2) utilitzarem la posició total més coincident.
De totes les paraules, necessitem saber quin número de vegades s'utilitza cada lletra en cada posició. Aquest serà la *posició total*.
3) si no hi ha paraula en la *posició total* més coincident, utilitzarem el valor de posició de les paraules restants.
Sacrifiquem la posició total, per la restant, en pro d'utilitzar les lletres més coincidents.
4) Cada vegada que fem aquests passos, hem de filtrar les paraules. Si no, podem arribar a un atzucac, on no existeixen paraules amb aquelles lletres.

Necessitem:

`
coincidenciesPerPosicio = {
  a: [10,2,3,5,6],
  ...
}
`

`
totals = {
  a: 26,
  ...
}
`

[boira]
[_oi_a]

## Ús

A la carpeta diccionari has de colocar-hi un fitxer _index.txt_ amb el diccionari que vulguis analitzar.

Córre `npm start` a la linea de comandes.

* Per defecte utilitza 5 lletres, està limitat desde 3 a 7 lletres, amdos inclosos, passant un paràmetre de la següent manera:
`NUM_LLETRES=7 npm start`

### Requisits

Necessites tenir _node_ amb _npm_ instalat.
