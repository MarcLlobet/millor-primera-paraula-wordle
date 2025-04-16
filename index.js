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

const getPosicionsPerLletres = (paraules) => paraules.reduce((prevLletres, lletres) => ({
  ...prevLletres,
  ...lletres.reduce((prevLletra, lletra, posicio) => ({
      ...prevLletra,
      [lletra]: [
        ...prevLletra[lletra].slice(0, posicio),
        prevLletra[lletra][posicio] + 1,
        ...prevLletra[lletra].slice(posicio + 1),
      ]
  }), prevLletres)
}), getPosicionsPerLletresInici())

const getMillorParaula = ({ paraules, numLletres }) => {
  const lletresDeParaules = paraules
    .map(paraula => paraula.split(''))

  let restaLletresDeParaules = [...lletresDeParaules]
  let lletresJaUsades = []
  let posicionsJaUsades = []
  let maxLletraPerQuantitat = { quantitat: 0 }
  let millorLletres = []

  while(posicionsJaUsades.length < numLletres){
    const posicionsPerLletres = getPosicionsPerLletres(restaLletresDeParaules)

    Object.entries(posicionsPerLletres)
    .filter(([lletra]) => !lletresJaUsades.includes(lletra))
    .forEach(([lletra, llistaQuantitat]) => {
      llistaQuantitat
      .forEach((quantitat, posicioLletra) => {
        if(posicionsJaUsades.includes(posicioLletra)){
          return
        }
        if(maxLletraPerQuantitat.quantitat >= quantitat){
          return
        }

        maxLletraPerQuantitat = {
          lletra,
          quantitat,
          posicioLletra,
        }

        millorLletres[posicioLletra] = lletra
        
      })
    })

    console.log(maxLletraPerQuantitat)

    posicionsJaUsades.push(maxLletraPerQuantitat.posicioLletra)
    lletresJaUsades.push(maxLletraPerQuantitat.lletra)
    maxLletraPerQuantitat.quantitat = 0

    restaLletresDeParaules = restaLletresDeParaules.filter((llistaLletres) => 
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