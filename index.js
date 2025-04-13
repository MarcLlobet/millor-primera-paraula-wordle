const fs = require('fs');
const diccionari = fs.readFileSync('./diccionari/index.txt', 'utf-8');


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
  .filter(({origen}) => origen?.length === 5)
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

const getLlistaPosicio = () => Array(5).fill().map(() => 0)

const lletresPerindex = ABECEDARI.split('')
const getPosicioPerLletra = () => lletresPerindex.reduce((prev, lletra
) => ({
  ...prev,
  [lletra]: getLlistaPosicio()
}), {})

const llistaLletresDeParaules = paraulesNormalitzades.map(paraula => paraula.split(''))



let restaLlistaLletraDeParaules = [...llistaLletresDeParaules]
let lletresJaUsades = []
let posicionsJaUsades = []
let maxLletraPerQuantitat = { quantitat: 0 }
let millorParaula = []

while(posicionsJaUsades.length <= 5){

  const posicioPerLletra = getPosicioPerLletra()
  restaLlistaLletraDeParaules.forEach((llistaLletres) => {
    llistaLletres.forEach((lletra, index) => {
      if(ABECEDARI.includes(lletra) && index in posicioPerLletra[lletra]){
        posicioPerLletra[lletra][index]++
      }
    })
  })

  console.log('posicioPerLletra', posicioPerLletra)


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

      millorParaula[posicioLletra] = lletra
      
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

console.log(millorParaula, restaLlistaLletraDeParaules)

let y = millorParaula.join('')

let x = paraulesOriginals[y]
console.log(x, y)