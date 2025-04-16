const fs = require('fs');
const diccionari = fs.readFileSync('./diccionari/index.txt', 'utf-8');
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

const lineas = diccionari.split('\n')

const entrades = lineas.map(entrada => {
    const [derivada, origen, definicio] = entrada.split(' ') ?? []
    return {
        derivada,
        origen,
        definicio,
    }
}
)

const eliminaAccents = (paraula) => 
  paraula
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/c(?=̧)/g, "ç");

const paraulesOriginals = entrades
  .filter(({origen}) => origen?.length === QUANTITAT_LLETRES)
  .filter(({origen, derivada}) => origen === derivada)
  .reduce((prev, entrada) => {
    const newOrigen = eliminaAccents(entrada.origen.toLowerCase())
    return {
      ...prev,
      [newOrigen]: entrada
    }
  }, {})

const paraulesNormalitzades = Object.keys(paraulesOriginals)

const ABECEDARI = 'abcçdefghijklmnopqrstuvwxyz'

const getLlistaPosicio = () => Array(QUANTITAT_LLETRES).fill().map(() => 0)

const lletresPerindex = ABECEDARI.split('')
const getPosicioPerLletra = () => lletresPerindex.reduce((prev, lletra
) => ({
  ...prev,
  [lletra]: getLlistaPosicio()
}), {})

const getTotalPerLletra = () => lletresPerindex.reduce((prev, lletra
) => ({
  ...prev,
  [lletra]: 0
}), {})

const llistaLletresDeParaules = paraulesNormalitzades
.map(paraula => paraula.split(''))
.filter(paraula => 
  paraula.every(lletra => ABECEDARI.includes(lletra))
)



let restaLlistaLletraDeParaules = [...llistaLletresDeParaules]
let lletresJaUsades = []
let posicionsJaUsades = []
let maxLletraPerQuantitat = { quantitat: 0 }
let millorLletres = []

while(posicionsJaUsades.length < QUANTITAT_LLETRES){

  const posicioPerLletra = getPosicioPerLletra()
  const totalPerLletra = getTotalPerLletra()
  restaLlistaLletraDeParaules.forEach((llistaLletres) => {
    llistaLletres.forEach((lletra, index) => {
      totalPerLletra[lletra]++
      if(index in posicioPerLletra[lletra]){
        posicioPerLletra[lletra][index]++
      }
    })
  })


  Object.entries(posicioPerLletra)
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

  restaLlistaLletraDeParaules = restaLlistaLletraDeParaules.filter((llistaLletres) => 
    llistaLletres[maxLletraPerQuantitat.posicioLletra] === maxLletraPerQuantitat.lletra
  )

}

const millorParaula = millorLletres.join('')

const millorEntrada = paraulesOriginals[millorParaula]
console.log(millorEntrada)