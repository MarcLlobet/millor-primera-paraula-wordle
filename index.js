const fs = require('fs');
const diccionari = fs.readFileSync('./diccionari/index.txt', 'utf-8');

console.time('performance')

const QUANTITAT_LLETRES_PER_DEFECTE = 5
const MAX_QUANTITAT_LLETRES = 7
const MIN_QUANTITAT_LLETRES = 3

const NUM_LLETRES = process.env.NUM_LLETRES

const getLettersAmountParam = (numLletresParam) => {
  if(!numLletresParam) return QUANTITAT_LLETRES_PER_DEFECTE

  const quantitatLletresParametre = Number(process.env.NUM_LLETRES)

  const esUnNumero = !!quantitatLletresParametre && !Number.isNaN(quantitatLletresParametre)

  if(!esUnNumero) return QUANTITAT_LLETRES_PER_DEFECTE

  const numeroLimitat = Math.max(Math.min(quantitatLletresParametre, MAX_QUANTITAT_LLETRES), MIN_QUANTITAT_LLETRES)

  return numeroLimitat === quantitatLletresParametre 
    ? numeroLimitat 
    : QUANTITAT_LLETRES_PER_DEFECTE
}

const QUANTITAT_LLETRES = getLettersAmountParam(NUM_LLETRES)

console.log({QUANTITAT_LLETRES})

const getEntrades = (diccionari) => {
  const lineas = diccionari.split('\n')

  return lineas.map(entrada => {
      const [derivada, origen, definicio] = entrada.split(' ') ?? []
      return {
          derivada,
          origen,
          definicio,
      }
    })
}

const totesLesEntrades = getEntrades(diccionari)

const ABECEDARI = 'abcçdefghijklmnopqrstuvwxyz'
const eliminaAccents = (paraula) => 
  paraula
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/c(?=̧)/g, "ç")

const getEntradesPerParaula = (paraules) => {
  const paraulesPerLlargada = paraules
  .filter(({origen}) => origen?.length === QUANTITAT_LLETRES)

  const paraulesArrel = paraulesPerLlargada.filter(({origen, derivada}) => origen === derivada)

  const entradesPerParaula = paraulesArrel
  .filter(({origen}) => origen.toLowerCase() === origen)
  .reduce((prev, entrada) => {
    const paraulaSenseAccents = eliminaAccents(entrada.origen)
    const paraulaAmbCaractersValids = paraulaSenseAccents
      .split('')
      .every(lletra => ABECEDARI.includes(lletra)
    )

    if(!paraulaAmbCaractersValids) return prev

    return {
      ...prev,
      [paraulaSenseAccents]: entrada
    }
  }, {})
  
  return entradesPerParaula
}

const entradesPerParaula = getEntradesPerParaula(totesLesEntrades)
const totesLesParaules = Object.keys(entradesPerParaula)


const getPosicions = () => Array(QUANTITAT_LLETRES).fill().map((_, posicio) => ({ quantitat: 0, posicio}))

const lletresAbecedari = ABECEDARI.split('')

const diccionariLletres = lletresAbecedari.reduce((prev, lletra) => ({
  ...prev,
  [lletra]: {
    lletra,
    posicions: getPosicions(),
    total: 0
  }
}), {})

totesLesParaules.forEach(paraula => 
  paraula.split('').forEach((lletra, index) => {
    const lletraDiccionari = diccionariLletres[lletra]
    lletraDiccionari.posicions[index].quantitat++
    lletraDiccionari.total++
  })
)

let paraulesRestants = totesLesParaules
  .filter(paraula => paraula.length === new Set(paraula).size)

let lletresOrdenades = Object.values(diccionariLletres)
  .map(lletra => ({
    ...lletra,
    posicions: lletra.posicions.sort((a, b) => b.quantitat - a.quantitat)
  }))
  .sort((a, b) => b.total - a.total)


  const millorLletres = Array(QUANTITAT_LLETRES).fill().reduce((prev) => {
    
    seguentLletra = lletresOrdenades.find(({posicions, lletra}) => {
      if(prev.lletresJaUsades?.includes(lletra)) return

      seguentPosicio = posicions.find(({posicio}) => {
        if(prev.posicionsJaUsades?.includes(posicio)) return

        return prev.paraulesRestants.find(paraula => 
          lletra === paraula[posicio]
        )}
      )
      return !!seguentPosicio
      }
    )
    console.log({seguentLletra, seguentPosicio})
    

    return {
      paraulesRestants: prev?.paraulesRestants.filter(paraula => paraula  [seguentPosicio.posicio] === seguentLletra.lletra),
      lletres: [
        ...prev?.lletres,
        {
          ...seguentLletra,
          posicio: seguentPosicio
        }
      ],
      posicionsJaUsades: [
        ...prev?.posicionsJaUsades,
        seguentPosicio.posicio,
      ],
      lletresJaUsades: [
        ...prev?.lletresJaUsades,
        seguentLletra.lletra,
      ]
    }

  }, {
    paraulesRestants,
    lletres: [],
    posicionsJaUsades: [],
    lletresJaUsades: [],
  })

const millorParaula = []

millorLletres.lletres.forEach(({lletra, posicio}) => 
  millorParaula[posicio.posicio] = lletra
)

const millorEntrada = entradesPerParaula[millorParaula.join('')]

console.log({millorEntrada})