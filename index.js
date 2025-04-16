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

  const entradesPerParaula = paraulesArrel.reduce((prev, entrada) => {
    const paraulaSenseAccents = eliminaAccents(entrada.origen.toLowerCase())
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

// mètodes per getMillorParaula

const getPosicions = () => Array(QUANTITAT_LLETRES).fill().map(() => 0)

const lletresAbecedari = ABECEDARI.split('')
const getPosicionsPerLletresInici = () => lletresAbecedari.reduce((prev, lletra
) => ({
  ...prev,
  [lletra]: getPosicions()
}), {})

const getTotalsPerLletresInici = () => lletresAbecedari.reduce((prev, lletra
) => ({
  ...prev,
  [lletra]: 0
}), {})

const getPosicionsPerLletres = (paraules) => {
  const posicionsPerLletres = getPosicionsPerLletresInici()

  paraules.forEach(lletres => {
    lletres.forEach((lletra, posicio) => {
      posicionsPerLletres[lletra][posicio]++
    })
  })

  return posicionsPerLletres
}

const getTotalsPerLletres = (paraules) => {
  const totalsPerLletres = getTotalsPerLletresInici()

  paraules.forEach(lletres => {
    lletres.forEach((lletra) => {
      totalsPerLletres[lletra]++
    })
  })

  return totalsPerLletres
}



const getCounterLletres = ({
  posicionsPerLletres, 
  totalsPerLletres,
  posicionsJaUsades, 
  lletresJaUsades
}) => {

  const counterLletres = []
  
  Object
    .entries(posicionsPerLletres)
    .forEach(([lletra, llistaQuantitat]) => {
      if(lletresJaUsades.includes(lletra)) return 

      llistaQuantitat.forEach((quantitat, posicioLletra) => {
        if(posicionsJaUsades.includes(posicioLletra)) return

        const mateixaQuantitatAmbQUantitatTotalInferior = quantitat in counterLletres &&
        totalsPerLletres[counterLletres[quantitat].lletra] >
        totalsPerLletres[lletra]

        if(mateixaQuantitatAmbQUantitatTotalInferior) {
          return
        }

        counterLletres[quantitat] = { 
          lletra, 
          posicioLletra, 
          quantitat, 
          total: totalsPerLletres[lletra] 
        }
      })
    })

    return counterLletres
}


const getMillorParaula = ({ paraules, numLletres }) => {
  const lletresDeParaules = paraules
    .map(paraula => paraula.split(''))

  const totalsPerLletres = getTotalsPerLletres(lletresDeParaules)

  let restaLletresDeParaules = [...lletresDeParaules]
  let lletresJaUsades = []
  let posicionsJaUsades = []
  let maxLletraPerQuantitat = { quantitat: 0 }
  let millorLletres = []

  while(posicionsJaUsades.length < numLletres){
    const posicionsPerLletres = getPosicionsPerLletres(restaLletresDeParaules)

    const counterLletres = getCounterLletres({
      posicionsPerLletres, 
      totalsPerLletres,
      posicionsJaUsades, 
      lletresJaUsades
    })

    maxLletraPerQuantitat = counterLletres.at(-1)

    millorLletres[maxLletraPerQuantitat.posicioLletra] = maxLletraPerQuantitat.lletra

    console.log(maxLletraPerQuantitat)

    posicionsJaUsades = [
      ...posicionsJaUsades, 
      maxLletraPerQuantitat.posicioLletra
    ]
    lletresJaUsades = [
      ...lletresJaUsades, 
      maxLletraPerQuantitat.lletra
    ]

    restaLletresDeParaules = restaLletresDeParaules
    .filter((llistaLletres) => 
      llistaLletres[maxLletraPerQuantitat.posicioLletra] === maxLletraPerQuantitat.lletra
    )
  }

  const millorParaula = millorLletres.join('')
  const millorEntrada = entradesPerParaula[millorParaula]

  return millorEntrada
}

const millorParaula = getMillorParaula({
  paraules: totesLesParaules, 
  numLletres: QUANTITAT_LLETRES
})

console.log(millorParaula)

console.timeEnd('performance')